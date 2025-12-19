import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { course, whatsapp, transactionId, upiName, upiId } = await req.json();

    if (!course || !whatsapp || !transactionId || !upiName || !upiId) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Save to Database
    const payment = await prisma.paymentRequest.create({
      data: {
        userEmail: session.user.email,
        course: `${course} | WA: ${whatsapp} | UPI: ${upiId} | Name: ${upiName}`,
        transactionId,
        status: "pending",
        // Note: The original schema didn't have 'whatsapp' field in PaymentRequest model.
        // I checked schema earlier: PaymentRequest { id, userEmail, course, transactionId, status, createdAt }
        // The user said "Do NOT refactor Prisma schema unless explicitly asked".
        // So I cannot save whatsapp number to PaymentRequest directly if the column doesn't exist.
        // However, I can maybe append it to the course string or assume the user might have missed it in the requirements.
        // Actually, looking at the schema provided earlier:
        // model PaymentRequest { id, userEmail, course, transactionId, status, createdAt }
        // There is NO whatsapp field.
        // Strategy: I will append it to 'course' for now to save it without schema change: "CourseName | WA: +91..."
        // Or I should have checked schema more carefully. The schema is LOCKED.
        // I will do: course = `${course} | WA: ${whatsapp}`
      },
    });

    return NextResponse.json({ success: true, id: payment.id });
  } catch (error) {
    console.error("Payment Submission Error details:", error);
    return NextResponse.json(
      { error: "Failed to submit payment", details: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  // Basic GET to fetch user payments
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Fetch payments and active courses in parallel
    const [payments, courses] = await Promise.all([
      prisma.paymentRequest.findMany({
        where: { userEmail: session.user.email },
        orderBy: { createdAt: "desc" },
      }),
      prisma.course.findMany({
        select: { title: true },
      }),
    ]);

    // Create a Set of active course titles (normalized)
    const activeCourseTitles = new Set(courses.map((c) => c.title.trim().toLowerCase()));

    // Filter payments to only include those for active courses
    const validPayments = payments.filter((payment) => {
      // The payment.course field is formatted as "Course Name | WA: ..."
      // We extract the course name part to check validity
      const courseName = payment.course.split("|")[0].trim().toLowerCase();
      return activeCourseTitles.has(courseName);
    });

    return NextResponse.json(validPayments);
  } catch (error) {
    console.error("Payment Fetch Error details:", error);
    return NextResponse.json({ error: "Error fetching payments", details: error.message, stack: error.stack }, { status: 500 });
  }
}
