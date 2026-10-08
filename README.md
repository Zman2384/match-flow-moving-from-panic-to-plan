# Welcome to your Bilt project

[![Built with Bilt](https://img.shields.io/endpoint?url=https%3A%2F%2Fapp.bilt.me%2Fapi%2Fbadge)](https://bilt.me)

## Project info

**Preview URL**: https://app.bilt.me/project/58e70cc0-1603-46dd-b6fe-0458a2d9e837/preview

**Project ID**: `58e70cc0-1603-46dd-b6fe-0458a2d9e837`

## How can I edit this app?

There are several ways of editing your application.

**Use Bilt**

Simply visit your [Bilt Project](https://app.bilt.me/agent/58e70cc0-1603-46dd-b6fe-0458a2d9e837) and start sending messages. Describe what you want to change, add, or fix in natural language.

Changes made via Bilt are instant - just send a message and your app updates.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can export the source code from Bilt and make changes directly.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Export and clone your Bilt project.
# (Download source from Bilt or connect to your git repo)
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the Expo development server.
npx expo start
```

Scan the QR code with Expo Go on your phone to see your app running locally.

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- React Native
- Expo
- TypeScript
- AsyncStorage (local data persistence)
- Expo Router (navigation)

All generated automatically by Bilt from your natural language instructions.

## How can I test this project?

**Option 1: Instant Preview (Recommended)**

Open the preview URL in your browser: `https://app.bilt.me/project/58e70cc0-1603-46dd-b6fe-0458a2d9e837/preview`

Scan the QR code with Expo Go ([iOS](https://apps.apple.com/app/expo-go/id982107779) | [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)) on your phone.

**Option 2: Run Locally**

```sh
npm install
npx expo start
```

Then scan the QR code with Expo Go.

## How can I deploy this project?

Go to your [Bilt Project](https://app.bilt.me/agent/58e70cc0-1603-46dd-b6fe-0458a2d9e837), after that go to Settings -> App Store.

### Deploy with Bilt

Simply send a message to your Bilt project: "Deploy this app to production"

Bilt will handle the build and provide you with download links or submission-ready builds.

## How can I make changes to my app?

**Via Bilt (Easiest)**

Visit your [Bilt Project](https://app.bilt.me/agent/58e70cc0-1603-46dd-b6fe-0458a2d9e837) and send a message describing what you want:

- "Add a dark mode toggle"
- "Change the button color to blue"
- "Add a new screen for user settings"
- "Fix the navigation bar spacing"

Bilt understands natural language and updates your app automatically.

**Via Code**

Export the source, make changes in your IDE, and test locally with `npx expo start`.

## Can I use this with the MCP protocol?

Yes! Bilt is available as a remote MCP server at `https://mcp.bilt.me/mcp`.

Connect any MCP-compatible AI agent (Claude Desktop, OpenClaw, etc.) to programmatically build and modify mobile apps.

**Example MCP integration:**

```json
{
  "mcpServers": {
    "bilt": {
      "transport": {
        "type": "sse",
        "url": "https://mcp.bilt.me/mcp/sse",
        "headers": {
          "Authorization": "Bearer YOUR_API_KEY"
        }
      }
    }
  }
}
```

Read more:

- [Bilt MCP Documentation](https://bilt.me/docs)
- [MCP Registry](https://registry.modelcontextprotocol.io/v0.1/servers/io.github.buildingapplications%2Fmcp/versions/latest)

## Lil Z: behind-the-scenes maintenance profile

Lil Z combines the existing MATCH Flow companion identity with a CDC Content & Resource Integration maintenance role. The server-side profile covers official-source monitoring, MATCH-specific filtering, provenance and date validation, public-resource change proposals, and privacy-safe audit summaries. Clinical changes require qualified human review before publication.

**Current status:** the deployed `lil-z` function answers user-triggered chat requests. The maintenance profile is configured, but continuous CDC monitoring, scheduled syncs, content/database writes, stored audit reporting, and external Bilt MCP lifecycle automation are **not connected or running**. A profile alone does not enable these capabilities or guarantee current medical guidance. App UI, local plans, Ghost Audits, and chat contracts are unchanged.

Private participant data must never enter a public-content maintenance pipeline, project workflow message, or audit log. Saved plans and audits remain device-local. Optional live chat still processes the disclosed context off-device only after the existing per-visit permission; uninstalling cannot erase external provider records or backups.

### External maintenance agent configuration

This declaration describes the intended role and documented tools; it is not an executable connection or scheduler. Connect an authorized external MCP client separately. Do not place credentials in the mobile app.

```json
{
  "agent_name": "Lil Z",
  "platform": "Bilt MCP Server",
  "primary_directive": "Support authorized MATCH Flow lifecycle workflows and reviewed CDC public-health content maintenance.",
  "supported_tools": [
    "bilt_list_projects",
    "bilt_get_project",
    "bilt_create_project",
    "bilt_get_session",
    "bilt_send_message",
    "bilt_cancel_workflow",
    "bilt_get_messages"
  ]
}
```

An authorized maintenance cycle should locate the existing project, check for active workflows, retrieve and validate official public sources, obtain clinical review for medical changes, submit approved instructions, and verify workflow results. Project creation, cancellation, and release publication require explicit authorization. Do not report a successful sync, build, or release without an actual result.

Each actual cycle should record source URL, source publication/update date, retrieval time, affected MATCH topic, public-content diff, validation outcome, reviewer decision, and pushed/modified/archived/flagged/failed status. Never log participant conversations, memories, plans, Ghost Audits, or identifiers.

Bilt references: [Available MCP tools](https://bilt.me/docs/api-reference/overview#available-tools), [Check before sending a message](https://bilt.me/docs/api-reference/bilt_get_session#check-before-sending-a-message), and [MCP setup](https://bilt.me/docs/quickstart-mcp).

## Need help?

- 📚 [Bilt Documentation](https://bilt.me/docs)
- 💬 [Discord Community](https://discord.gg/3FqNgmSYdZ)
- 🐦 [Twitter Updates](https://twitter.com/biltmeanapp)
- 📧 Email: support@bilt.me

---

<div align="center">

**Built by AI. No code required.** ✨

[Try Bilt](https://bilt.me) • [View Docs](https://bilt.me/docs) • [Docs MCP Server](https://bilt.me/docs/mcp)

</div>
