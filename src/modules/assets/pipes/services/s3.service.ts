import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import slugify from 'slugify';
import { StorageProvider } from './storage.provider';

@Injectable()
export class S3Service implements StorageProvider {
  private readonly s3: S3Client;
  private readonly bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });

    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME')!;
  }

  async upload(
    fileBuffer: Buffer,
    fileName: string,
    folderName?: string,
    mimeType?: string,
  ): Promise<string> {
    const key = `${folderName ?? 'uploads'}/${slugify(fileName)}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType || 'application/octet-stream',
    };

    //cloudfront Distribution domain name
    // https://d20dbqvplpyrs7.cloudfront.net/path-to-s3-object

    await this.s3.send(new PutObjectCommand(uploadParams));

    return `https://d20dbqvplpyrs7.cloudfront.net/${key}`;
  }

  async delete(fileKey: string): Promise<void> {
    const deleteParams = { Bucket: this.bucketName, Key: fileKey };

    await this.s3.send(new DeleteObjectCommand(deleteParams));
  }
}
