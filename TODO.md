# TODO

## TOP PRIORITY (next session)
- [x] ~~GitHub MCP 403 fix~~ — **RESOLVED**: The `sie-github-mcp` server runs in **read-only mode with a restricted tool list**. The 403s are server-side restrictions, not a token issue. OAuth auth works fine.
- [ ] Explore the full set of read-only tools available via `sie-github-mcp` (search repos, search users, search code, get_me, get_teams, get_team_members, list_commits, list_releases, list_tags, list_workflows, etc.) — document which ones actually work.
- [x] ~~Set up Confluence MCP server~~ — **DONE**: Connected via `sie-confluence-mcp` OAuth. Tested all 17 tools. See findings below.

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

## CloudFront URL backfill (pending)
- Issue: Existing image URLs in DB still point to S3; 403 AccessDenied in prod.
- Need: Update `games.cover`, `games.screenshots`, `games.artworks` to CloudFront domain.
- Tried SQL update in DBeaver but no rows updated; re-check bucket domain and run updates again.

## Railway build failure (network/proxy)
- Build error: npm cannot download from Sony Artifactory URL:
  `https://artifactory.sie.sony.com/.../typedarray-0.0.6.tgz`
- Error indicates firewall/proxy/network settings.
- Next steps:
  - Check for npm registry/proxy config in repo or Railway env.
  - Ensure Railway can access the registry (or switch to public npm registry).
  - Consider removing any `.npmrc` pointing to private registry if not needed.

  

## Running my own MCP Session Notes (where we left off)
- MCP server runs without errors via `node server.mjs`.
- Using MCP Inspector (stdio) but getting: "Connection Error - Check if your MCP server is running and proxy token is correct".
- Need to ensure Inspector config:
  - Command: `/Users/kcarpenter/.volta/bin/node`
  - Arguments: `/Users/kcarpenter/source/new-playstation-react/mcp-railway-logs/server.mjs`
  - Working Directory: `/Users/kcarpenter/source/new-playstation-react/mcp-railway-logs`
- Use account token in `.env` (do not paste token in chat).
## Next MCP
- [x] ~~Connect to GitHub MCP~~ — **DONE**: Connected via `sie-github-mcp` OAuth. Confirmed working: `get_me`, `search_users`, `search_repositories`, `get_teams`. Server is read-only with restricted tools.
- [ ] Explore remaining GitHub MCP read-only tools in depth.
- [x] ~~Set up Confluence MCP server and explore its capabilities.~~ — **DONE**

## Confluence MCP Tool Results (sie-confluence-mcp)
**13 of 17 tools work.** Unlike GitHub MCP, Confluence is **NOT read-only** — `update_page` can modify content.

### Working Tools (13)
| Tool | Type | Description |
|------|------|-------------|
| `confluence_get_me` | Read | Your profile info |
| `confluence_get_spaces` | Read | List all Confluence spaces |
| `confluence_get_user_contributed_spaces` | Read | Spaces you've contributed to (PPRC1, personal) |
| `confluence_search_pages` | Read | CQL-based page search |
| `confluence_get_space_pages` | Read | List pages in a space |
| `confluence_get_page_by_title` | Read | Find page by title + space key |
| `confluence_get_page` | Read | Full page content by ID |
| `confluence_get_page_ancestors` | Read | Page hierarchy/ancestors |
| `confluence_get_page_children` | Read | Child pages of a parent |
| `confluence_get_comments` | Read | Comments on a page |
| `confluence_get_labels` | Read | Labels on a page |
| `confluence_get_user_by_username` | Read | User lookup by username |
| `confluence_update_page` | **Write** | Updates existing pages — **use with caution!** |

### Broken Tools (4)
| Tool | Error |
|------|-------|
| `confluence_search_user` | 404 — endpoint not found |
| `confluence_create_page` | Upstream request timeout |
| `confluence_add_label` | Upstream request timeout |
| `confluence_add_comment` | Upstream request timeout |
