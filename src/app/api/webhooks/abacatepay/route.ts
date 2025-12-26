import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Map bill IDs (from URL) to credit amounts
const PLAN_CREDITS: Record<string, number> = {
    'bill_QApJc1sDxRPEhP5GQ4cytgwc': 1, // Basic
    'bill_stnGXHzHF6pDSu1zMCkQLhcU': 3, // Professional
    'bill_jrXZs4dsxaKgn0UPxrWeJ2zG': 5, // Premium
    'bill_06yCJrGRCBrQCa3NBwn6UhDu': 1  // Teste (R$ 1,00)
};

export async function POST(req: Request) {
    let event;
    try {
        const bodyText = await req.text();
        try {
            event = JSON.parse(bodyText);
        } catch (e) {
            console.error('[Webhook] Failed to parse JSON body:', bodyText.substring(0, 100));
            return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
        }

        // 1. Log event
        console.log('[Webhook] Raw Body Type:', typeof bodyText);
        console.log('[Webhook] Raw Body Snippet:', bodyText.substring(0, 200));
        console.log('[Webhook] Parsed Event keys:', event ? Object.keys(event) : 'null');
        console.log('[Webhook] Received event ID:', event?.eventId);
        console.log('[Webhook] Received event TYPE:', event?.type);

        // Security check (Optional: verify secret if available)
        // const signature = req.headers.get('abacatepay-signature');

        // 2. Handle 'BILLING_PAID'
        if (event.type === 'BILLING_PAID') {
            if (!event.data) {
                console.error('[Webhook] No data in event payload:', JSON.stringify(event));
                return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
            }

            const { customer, billingId, amount } = event.data;
            const email = customer?.email;

            if (!email) {
                console.error('[Webhook] No email in payload:', JSON.stringify(event.data));
                return NextResponse.json({ error: 'No email provided' }, { status: 400 });
            }

            // 3. Determine credits
            let creditsToAdd = 0;
            if (billingId && PLAN_CREDITS[billingId]) {
                creditsToAdd = PLAN_CREDITS[billingId];
            } else {
                // Fallback by amount (in cents)
                // 4990 = 49.90, etc.
                if (amount === 4990) creditsToAdd = 1;
                else if (amount === 9990) creditsToAdd = 3;
                else if (amount === 14990) creditsToAdd = 5;
            }

            console.log(`[Webhook] Processing ${creditsToAdd} credits for ${email} (Amount: ${amount}, BillingId: ${billingId})`);

            if (creditsToAdd > 0) {
                // 4. Find or Create User
                try {
                    let user = await prisma.user.findUnique({ where: { email } });

                    if (!user) {
                        console.log('[Webhook] Creating new user for', email);

                        // --- Supabase Invite Logic START ---
                        try {
                            const hasAdminKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
                            console.log(`[Webhook] Has SUPABASE_SERVICE_ROLE_KEY: ${hasAdminKey}`);

                            if (!hasAdminKey) {
                                console.error('[Webhook] CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing! Cannot invite user.');
                            }

                            const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                                data: { name: customer.name || 'Aluno' },
                                redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://certificaai.vercel.app'}/reset-password` // Route to handle password setting
                            });

                            if (inviteError) {
                                console.error('[Webhook] Supabase Invite Error:', inviteError.message);
                                // If user already exists in Supabase but not in Prisma (edge case), try sending a password reset
                                if (inviteError.message.includes('already registered') || inviteError.status === 422) {
                                    console.log('[Webhook] User exists in Supabase, sending password reset instead...');
                                    const { error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
                                        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'https://certificaai.vercel.app'}/reset-password`
                                    });
                                    if (resetError) console.error('[Webhook] Supabase Reset Error:', resetError.message);
                                }
                            } else {
                                console.log('[Webhook] Supabase Invite Sent:', inviteData);
                            }
                        } catch (supaError) {
                            console.error('[Webhook] Supabase Admin Exception:', supaError);
                        }
                        // --- Supabase Invite Logic END ---

                        user = await prisma.user.create({
                            data: {
                                email,
                                name: customer.name || 'Aluno',
                                role: 'STUDENT',
                                // @ts-ignore: Prisma Client might be out of sync
                                credits: creditsToAdd, // Initial credits
                            }
                        });
                    } else {
                        console.log('[Webhook] Updating existing user', email);
                        user = await prisma.user.update({
                            where: { email },
                            data: {
                                // @ts-ignore: Prisma Client might be out of sync
                                credits: { increment: creditsToAdd }
                            }
                        });
                    }

                    // 5. Create Purchase Record
                    if (!user) {
                        console.error('[Webhook] User not found/created');
                        return NextResponse.json({ error: 'User processing failed' }, { status: 500 });
                    }

                    console.log('[Webhook] Creating purchase record for user', user.id);
                    await prisma.purchase.create({
                        // @ts-ignore: Outdated Prisma Client requires courseId, but it is optional in schema
                        data: {
                            userId: user.id,
                            amount: amount / 100,
                            status: 'COMPLETED',
                            // courseId is optional, omitting it is safer than explicit null in some contexts
                        }
                    });

                    console.log('[Webhook] Success. Credits added and purchase recorded.');
                } catch (dbError) {
                    console.error('[Webhook] Database error:', dbError);
                    return NextResponse.json({ error: 'Database error' }, { status: 500 });
                }
            } else {
                console.warn('[Webhook] Zero credits determined. Skipping database update. Amount:', amount);
            }
        } else {
            console.log('[Webhook] Event type ignored:', event.type);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[Webhook] Unexpected Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
