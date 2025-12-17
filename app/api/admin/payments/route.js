import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!session || session.user.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const payments = await prisma.paymentRequest.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: "Error fetching payments" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;

    if (!session || session.user.email !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id, status } = await req.json();

    const updatedPayment = await prisma.paymentRequest.update({
      where: { id },
      data: { status },
    });

    // If status is "approved", increment sales count for the course
    if (status === "approved" && updatedPayment.course) {
      // payment.course contains the Title name (e.g. "YouTube Monetization")
      // We must find the course by Title (or ID if we stored ID)
      // Since schema stores strings, we try to match title.
      // NOTE: Ideally we should store ID, but for now we match Title.
      await prisma.course.updateMany({
        where: { title: updatedPayment.course },
        data: {
          sales: { increment: 1 }
        }
      });
    }

    return NextResponse.json(updatedPayment);
  } catch (error) {
    console.error("Payment Update Error:", error);
    return NextResponse.json({ error: "Error updating payment" }, { status: 500 });
  }
}
