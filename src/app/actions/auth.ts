'use server';

import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { randomUUID } from 'crypto';

export async function registerUser(formData: FormData) {
    console.log("Registering user via Supabase...");

    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const cpf = formData.get('cpf') as string;
        const password = formData.get('password') as string;
        const plan = formData.get('plan') as string;
        const acceptedTerms = formData.get('acceptedTerms');

        if (!acceptedTerms) return { success: false, error: "Você deve aceitar os termos e políticas." };
        if (!email || !password || !name || !cpf) return { success: false, error: "Preencha todos os campos obrigatórios." };

        // 1. Sign up with Supabase (Sends email automatically)
        const { data: supabaseData, error: supabaseError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { name, cpf, plan },
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://certificaai.vercel.app'}/login`
            }
        });

        if (supabaseError) {
            console.error("Supabase SignUp Error:", supabaseError);
            if (supabaseError.message.includes("already registered") || supabaseError.message.includes("User already exists")) {
                redirect('/login');
            }
            throw new Error(supabaseError.message);
        }

        if (!supabaseData.user) {
            throw new Error("Falha ao criar usuário no Supabase.");
        }

        // 2. Sync user to Prisma
        let credits = 1; // Basic
        if (plan === 'pro') credits = 3;
        if (plan === 'premium') credits = 5;

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (!existingUser) {
            console.log("Syncing user to local DB...");
            await prisma.user.create({
                data: {
                    name,
                    email,
                    cpf,
                    password: 'SUPABASE_AUTH', // Managed by Supabase
                    credits,
                    role: 'STUDENT',
                    emailVerified: null // Supabase handles verification
                }
            });
        }

        return { success: true };

    } catch (error: any) {
        if (error.message === 'NEXT_REDIRECT') throw error;
        console.error("Registration error:", error);
        return { success: false, error: error.message || "Erro no cadastro." };
    }
}

export async function verifyUserEmail(token: string) {
    // Deprecated for Supabase flow
    return { success: false, error: "Use o link enviado pelo Supabase." };
}

export async function loginUser(email: string, password?: string) {
    console.log(`[loginUser] START for ${email}`);

    // Critical Environment Check
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error("[loginUser] Critical: Supabase Env Vars missing on Server!");
        return { success: false, error: "Erro de Servidor (Chaves Supabase ausentes)." };
    }
    if (!process.env.DATABASE_URL) {
        console.error("[loginUser] Critical: DATABASE_URL missing on Server!");
        return { success: false, error: "Erro de Servidor (Banco de Dados não conectado)." };
    }

    if (!password) {
        return { success: false, error: "Senha necessária." };
    }

    try {
        console.log("[loginUser] Calling Supabase signIn...");
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        console.log("[loginUser] Supabase response received.");

        if (error) {
            console.error("[loginUser] Supabase Error:", error.message);
            if (error.message.includes("Email not confirmed")) {
                return { success: false, error: "Email não verificado. Verifique sua caixa de entrada." };
            }
            return { success: false, error: "Credenciais inválidas." };
        }

        if (data.user) {
            const localUser = await prisma.user.findUnique({ where: { email } });
            return {
                success: true,
                user: {
                    name: localUser?.name || 'User',
                    role: localUser?.role || 'STUDENT'
                }
            };
        }

        return { success: false, error: "Erro ao fazer login." };
    } catch (err) {
        console.error("[loginUser] Unexpected error:", err);
        return { success: false, error: "Erro interno no servidor." };
    }
}
