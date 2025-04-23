import { Storage } from "@google-cloud/storage";
import { Readable } from "stream";

// Decode base64 service account key
const serviceAccount = JSON.parse(
  Buffer.from(process.env.GOOGLE_CLOUD_KEY || "", "base64").toString("utf-8")
);

const storage = new Storage({
  projectId: serviceAccount.project_id,
  credentials: {
    client_email: serviceAccount.client_email,
    private_key: serviceAccount.private_key.replace(/\\n/g, "\n"),
  },
});

const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME || "";

export async function uploadCSVToGCS(
  csvContent: string,
  fileName: string
): Promise<string> {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: "text/csv",
      },
    });

    return new Promise((resolve, reject) => {
      stream.on("error", (err) => reject(err));
      stream.on("finish", () => {
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        resolve(publicUrl);
      });

      Readable.from(csvContent).pipe(stream);
    });
  } catch (error) {
    console.error("Error uploading to GCS:", error);
    throw error;
  }
}

export async function getCSVFromGCS(fileName: string): Promise<string> {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    const [content] = await file.download();
    return content.toString("utf-8");
  } catch (error) {
    console.error("Error downloading from GCS:", error);
    throw error;
  }
}
