import { env } from "$env/dynamic/private";
import { S3, type DeleteObjectRequest, type PutObjectCommandInput } from "@aws-sdk/client-s3";

const s3 = new S3({
  credentials: {
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_ACCESS_KEY_SECRET,
  },
  region: env.S3_REGION,
  endpoint: env.S3_ENDPOINT,
});

export const uploadToS3 = async (fileData: File, fileId: string) => {
  const params: PutObjectCommandInput = {
    Bucket: env.S3_BUCKET_NAME,
    Key: fileId + "/" + fileData!.name,
    Body: new Uint8Array(await fileData.arrayBuffer()),
    ContentType: fileData.type,
  };

  const res = await s3.putObject(params);

  return res;
};

export const deleteFromS3 = async (fileId: string) => {
  const params: DeleteObjectRequest = {
    Bucket: env.S3_BUCKET_NAME,
    Key: fileId,
  };

  const res = await s3.deleteObject(params);

  return res;
};
