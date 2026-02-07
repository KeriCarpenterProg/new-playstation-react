# TODO - CloudFront CDN Migration

## Status (updated)
- CloudFront CDN is working locally and in production.
- Images now return CloudFront URLs on new uploads.

## What is already done
- Code changes:
  - `server/utils/s3Upload.js` now returns `CLOUDFRONT_URL` when set.
  - `server/utils/pictureUpload.js` now returns `CLOUDFRONT_URL` when set.

## Backlog Item
- Rework IGDB Import Games page UI/UX.
- Add all the other fields that I'm now importing onto the Import Games UI.

## MCP (Railway logs) - done
- Goal: Build an MCP server tool to fetch Railway service logs.
- IDs gathered:
  - RAILWAY_PROJECT_ID: 5e197c0c-229b-4ce1-be18-821a6cb7dcbc
  - RAILWAY_SERVICE_ID: eebece19-2ee1-402a-a9bb-32e4bd5c643d
- TODO:
  - Create/revoke Railway API token (do NOT paste token in chat).
  - Build MCP server with `get_logs({ service_id, lines })`.
  - Wire token via env var and test locally.

## MCP Session Notes (where we left off)
- MCP server runs without errors via `node server.mjs`.
- Using MCP Inspector (stdio) but getting: "Connection Error - Check if your MCP server is running and proxy token is correct".
- Need to ensure Inspector config:
  - Command: `/Users/kcarpenter/.volta/bin/node`
  - Arguments: `/Users/kcarpenter/source/new-playstation-react/mcp-railway-logs/server.mjs`
  - Working Directory: `/Users/kcarpenter/source/new-playstation-react/mcp-railway-logs`
- Use account token in `.env` (do not paste token in chat).
## Next MCP
- Connect to GitHub MCP (read PRs/issues, show demo).
