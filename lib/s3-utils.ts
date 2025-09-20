import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { Agent as HttpsAgent } from "https";
import { Readable } from "stream";

console.log("[S3] Initializing S3 client…");

const s3 = new S3Client({ 
    region: process.env.AWS_REGION,
    requestHandler: new NodeHttpHandler({
        httpsAgent: new HttpsAgent({ keepAlive: true, maxSockets: 256 }),
        socketAcquisitionWarningTimeout: 30000,
        connectionTimeout: 5000,
        socketTimeout: 300000,
    })
 });

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
    console.log(`[S3] Fetching s3://${bucketName}/${key}`);    
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

export async function getFileLastModified(bucketName: string, key: string): Promise<Date | undefined> {
    try {
        const command = new HeadObjectCommand({
            Bucket: bucketName,
            Key: key,
        });
        const response = await s3.send(command);
        return response.LastModified;
    } catch (error) {
        console.error(`Error getting last modified date for ${key}:`, error);
        return undefined;
    }
}

function streamToString(stream: Readable): Promise<string> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
        stream.on("error", (err) => reject(err));
    })
}
