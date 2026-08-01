/**
 * Uploads local image files to the S3 media bucket under a given key prefix.
 *
 * Stores objects by *key* (e.g. `kluang/attractions/lambak/hero.jpg`); the app
 * turns keys into URLs at read time via NEXT_PUBLIC_MEDIA_BASE_URL, so nothing
 * here needs to know the public URL or CDN.
 *
 * The AWS SDK is a devDependency — this is tooling, never shipped to the server
 * (production runs `npm ci --omit=dev`).
 *
 * Usage:
 *   node scripts/upload-media.mjs <local-file-or-dir> <key-prefix>
 * e.g.
 *   node scripts/upload-media.mjs ./photos/lambak.jpg kluang/attractions/gunung-lambak
 *   node scripts/upload-media.mjs ./photos/kluang     kluang            # whole dir
 *
 * Env (server-side S3 credentials — never NEXT_PUBLIC_):
 *   S3_BUCKET            e.g. kluang-lokaly-my
 *   S3_REGION            e.g. ap-southeast-5
 *   S3_ACCESS_KEY_ID
 *   S3_SECRET_ACCESS_KEY
 */

import { readFileSync, statSync, readdirSync } from 'node:fs';
import { basename, extname, join, posix } from 'node:path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

const [, , source, keyPrefix] = process.argv;
if (!source || !keyPrefix) {
  console.error('usage: node scripts/upload-media.mjs <local-file-or-dir> <key-prefix>');
  process.exit(1);
}

const CONTENT_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const client = new S3Client({
  region: requireEnv('S3_REGION'),
  credentials: {
    accessKeyId: requireEnv('S3_ACCESS_KEY_ID'),
    secretAccessKey: requireEnv('S3_SECRET_ACCESS_KEY'),
  },
});
const bucket = requireEnv('S3_BUCKET');

async function main() {
  // Build the upload list. For a directory, mirror its contents under the
  // prefix (the directory's own name is NOT included — the prefix replaces it).
  const stat = statSync(source);
  const uploads = [];
  if (stat.isFile()) {
    uploads.push([source, posix.join(keyPrefix, basename(source))]);
  } else {
    const walkDir = (dir, prefix) => {
      for (const entry of readdirSync(dir)) {
        const full = join(dir, entry);
        if (statSync(full).isDirectory()) walkDir(full, posix.join(prefix, entry));
        else uploads.push([full, posix.join(prefix, entry)]);
      }
    };
    walkDir(source, keyPrefix);
  }

  if (uploads.length === 0) {
    console.log('Nothing to upload.');
    return;
  }

  for (const [file, key] of uploads) {
    const ext = extname(file).toLowerCase();
    const contentType = CONTENT_TYPES[ext];
    if (!contentType) {
      console.warn(`skip  ${file} (unsupported type ${ext || '(none)'})`);
      continue;
    }
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: readFileSync(file),
        ContentType: contentType,
        // Long cache: media keys are content-addressed by path; overwrite with a
        // new key rather than mutating an existing one.
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
    console.log(`put   ${key}`);
  }

  console.log(`\nUploaded ${uploads.length} object(s) to s3://${bucket}/${keyPrefix}`);
  console.log('Store these KEYS in the DB (not full URLs); the app resolves them via');
  console.log('NEXT_PUBLIC_MEDIA_BASE_URL at read time.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
