
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'rodrigoviana50@gmail.com';
    console.log(`Setting plan for ${email} to Basic (1 credit)...`);

    const user = await prisma.user.upsert({
        where: { email },
        update: { credits: 1 },
        create: {
            email,
            name: 'Rodrigo Viana',
            credits: 1,
            role: 'STUDENT'
        },
    });

    console.log(`User ${user.email} updated. Credits: ${user.credits}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
