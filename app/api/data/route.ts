// Minimal route for server-side data retrieval (SSG/CSR test)
// Returns a snapshot of generated initial data (not used by streaming but kept for completeness)
import { NextResponse } from "next/server";
import { generateInitialDataset } from "@/lib/dataGenerator";

export async function GET() {
  const data = generateInitialDataset();
  return NextResponse.json({ initial: data });
}
