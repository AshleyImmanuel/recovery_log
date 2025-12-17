import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"; // Import from next-auth directly, sometimes next-auth/next is needed but trying standard first. Actually /next is standard for app dir usually but let's see.
import { authOptions } from "@/lib/auth";

export async function GET(request, props) {
    try {
        const params = await props.params;
        const id = params.id;

        if (!id) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

        const course = await prisma.course.findUnique({
            where: { id: id },
            include: {
                milestones: {
                    include: {
                        videos: {
                            orderBy: { order: 'asc' }
                        }
                    },
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Check Access
        let hasAccess = false;
        const session = await getServerSession(authOptions);

        if (session?.user?.email) {
            // Check for approved payment with stricter matching to avoid partial matches
            // e.g. "Course Pro" should not unlock "Course"
            const payments = await prisma.paymentRequest.findMany({
                where: {
                    userEmail: session.user.email,
                    status: 'approved',
                }
            });

            // Filter in JS because Prisma 'startsWith' is not strict enough for "Name" vs "Name Pro"
            // We expect payment.course to be "Course Title" OR "Course Title | extra info"
            const approvedPayment = payments.find(p =>
                p.course === course.title ||
                p.course.startsWith(course.title + " |")
            );

            if (approvedPayment) hasAccess = true;
        }

        return NextResponse.json({ ...course, hasAccess });
    } catch (error) {
        console.error("Error fetching course:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
