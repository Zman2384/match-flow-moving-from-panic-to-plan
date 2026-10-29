import { transform } from 'lightningcss';
import * as cssTree from 'css-tree';
import { Ident, LeftParenthesis, RightParenthesis } from 'css-tree/tokenizer';
import { strict as assert } from 'node:assert';
import { globSync, readFileSync } from 'node:fs';

// CSS Conditional Rules allows (<supports-condition>) as well as declarations.
// css-tree 3.2.1 speculatively parses both as SupportsDeclaration, reporting the
// failed declaration attempt through onParseError even when Condition succeeds.
// Dispatch unambiguous nested conditions before that attempt; leave declaration
// parsing and error recovery unchanged. No diagnostics are filtered out.
const syntax = cssTree.fork((config) => {
  const parseDeclaration = config.node.SupportsDeclaration.parse;
  config.node.SupportsDeclaration.parse = function () {
    const first = this.lookupTypeNonSC(1);
    const nested =
      first === LeftParenthesis || (first === Ident && this.lookupTypeNonSC(2) === LeftParenthesis);

    if (!nested) {
      return parseDeclaration.call(this);
    }

    this.eat(LeftParenthesis);
    const condition = this.Condition('supports');
    this.eat(RightParenthesis);
    return condition;
  };
  return config;
});

// Regression probes run with the lint gate: valid generated conditions must
// parse without recovery, while malformed CSS must still produce diagnostics.
for (const code of [
  '@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){a{color:red}}',
  '@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){a{color:red}}',
  '@supports (display:grid){a{color:red}}',
]) {
  const errors = [];
  syntax.parse(code, { onParseError: (error) => errors.push(error) });
  assert.equal(errors.length, 0, `Valid CSS produced diagnostics: ${code}`);
}
for (const code of [
  '@supports (display grid){a{color:red}}',
  '@supports ((display:grid) !){a{color:red}}',
  '@supports ((display:grid){a{color:red}}',
  'a{color:red;!}',
]) {
  const errors = [];
  try {
    syntax.parse(code, { onParseError: (error) => errors.push(error) });
  } catch (error) {
    errors.push(error);
  }
  assert.notEqual(errors.length, 0, `Malformed CSS escaped diagnostics: ${code}`);
}

// Lints CSS with two parsers, both already installed (no new deps):
//   [build]  lightningcss — the exact parser uniwind/expo runs, so a throw here
//            means the build WILL break. The authoritative gate.
//   [syntax] css-tree — stricter recovery parser (same engine as the VSCode CSS
//            hints). Catches generic mistakes lightningcss silently tolerates
//            (unclosed braces, stray tokens) before they bite elsewhere.
// ponytail: stylelint was rejected — its postcss parser ACCEPTS the @layer decl
// bug that breaks the build, so it would miss the very error this guards against.
let failed = false;
const report = (msg) => {
  failed = true;
  console.error(msg);
};

for (const file of globSync('**/*.css', { exclude: ['**/node_modules/**'] })) {
  const code = readFileSync(file);

  try {
    transform({ code, filename: file });
  } catch (e) {
    report(`${file}:${e.loc?.line ?? '?'}:${e.loc?.column ?? '?'}  [build]  ${e.message}`);
  }

  syntax.parse(code.toString(), {
    positions: true,
    onParseError: (e) => report(`${file}:${e.line}:${e.column}  [syntax] ${e.message}`),
  });
}

process.exit(failed ? 1 : 0);
