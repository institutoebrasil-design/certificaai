'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Award, Shield } from 'lucide-react';

export default function DashboardNav({ role = 'STUDENT' }: { role?: string }) {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    const navStyle = (path: string) => ({
        textDecoration: 'none',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: isActive(path) ? '700' : '500',
        color: isActive(path) ? '#b00000' : '#64748b',
        borderBottom: isActive(path) ? '3px solid #b00000' : '3px solid transparent',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    });

    return (
        <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', borderBottom: '1px solid #e5e7eb', paddingBottom: '0' }}>
            <Link href="/dashboard" style={navStyle('/dashboard')}>
                <BookOpen size={20} /> Certificações Disponíveis
            </Link>
            <Link href="/my-certificates" style={navStyle('/my-certificates')}>
                <Award size={20} /> Meus Certificados
            </Link>
            {role === 'ADMIN' && (
                <Link href="/admin" style={navStyle('/admin')}>
                    <Shield size={20} /> Administração
                </Link>
            )}
        </div>
    );
}
