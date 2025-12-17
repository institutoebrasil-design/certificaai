import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Map bill IDs (from URL) to credit amounts
const PLAN_CREDITS: Record<string, number> = {
    'bill_QApJc1sDxRPEhP5GQ4cytgwc': 1, // Basic
    'bill_stnGXHzHF6pDSu1zMCkQLhcU': 3, // Professional
    'bill_jrXZs4dsxaKgn0UPxrWeJ2zG': 5  // Premium
};

export async function POST(req: Request) {
    try {
        const event = await req.json();

        // 1. Log event
        console.log('[Webhook] Received event:', event.eventId, event.type);

        // 2. Handle 'BILLING_PAID'
        if (event.type === 'BILLING_PAID') {
            const { customer, billingId, amount } = event.data;
            const email = customer.email;

            if (!email) {
                console.error('[Webhook] No email in payload');
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

            console.log(`[Webhook] Processing ${creditsToAdd} credits for ${email} (Amount: ${amount / 100})`);

            if (creditsToAdd > 0) {
                // 4. Find or Create User
                // We use a transaction or sequential operations. 
                // Since we might need to create, let's look up first.

                let user = await prisma.user.findUnique({ where: { email } });

                if (!user) {
                    console.log('[Webhook] Creating new user for', email);
                    user = await prisma.user.create({
                        data: {
                            email,
                            name: customer.name || 'Aluno',
                            role: 'STUDENT',
                            credits: creditsToAdd, // Initial credits
                            // password is null, they must reset or use magic link if implemented
                        }
                    });
                } else {
                    console.log('[Webhook] Updating existing user', email);
                    user = await prisma.user.update({
                        where: { email },
                        data: {
                            credits: { increment: creditsToAdd }
                        }
                    });
                }

                // 5. Create Purchase Record
                // We leave courseId null for "Credits" purchase. 
                // Schema allows courseId? @unique (Postgres allows multiple nulls).
                await prisma.purchase.create({
                    data: {
                        userId: user.id,
                        amount: amount / 100,
                        status: 'COMPLETED',
                        courseId: null, // Generic credit purchase
                    }
                });

                console.log('[Webhook] Success. Credits added and purchase recorded.');
            } else {
                console.log('[Webhook] Zero credits determined. Skipping database update.');
            }
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('[Webhook] Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
