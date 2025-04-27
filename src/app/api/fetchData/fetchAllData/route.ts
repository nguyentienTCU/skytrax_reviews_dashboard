import { getChartData } from "@/lib/csv-parser";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getChartData("reviews.csv");
  return NextResponse.json(data);
}
