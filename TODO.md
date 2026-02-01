# TODO - CloudFront CDN Migration

## Status (as of last session)
- Goal: Switch image delivery from S3 URLs to CloudFront URLs (game images + profile pictures).
- Coding changes are done, but CloudFront is not working yet.
- Troubleshooting is pending.
- NOTE: Deployed server does NOT have CloudFront changes yet (local only).

## What is already done
- Code changes:
  - `server/utils/s3Upload.js` now returns `CLOUDFRONT_URL` when set.
  - `server/utils/pictureUpload.js` now returns `CLOUDFRONT_URL` when set.

## What remains to verify / fix
- CloudFront distribution created with:
  - Origin = S3 bucket (the bucket itself, not `games/` or `users/` folders).
  - OAC (Origin Access Control) enabled.
  - Viewer protocol policy = Redirect HTTP to HTTPS.
- S3 bucket policy updated to allow CloudFront OAC access.
- Block public access enabled on the bucket (optional but recommended).
- `CLOUDFRONT_URL` set in `server/.env`.

## How to verify it is working
1) Upload a NEW image (profile picture or game image).
2) Check the saved URL:
   - It should start with `https://<your-cloudfront-domain>/...`
3) Open that URL and inspect headers:
   - Look for `x-cache: Hit from cloudfront`
   - Look for `via: ... cloudfront`
   - Look for `x-amz-cf-id: ...`

## Notes
- Old images will NOT update; only NEW uploads will use CloudFront.
