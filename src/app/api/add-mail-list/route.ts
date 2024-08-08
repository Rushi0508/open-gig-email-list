import client from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const details = await req.json();
    const isExists = await client.subscriber.findFirst({
      where: {
        email: details.email,
      },
    });
    if (isExists) {
      return NextResponse.json({
        success: false,
        message: "Email already exists",
      });
    }
    const subscriber = await client.subscriber.create({
      data: {
        name: details.name,
        email: details.email,
        contact: details.contact,
      },
    });
    return NextResponse.json({ subscriber: subscriber, success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: false, errors: e });
  }
}
