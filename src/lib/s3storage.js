const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const client = new S3Client({
  region: process.env.STORAGE_REGION,
  endpoint: process.env.STORAGE_ENDPOINT,
  credentials: {
    accessKeyId: process.env.STORAGE_ACCESS_KEY_ID,
    secretAccessKey: process.env.STORAGE_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = 'requirement';

async function uploadFile(path, buffer, contentType) {
  await client.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: path,
    Body: buffer,
    ContentType: contentType,
  }));
  const projectUrl = process.env.SUPABASE_URL;
  return `${projectUrl}/storage/v1/object/public/${BUCKET}/${path}`;
}

module.exports = { uploadFile };
