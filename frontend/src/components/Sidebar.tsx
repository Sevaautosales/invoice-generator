'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ReceiptText, IndianRupee, Car, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Invoices', href: '/invoices', icon: ReceiptText },
    { name: 'Financial', href: '/financial', icon: IndianRupee },
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
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-black text-white rounded-xl shadow-lg hover:bg-gray-800 transition-all active:scale-95"
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
                    <div className="p-2 bg-black rounded-lg">
                        <Car className="w-6 h-6 text-white" />
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
                                        ? "bg-gray-100 text-black border border-gray-200 shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-black"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 transition-colors",
                                    isActive ? "text-black" : "text-gray-400 group-hover:text-black"
                                )} />
                                <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Status</p>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-gray-900" />
                            <span className="text-xs font-bold text-gray-900 uppercase">Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
