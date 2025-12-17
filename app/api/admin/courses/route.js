import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

// Helper to check admin permission
async function checkAdmin() {
    const session = await getServerSession();
    // Using strict email check from env
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL;

    if (!session || session.user?.email !== adminEmail) {
        return false;
    }
    return true;
}

export async function POST(req) {
    if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { title, price, description, features, milestones } = await req.json();

        // Handle both old 'features' style (if sent) AND new 'milestones'
        // Ideally we migrate 'features' array to a text block or deprecate it, 
        // but for now we focus on milestones.

        // Check for duplicates
        const existing = await prisma.course.findFirst({
            where: {
                title: { equals: title, mode: 'insensitive' }
            }
        });

        if (existing) {
            return NextResponse.json({ error: "Course with this title already exists" }, { status: 400 });
        }

        const course = await prisma.course.create({
            data: {
                title,
                price,
                description,
                milestones: {
                    create: (milestones || []).map((m, mIndex) => ({
                        title: m.title,
                        order: mIndex,
                        videos: {
                            create: (m.videos || []).map((v, vIndex) => ({
                                title: v.title,
                                videoId: v.videoId || v.url, // Fallback if UI sends url
                                order: vIndex
                            }))
                        }
                    }))
                }
            },
            include: {
                milestones: {
                    include: { videos: true }
                }
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id, title, price, description, features, milestones } = await req.json();

        // Transactional update:
        // 1. Update basic info
        // 2. Delete existing milestones (cascade delete videos) - Simplest way to sync complex nested state
        // 3. Re-create milestones and videos

        // Note: Prisma 'update' with { milestones: { deleteMany: {}, create: [] } } runs in a transaction.
        const course = await prisma.course.update({
            where: { id },
            data: {
                title,
                price,
                description,
                milestones: {
                    deleteMany: {}, // Clear old milestones
                    create: (milestones || []).map((m, mIndex) => ({
                        title: m.title,
                        order: mIndex,
                        videos: {
                            create: (m.videos || []).map((v, vIndex) => ({
                                title: v.title,
                                videoId: v.videoId || v.url,
                                order: vIndex
                            }))
                        }
                    }))
                }
            },
            include: {
                milestones: {
                    include: { videos: true }
                }
            }
        });

        return NextResponse.json(course);
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    if (!await checkAdmin()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        await prisma.course.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
