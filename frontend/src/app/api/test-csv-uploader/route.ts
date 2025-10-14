import { NextResponse } from "next/server";
import { fetchAndSaveData } from "@/lib/data-fetcher";

export async function GET() {
  try {
    await fetchAndSaveData();

    return NextResponse.json({
      success: true,
      message: "Data fetched and uploaded successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching and uploading data:", error);
    return NextResponse.json(
      { error: "Failed to fetch and upload data" },
      { status: 500 }
    );
  }
}
