import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

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

        // Normalize Event Type
        const eventType = event.type || event.event;
        console.log('[Webhook] Detected Event TYPE:', eventType);

        // 2. Handle 'BILLING_PAID' (AbacatePay sends 'billing.paid')
        if (eventType === 'BILLING_PAID' || eventType === 'billing.paid') {

            // Normalize Data Structure
            let payloadData = event.data;
            if (payloadData?.billing) {
                // Flatten structure: data.billing -> data
                payloadData = {
                    ...payloadData.billing,
                    customer: payloadData.billing.customer || payloadData.customer
                };
            }

            if (!payloadData) {
                console.error('[Webhook] No data in event payload:', JSON.stringify(event));
                return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
            }

            // Extract fields (AbacatePay 'billing' object has 'id', 'amount', 'customer')
            const billingId = payloadData.billingId || payloadData.id;
            const amount = payloadData.amount;
            const customer = payloadData.customer;
            const email = customer?.email || customer?.metadata?.email; // Fallback to metadata if needed

            if (!email) {
                console.error('[Webhook] No email in payload:', JSON.stringify(payloadData));
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

                        // Invite logic removed as per new flow.
                        // User will register manually via /register page.

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
