const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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
            console.log(`\nDUPLICATE GROUP: "${title}" (${list.length} entries)`);
            list.forEach(c => {
                const milestoneCount = c.milestones.length;
                const videoCount = c.milestones.reduce((acc, m) => acc + m.videos.length, 0);
                console.log(` - ID: ${c.id} | Created: ${c.createdAt.toISOString()} | Milestones: ${milestoneCount} | Videos: ${videoCount}`);
            });
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
