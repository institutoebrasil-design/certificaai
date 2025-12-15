'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function addCourse(form: FormData) {
    const title = form.get('title') as string;
    if (!title) return;

    await prisma.course.create({
        data: {
            title,
            description: `Certificação profissional em ${title}.`,
            price: 99.90,
            duration: 60,
            published: true,
        },
    });

    revalidatePath('/dashboard');
}
