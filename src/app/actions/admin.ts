'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getAllUsers() {
    return await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            certificates: {
                include: {
                    course: {
                        select: { title: true }
                    }
                }
            },
            examAttempts: true
        }
    });
}

export async function getAllCertificates() {
    return await prisma.certificate.findMany({
        orderBy: { issuedAt: 'desc' },
        include: {
            course: {
                select: { title: true }
            },
            user: {
                select: { name: true, email: true }
            }
        }
    });
}

export async function getAllCourses() {
    const courses = await prisma.course.findMany({
        orderBy: { title: 'asc' },
        select: {
            id: true,
            title: true,
            _count: {
                select: { certificates: true, purchases: true }
            }
        }
    });
    return courses;
}

export async function deleteCourse(courseId: string) {
    try {
        await prisma.course.delete({
            where: { id: courseId }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete course:", error);
        return { success: false, error: "Failed to delete course" };
    }
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

export async function deleteCertificate(certificateId: string) {
    try {
        await prisma.certificate.delete({
            where: { id: certificateId }
        });
        revalidatePath('/admin');
        return { success: true };
    } catch (error) {
        console.error("Failed to delete certificate:", error);
        return { success: false, error: "Failed to delete certificate" };
    }
}
