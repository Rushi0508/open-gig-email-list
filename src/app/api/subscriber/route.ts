import client from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    const subscriber = await client.subscriber.delete({
      where: {
        id: id,
      },
    });
    return NextResponse.json({ subscriber: subscriber, success: true });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ success: false, errors: e });
  }
}

export async function PUT(req: Request) {
  try {
    const details = await req.json();
    const subscriber = await client.subscriber.update({
      where: {
        id: details.id,
      },
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
