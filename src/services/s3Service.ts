import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

const bucketName = process.env.AWS_S3_BUCKET || 'tce-health-exams';

export async function uploadToS3(file: Express.Multer.File): Promise<string> {
  const fileExtension = file.originalname.split('.').pop();
  const fileName = `${uuidv4()}.${fileExtension}`;
  const key = `exams/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  });

  await s3Client.send(command);

  return `https://${bucketName}.s3.amazonaws.com/${key}`;
} 