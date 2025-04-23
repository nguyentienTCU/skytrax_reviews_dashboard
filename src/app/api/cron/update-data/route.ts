import { NextResponse } from "next/server";
import { fetchAndSaveData } from "@/lib/data-fetcher";

export async function GET() {
  try {
    // Check if it's Monday
    const today = new Date();
    if (today.getDay() !== 1) {
      // 1 is Monday
      return NextResponse.json({
        message: "Not Monday, skipping update",
        currentDay: today.getDay(),
      });
    }

    // Fetch and save data
    const result = await fetchAndSaveData();

    return NextResponse.json({
      success: true,
      message: "Data updated successfully",
      fileUrl: result.fileUrl,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in scheduled update:", error);
    return NextResponse.json(
      { error: "Failed to update data" },
      { status: 500 }
    );
  }
}
