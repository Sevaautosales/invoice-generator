'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, IndianRupee, History, Menu, X, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: ReceiptText },
    { name: 'Financials', href: '/financial', icon: IndianRupee },
    { name: 'History', href: '/history', icon: History },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            {/* Mobile Menu Button - Fixed at top-left */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-sky-500 text-white rounded-xl shadow-lg hover:bg-sky-600 transition-all active:scale-95"
                aria-label="Toggle menu"
            >
                {isMobileMenuOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <Menu className="w-6 h-6" />
                )}
            </button>

            {/* Mobile Backdrop */}
            {isMobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "flex flex-col w-64 border-r bg-white min-h-screen transition-transform duration-300 ease-in-out z-40",
                    // Desktop: always visible
                    "lg:translate-x-0 lg:relative",
                    // Mobile: slide in from left
                    "fixed inset-y-0 left-0",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center gap-2 px-6 py-8 border-b">
                    <div className="flex-shrink-0">
                        <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-black">Seva Auto Sales</h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Invoicing</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                    isActive
                                        ? "bg-sky-50 text-sky-600 border border-sky-100 shadow-sm"
                                        : "text-gray-500 hover:bg-sky-50/50 hover:text-sky-600"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-sky-600" : "text-gray-400 group-hover:text-sky-600"
                                )} />
                                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t mt-auto">
                    <button
                        onClick={async () => {
                            await fetch('/api/auth/logout', { method: 'POST' });
                            window.location.href = '/login';
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                    >
                        <LogOut className="w-5 h-5 transition-colors text-gray-400 group-hover:text-red-600" />
                        <span className="font-bold text-sm tracking-tight">Logout</span>
                    </button>
                </div>
            </div>
        </>
    );
}
