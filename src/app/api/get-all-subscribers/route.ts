import client from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const subscribers = await client.subscriber.findMany();
    return NextResponse.json({ subscribers: subscribers, success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: false, errors: e });
  }
}
