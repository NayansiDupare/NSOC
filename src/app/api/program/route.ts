import { stats } from "@/lib/data";

export async function GET() {
  return Response.json({ stats });
}
