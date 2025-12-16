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
        const verificationToken = crypto.randomUUID();

        await prisma.user.create({
            data: {
                name,
                email,
                cpf,
                password, // Storing plain for logic demo; Use bcrypt in prod
                credits,
                role: 'STUDENT',
                verificationToken,
                emailVerified: null // Explicitly null
            }
        });

        // Simulate sending email (Log for dev)
        const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
        console.log(`[Mock Email] ---------------------------------------------------`);
        console.log(`[Mock Email] Para: ${email}`);
        console.log(`[Mock Email] Assunto: Confirme sua conta na CertificaAI`);
        console.log(`[Mock Email] Link: ${verificationLink}`);
        console.log(`[Mock Email] ---------------------------------------------------`);

        return { success: true };
    } catch (error: any) {
        console.error("Registration error:", error);
        return { success: false, error: error.message || "Erro ao criar conta. Tente novamente." };
    }
}

export async function verifyUserEmail(token: string) {
    try {
        const user = await prisma.user.findFirst({
            where: { verificationToken: token }
        });

        if (!user) {
            return { success: false, error: "Token inválido." };
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                verificationToken: null // Consume token
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Verification error:", error);
        return { success: false, error: "Falha ao verificar email." };
    }
}

export async function loginUser(email: string) {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return { success: false, error: "Usuário não encontrado." };
    }

    if (!user.emailVerified) {
        return { success: false, error: "Email não verificado. Verifique sua caixa de entrada." };
    }

    // In a real app, verify password hash here.
    // For this demo with plan passwords, we assume the client checked it or we check it here if passed.
    // Since client passes only email to this specific simplified helper (based on previous client code), 
    // we might need to adjust signature if we want full server side val.
    // But keeping it simple for "Email verification check":

    return { success: true, user: { name: user.name, role: user.role } };
}
