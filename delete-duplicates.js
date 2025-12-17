const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Analyzing duplicates...");

    // Fetch courses with their content counts
    const courses = await prisma.course.findMany({
        include: {
            milestones: {
                include: {
                    videos: true
                }
            }
        }
    });

    const grouped = {};
    courses.forEach(c => {
        const title = c.title.trim().toLowerCase();
        if (!grouped[title]) grouped[title] = [];
        grouped[title].push(c);
    });

    for (const [title, list] of Object.entries(grouped)) {
        if (list.length > 1) {
            console.log(`Processing duplicate group: "${title}" (${list.length} courses)`);

            // Sort by content (videos + milestones) to find the "best" one to keep
            // Also prioritize older creation date if content is equal (stability)
            list.sort((a, b) => {
                const aCount = a.milestones.length + a.milestones.reduce((acc, m) => acc + m.videos.length, 0);
                const bCount = b.milestones.length + b.milestones.reduce((acc, m) => acc + m.videos.length, 0);
                if (bCount !== aCount) return bCount - aCount; // Descending content
                return new Date(a.createdAt) - new Date(b.createdAt); // Ascending date (keep oldest)
            });

            const toKeep = list[0];
            const toDelete = list.slice(1);

            console.log(` -> Keeping ID: ${toKeep.id} (Content score: ${toKeep.milestones.length})`);

            for (const c of toDelete) {
                console.log(` -> Deleting ID: ${c.id}`);
                // Delete course (Cascade deletion of milestones/videos handled by schema usually, or we explicity delete here if needed)
                // Schema says: milestones Milestone[] (no rigid cascade defined in this relation side on Prisma normally unless @relation(onDelete: Cascade) in Milestone)
                // Let's check Milestone model: course Course @relation(fields: [courseId], references: [id], onDelete: Cascade)
                // Yes, it has Cascade.
                await prisma.course.delete({ where: { id: c.id } });
            }
        }
    }
    console.log("Cleanup complete.");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
