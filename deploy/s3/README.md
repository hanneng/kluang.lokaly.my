# S3 media bucket setup

The app stores image **object keys** in the database (e.g.
`kluang/attractions/gunung-lambak/hero.jpg`) and resolves them to URLs at read
time against `NEXT_PUBLIC_MEDIA_BASE_URL` (see `src/lib/media.ts`). So the
bucket only has to do two things: be **publicly readable** (so browsers can
fetch images), and accept **uploads** from our tooling.

Bucket: `kluang-lokaly-my` · Region: `ap-southeast-5` (AWS Malaysia).

Direct-S3 public base URL:
`https://kluang-lokaly-my.s3.ap-southeast-5.amazonaws.com`

> These are public tourism photos — nothing sensitive — so a public-read bucket
> is appropriate. For a private bucket + CDN instead, see "CloudFront" below;
> the app supports it with only an env change.

## 1. Make the bucket public-read

S3 blocks public access by default. Two steps, both in the S3 console
(**S3 → kluang-lokaly-my**):

**a. Permissions → Block public access (bucket settings) → Edit.** Uncheck
**Block *all* public access**. Confirm. (You can leave the two "…via *new* ACLs"
options checked — we grant access with a bucket *policy*, not ACLs.)

**b. Permissions → Bucket policy → Edit.** Paste `bucket-policy.json` from this
folder (grants anonymous `s3:GetObject` on `…/*` only — read, never write).

Or with the AWS CLI:
```bash
aws s3api put-public-access-block --bucket kluang-lokaly-my \
  --public-access-block-configuration \
  BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=false,RestrictPublicBuckets=false
aws s3api put-bucket-policy --bucket kluang-lokaly-my \
  --policy file://deploy/s3/bucket-policy.json
```

Verify (should become `200` once an object exists, `403`→`404` immediately):
```bash
curl -I https://kluang-lokaly-my.s3.ap-southeast-5.amazonaws.com/any-test-key
```

## 2. (Optional) CORS

Only needed if a browser ever fetches these images with JS (canvas, `fetch`).
Plain `<img>`/`next/image` does **not** need CORS. If you want it, apply
`cors.json` (**Permissions → Cross-origin resource sharing (CORS)**).

## 3. Credentials for uploads

Uploads run from a workstation via `scripts/upload-media.mjs`, which needs an
IAM user with **only** `PutObject` on this bucket — not your root keys.

1. **IAM → Users → Create user** (e.g. `kluang-media-uploader`), *no* console
   access.
2. Attach an inline policy = `upload-iam-policy.json` from this folder.
3. **Create access key** (type: "Application running outside AWS"). Save the
   key id + secret.

## 4. Upload images

From the repo root, with the uploader's key in the environment:

```bash
export S3_BUCKET=kluang-lokaly-my
export S3_REGION=ap-southeast-5
export S3_ACCESS_KEY_ID=AKIA...
export S3_SECRET_ACCESS_KEY=...

# one file
node scripts/upload-media.mjs ./photos/lambak.jpg kluang/attractions/gunung-lambak
# a whole folder (tree mirrored under the prefix)
node scripts/upload-media.mjs ./photos/kluang kluang
```

The script prints each **key** it wrote. Put those keys in the database
`featured_image`/`gallery` fields (as `{ "src": "<key>", "alt": "..." }`) — not
full URLs. The app builds the URL from `NEXT_PUBLIC_MEDIA_BASE_URL`.

## 5. Point the app at the bucket

Set on the server, in `/opt/lokaly/app/.env.production`:

```
NEXT_PUBLIC_MEDIA_BASE_URL=https://kluang-lokaly-my.s3.ap-southeast-5.amazonaws.com
```

Then rebuild + redeploy (this is a `NEXT_PUBLIC_` var, so it's baked at build
time — a restart alone is not enough):

```bash
deploy/build-and-deploy.sh ubuntu@<ip> key.pem
```

Existing DB rows that still reference `/images/placeholders/*.svg` keep working
(local paths pass through unchanged) — only rows whose `src` is an S3 key start
loading from the bucket. Migrate content image-by-image, no big-bang cutover.

## CloudFront (later, optional)

For CDN caching / a `cdn.lokaly.my` domain / keeping the bucket private:
put a CloudFront distribution with **Origin Access Control** in front of the
bucket, then set `NEXT_PUBLIC_MEDIA_BASE_URL=https://cdn.lokaly.my` and redeploy.
No code or data changes — the keys in the DB are unchanged.
