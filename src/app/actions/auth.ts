'use server';

import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const plan = formData.get('plan') as string;
    const acceptedTerms = formData.get('acceptedTerms');

    if (!acceptedTerms) {
        return { success: false, error: "Você deve aceitar os termos e políticas." };
    }

    if (!email || !password || !name) {
        return { success: false, error: "Preencha todos os campos obrigatórios." };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return { success: false, error: "Este email já está cadastrado." };
    }

    // Determine credits based on plan
    let credits = 1; // Basic
    if (plan === 'pro') credits = 3;
    if (plan === 'premium') credits = 5;

    try {
        // Create user
        // TODO: Hash password before saving in production
        await prisma.user.create({
            data: {
                name,
                email,
                password, // Storing plain for logic demo; Use bcrypt in prod
                credits,
                role: 'STUDENT'
            }
        });

        // Simulate sending email
        console.log(`[Mock Email] Enviando confirmação para ${email}...`);

        return { success: true };
    } catch (error) {
        console.error("Registration error:", error);
        return { success: false, error: "Erro ao criar conta. Tente novamente." };
    }
}
