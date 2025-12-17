import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  const email = req.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json([], { status: 200 });
  }

  const payments = await prisma.paymentRequest.findMany({
    where: { userEmail: email },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(payments);
}
