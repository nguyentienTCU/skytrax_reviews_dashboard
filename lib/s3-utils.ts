import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3 = new S3Client({ region: "us-east-1" });

export async function uploadFileToS3Bucket(file: String, bucketName: string, key: string): Promise<void> {
    try {
        const body = Buffer.from(file, "utf-8");
        await s3.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: key,
            Body: body,
        }))
    } catch (err) {
        console.log("Upload failed:", err);
    }
}

export async function getFileContentFroms3Bucket(bucketName: string, key: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });
        const response = await s3.send(command);

        if (!response.Body || !(response.Body instanceof Readable)) {
            throw new Error("No body in response");
        }

        const content = await streamToString(response.Body);
        return content;
}

function streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        stream.on("error", (err) => reject(err));
    })
}
