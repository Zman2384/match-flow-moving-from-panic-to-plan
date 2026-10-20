/** @type {import('expo/metro-config').MetroConfig} */
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

const config = getDefaultConfig(__dirname);

const unique = (values) => Array.from(new Set(values));

// Expo already includes the common source and asset extensions. Keep only the
// extra web-facing assets this template needs.
config.resolver.assetExts = unique([...config.resolver.assetExts, 'woff', 'woff2', 'ico']);

const firstHeaderValue = (value) => {
  if (!value) return undefined;
  const firstValue = Array.isArray(value) ? value[0] : String(value);
  const cleanValue = firstValue.split(',')[0]?.trim();
  return cleanValue || undefined;
};

const hostHasPort = (host) => (host.startsWith('[') ? host.includes(']:') : host.includes(':'));

const getForwardedProtocol = (req) =>
  firstHeaderValue(req.headers['x-forwarded-proto']) ??
  (req.secure || req.headers['x-forwarded-ssl'] === 'on' ? 'https' : 'http');

const getProxyHost = (req) => {
  const originalHost = firstHeaderValue(req.headers['x-original-host']);
  if (originalHost) return originalHost;

  const forwardedHost = firstHeaderValue(req.headers['x-forwarded-host']);
  if (!forwardedHost) return firstHeaderValue(req.headers.host);

  const forwardedPort = firstHeaderValue(req.headers['x-forwarded-port']);
  if (!forwardedPort || hostHasPort(forwardedHost)) return forwardedHost;

  return `${forwardedHost}:${forwardedPort}`;
};

const normalizeProxyHeaders = (req) => {
  const host = getProxyHost(req);
  if (host) req.headers.host = host;

  for (const headerName of ['x-forwarded-host', 'x-original-host']) {
    const value = firstHeaderValue(req.headers[headerName]);
    if (value) req.headers[headerName] = value;
  }

  delete req.headers['x-target-host'];

  const protocol = getForwardedProtocol(req);
  req.protocol = protocol;
  req.secure = protocol === 'https';

  if (req.url && !req.url.startsWith('/')) {
    req.url = `/${req.url}`;
  }
};

const existingEnhanceMiddleware = config.server?.enhanceMiddleware;

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, server) => {
    const metroMiddleware = existingEnhanceMiddleware
      ? existingEnhanceMiddleware(middleware, server)
      : middleware;

    return (req, res, next) => {
      normalizeProxyHeaders(req);
      return metroMiddleware(req, res, next);
    };
  },
};

const defaultResolveRequest = config.resolver.resolveRequest;

const shouldResolveEmpty = (moduleName, platform) =>
  (moduleName === 'react-native-maps' && platform === 'web') ||
  (moduleName === 'posthog-js' && platform !== 'web');

// lucide-react-native's package "exports" hide its per-icon files. lib/icons.ts
// imports them directly so only the icons in use are bundled.
const LUCIDE_ICON_PREFIX = 'lucide-react-native/dist/esm/icons/';
const lucideRoot = path.resolve(path.dirname(require.resolve('lucide-react-native')), '../..');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (shouldResolveEmpty(moduleName, platform)) {
    return { type: 'empty' };
  }

  if (moduleName.startsWith(LUCIDE_ICON_PREFIX)) {
    return {
      type: 'sourceFile',
      filePath: path.join(
        lucideRoot,
        'dist/esm/icons',
        moduleName.slice(LUCIDE_ICON_PREFIX.length),
      ),
    };
  }

  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts',
});
