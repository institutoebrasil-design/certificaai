
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Starting Debug ---');

    // 1. Get User
    const email = 'rodrigoviana50@gmail.com';
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log('User not found, creating...');
        user = await prisma.user.create({
            data: {
                email,
                name: 'Rodrigo Debug',
                credits: 5
            }
        });
    }
    console.log(`User ID: ${user.id}, Credits: ${user.credits}`);

    // 2. Get a Course
    const course = await prisma.course.findFirst();
    if (!course) {
        console.error("No courses found in DB! Cannot test certificate creation.");
        return;
    }
    console.log(`Course ID: ${course.id}, Title: ${course.title}`);

    // 3. Simulate Certificate Creation (Logic from consumeDownloadCredit)
    console.log('Attempting to create certificate...');
    try {
        const certificate = await prisma.certificate.create({
            data: {
                userId: user.id,
                courseId: course.id,
                code: Math.random().toString(36).substring(2, 12).toUpperCase()
            }
        });
        console.log('SUCCESS: Certificate created!');
        console.log(certificate);
    } catch (error) {
        console.error('FAILURE: Error creating certificate:');
        console.error(error);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
