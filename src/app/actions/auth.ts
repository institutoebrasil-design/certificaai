'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const cpf = formData.get('cpf') as string;
    const password = formData.get('password') as string;
    const plan = formData.get('plan') as string;
    const acceptedTerms = formData.get('acceptedTerms');

    if (!acceptedTerms) {
        return { success: false, error: "Você deve aceitar os termos e políticas." };
    }

    if (!email || !password || !name || !cpf) {
        return { success: false, error: "Preencha todos os campos obrigatórios." };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        // User exists -> Redirect to login as requested
        redirect('/login');
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
                cpf,
                password, // Storing plain for logic demo; Use bcrypt in prod
                credits,
                role: 'STUDENT'
            }
        });

        // Simulate sending email
        console.log(`[Mock Email] Enviando confirmação para ${email}...`);

        return { success: true };
    } catch (error: any) {
        console.error("Registration error:", error);
        return { success: false, error: error.message || "Erro ao criar conta. Tente novamente." };
    }
}
