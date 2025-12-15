'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShoppingCart, CreditCard, Lock } from 'lucide-react';
import styles from '../offer/offer.module.css'; // Borrowing styles for simplicity

export default function CheckoutSimulationPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get('plan') || 'basic';

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate network delay
        setTimeout(() => {
            // Redirect to register with pre-filled info
            // "MP returns to the system... with name and email filled"
            const params = new URLSearchParams();
            params.set('plan', plan);
            params.set('name', name);
            params.set('email', email);
            params.set('payment_id', 'mock_mp_' + Date.now());

            router.push(`/register?${params.toString()}`);
        }, 1500);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
            <div style={{ maxWidth: '480px', width: '100%', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ display: 'inline-flex', padding: '12px', background: '#dbeafe', borderRadius: '50%', marginBottom: '1rem' }}>
                        <ShoppingCart size={32} color="#2563eb" />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e293b' }}>Checkout Mercado Pago</h1>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Ambiente de Simulação (Mock)</p>
                </div>

                <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CreditCard size={20} color="#475569" />
                    <div>
                        <p style={{ fontWeight: '600', color: '#334155', margin: 0 }}>Plano Selecionado: {plan.toUpperCase()}</p>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Total a pagar: R$ {plan === 'pro' ? '99,90' : plan === 'premium' ? '149,90' : '49,90'}</p>
                    </div>
                </div>

                <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>Nome Completo</label>
                        <input
                            type="text"
                            required
                            placeholder="Seu nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>E-mail</label>
                        <input
                            type="email"
                            required
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: '#009ee3', // MP color
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: 'none',
                            fontWeight: '600',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            marginTop: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Processando...' : <><Lock size={18} /> Pagar com Mercado Pago</>}
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', marginTop: '1rem' }}>
                        Ao clicar, simula-se um pagamento aprovado e o redirecionamento de volta à loja.
                    </p>
                </form>
            </div>
        </div>
    );
}
