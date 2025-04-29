import { getTimebasedAnalysis } from "@/lib/getData/getTimebasedAnalysis";
import { NextResponse } from "next/server";

export const GET = async () => {
  const data = await getTimebasedAnalysis();
  return NextResponse.json(data);
};