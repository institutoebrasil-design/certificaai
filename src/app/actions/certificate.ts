'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Mock user ID for now as we don't have real auth yet. 
// In a real app, this would come from the session.
// We will grab the first user found or a specific test user.
async function getUserId() {
    // Hardcoded for testing validation as requested
    const email = 'rodrigoviana50@gmail.com';
    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                name: 'Rodrigo Viana',
                credits: 1 // Default to Basic as requested
            }
        });
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
