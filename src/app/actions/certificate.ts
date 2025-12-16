'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

import { cookies } from 'next/headers';

// Get user from cookie
async function getUserId() {
    const cookieStore = await cookies();
    const authEmail = cookieStore.get('auth_email')?.value;

    if (!authEmail) {
        throw new Error("Usuário não autenticado.");
    }

    let user = await prisma.user.findUnique({
        where: { email: authEmail }
    });

    if (!user) {
        throw new Error("Usuário não encontrado.");
    }
    return user.id;
}

export async function consumeDownloadCredit(courseId: string) {
    try {
        const userId = await getUserId();
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (user.credits <= 0) {
            return { success: false, error: 'Insufficient credits', redirect: '/offer' };
        }

        // Decrement credit
        await prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: 1 } }
        });

        // Create Certificate
        const certificate = await prisma.certificate.create({
            data: {
                userId,
                courseId, // We need to pass this now
                code: Math.random().toString(36).substring(2, 12).toUpperCase()
            }
        });

        revalidatePath('/dashboard');
        return { success: true, remaining: user.credits - 1, certificateId: certificate.id };

    } catch (error: any) {
        console.error('Error consuming credit:', error);
        return { success: false, error: error.message || 'System error' };
    }
}

export async function checkCredits() {
    const userId = await getUserId();
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });
    return user?.credits || 0;
}
