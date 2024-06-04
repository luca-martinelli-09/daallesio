import { S3_ACCESS_KEY_ID, S3_ACCESS_KEY_SECRET, S3_BUCKET_NAME, S3_ENDPOINT, S3_REGION } from "$env/static/private";
import S3, { type DeleteObjectRequest, type PutObjectRequest } from "aws-sdk/clients/s3";

export const uploadToS3 = async (fileData: File, fileId: string) => {
  const s3 = new S3({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_ACCESS_KEY_SECRET,
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
  });

  const params: PutObjectRequest = {
    Bucket: S3_BUCKET_NAME,
    Key: fileId + "/" + fileData!.name,
    Body: new Uint8Array(await fileData.arrayBuffer()),
    ContentType: fileData.type,
  };

  const res = await s3.upload(params).promise();

  return res;
};

export const deleteFromS3 = async (fileId: string) => {
  const s3 = new S3({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_ACCESS_KEY_SECRET,
    region: S3_REGION,
    endpoint: S3_ENDPOINT,
  });

  const params: DeleteObjectRequest = {
    Bucket: S3_BUCKET_NAME,
    Key: fileId,
  };

  const res = await s3.deleteObject(params).promise();

  return res;
};
