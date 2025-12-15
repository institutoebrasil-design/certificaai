
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'rodrigoviana50@gmail.com';
    console.log(`Renewing credits for ${email} to 1 (Basic)...`);

    const user = await prisma.user.update({
        where: { email },
        data: { credits: 1 }
    });

    console.log(`User ${user.email} updated. New Credits: ${user.credits}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
