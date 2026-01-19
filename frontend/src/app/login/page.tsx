'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lock, Mail, Loader2, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const themeColor = '#0EA5E9'; // Sky blue

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        setError(''); // Clear error on typing
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Successful login
            router.push('/');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center p-4 mb-6 ring-1 ring-gray-100">
                        <img src="/logo.png" alt="Seva Auto Sales" className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Welcome Back</h1>
                    <p className="text-gray-400 font-medium mt-2 text-sm uppercase tracking-widest">Sign in to access dashboard</p>
                </div>

                <Card className="border-0 shadow-2xl shadow-sky-900/5 ring-1 ring-gray-100 overflow-hidden bg-white/80 backdrop-blur-xl">
                    <CardHeader className="pb-0">
                        <CardTitle className="sr-only">Login Form</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8 px-8 pb-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Admin ID"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter admin email"
                                icon={<Mail className="w-4 h-4" />}
                                required
                                className="bg-gray-50 border-gray-100"
                            />

                            <Input
                                label="Secure Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••••••"
                                icon={<Lock className="w-4 h-4" />}
                                required
                                className="bg-gray-50 border-gray-100"
                            />

                            {error && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                                    <div className="p-1.5 bg-red-100 rounded-full text-red-600">
                                        <Key className="w-3 h-3" />
                                    </div>
                                    <p className="text-xs font-bold text-red-600">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className={cn(
                                    "w-full h-12 text-white border-0 shadow-lg shadow-sky-500/20 transition-all hover:scale-[1.02] active:scale-95 text-sm font-black uppercase tracking-widest mt-4",
                                )}
                                style={{ backgroundColor: themeColor }}
                            >
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
                                {isLoading ? 'Authenticating...' : 'Secure Authorization'}
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
                                Restricted Access • Seva Auto Sales
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
