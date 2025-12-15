'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

export async function getAllUsers() {
    return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            certificates: true,
            examAttempts: true
        }
    });
}

export async function updateUserCredits(userId: string, amount: number) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                credits: {
                    increment: amount
                }
            }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Failed to update credits:", error);
        return { success: false, error: "Failed to update credits" };
    }
}
