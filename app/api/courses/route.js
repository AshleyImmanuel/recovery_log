import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const courses = await prisma.course.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                milestones: {
                    orderBy: { order: 'asc' },
                    include: {
                        videos: {
                            orderBy: { order: 'asc' }
                        }
                    }
                }
            }
        });

        // Calculate sales count based on approved payments
        // We fetch all approved payments to aggregate counts
        // Optimization: For large scale, this should be a groupBy query, but schema limitation (course string) requires parsing.
        const approvedPayments = await prisma.paymentRequest.findMany({
            where: { status: "approved" },
            select: { course: true }
        });

        const coursesWithStats = courses.map(course => {
            const courseTitle = course.title ? course.title.trim() : "";
            const salesCount = approvedPayments.filter(p => {
                if (!p.course) return false;
                const parts = p.course.split("|");
                // Safety check if split failed or empty
                if (!parts || parts.length === 0) return false;
                const pTitle = parts[0];
                return pTitle && pTitle.trim() === courseTitle;
            }).length;
            return { ...course, sales: salesCount };
        });

        return NextResponse.json(coursesWithStats);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
