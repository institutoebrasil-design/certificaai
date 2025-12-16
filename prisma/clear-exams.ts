
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.exam.count();
    console.log(`Initial Exam count: ${count}`);

    if (count > 0) {
        const deleted = await prisma.exam.deleteMany({});
        console.log(`Deleted ${deleted.count} exams.`);
    } else {
        console.log("No exams found in database.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
