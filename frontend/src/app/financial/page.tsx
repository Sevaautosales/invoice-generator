'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { IndianRupee, TrendingUp, Users, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function FinancialPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalSales: 0,
        totalCollected: 0,
        totalReceivables: 0,
        activeClients: 0,
    });

    useEffect(() => {
        fetchFinancialData();
    }, []);

    const fetchFinancialData = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*');

            if (error) throw error;

            const invoicesList = data || [];
            setInvoices(invoicesList);

            const totalSales = invoicesList.reduce((sum: number, inv: any) => sum + Number(inv.total_amount), 0);
            const totalCollected = invoicesList.reduce((sum: number, inv: any) => sum + Number(inv.amount_paid || 0), 0);
            const totalReceivables = invoicesList.reduce((sum: number, inv: any) => sum + Number(inv.balance_due || 0), 0);
            const activeClients = new Set(invoicesList.map((inv: any) => inv.customer_phone)).size;

            setStats({
                totalSales,
                totalCollected,
                totalReceivables,
                activeClients
            });
        } catch (error: any) {
            console.error('Error fetching financial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-black rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Financial Insights</span>
                    </div>
                    <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Ledger Overview</h2>
                    <p className="text-gray-400 font-medium mt-1 text-sm uppercase tracking-wider italic">Revenue & Growth Analytics</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-5 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">FY 2024-25</span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    label="Gross Revenue"
                    value={stats.totalSales}
                    icon={TrendingUp}
                    trend="+12.5%"
                    color="black"
                />
                <StatCard
                    label="Total Collected"
                    value={stats.totalCollected}
                    icon={IndianRupee}
                    trend="+8.2%"
                    color="gray"
                />
                <StatCard
                    label="Outstanding"
                    value={stats.totalReceivables}
                    icon={AlertCircle}
                    trend={stats.totalReceivables > 0 ? "Due" : "Clear"}
                    color={stats.totalReceivables > 0 ? "red" : "black"}
                />
                <StatCard
                    label="Total Clients"
                    value={stats.activeClients}
                    icon={Users}
                    isCurrency={false}
                    trend="Active"
                    color="gray"
                />
            </div>

            {/* Main Charts area (Mocked) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Card className="lg:col-span-8 border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                        <div>
                            <h3 className="text-xl font-black text-black tracking-tight uppercase">Monthly Growth</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Revenue Performance</p>
                        </div>
                        <div className="flex gap-2">
                            {['Jan', 'Feb', 'Mar', 'Apr'].map(month => (
                                <div key={month} className="px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-black uppercase text-gray-400 hover:bg-black hover:text-white transition-all cursor-pointer">
                                    {month}
                                </div>
                            ))}
                        </div>
                    </div>
                    <CardContent className="h-[400px] flex items-end justify-between p-12 gap-4 bg-white">
                        {/* Mock Chart Bars */}
                        {[65, 45, 85, 30, 95, 55, 75, 40].map((height, i) => (
                            <div key={i} className="flex-1 group relative">
                                <div
                                    className="w-full bg-gray-100 rounded-t-xl transition-all duration-500 group-hover:bg-black relative"
                                    style={{ height: `${height}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all">
                                        <span className="text-[9px] font-black text-black uppercase tracking-tighter whitespace-nowrap">
                                            {formatCurrency(height * 10000)}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-4 text-[9px] font-black text-gray-300 uppercase text-center tracking-widest">
                                    M-{i + 1}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-4 border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100 overflow-hidden bg-white">
                    <div className="p-8 border-b border-gray-50">
                        <h3 className="text-xl font-black text-black tracking-tight uppercase">Recent Flow</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Latest Transactions</p>
                    </div>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-50">
                            {invoices.slice(0, 6).map((inv, i) => (
                                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-2 h-2 rounded-full",
                                            Number(inv.balance_due) > 0 ? "bg-red-500" : "bg-black"
                                        )} />
                                        <div>
                                            <p className="text-xs font-black text-gray-900 tracking-tight">{inv.customer_name}</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{inv.invoice_number}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-gray-900">{formatCurrency(inv.total_amount)}</p>
                                        <p className={cn(
                                            "text-[9px] font-black uppercase tracking-tighter",
                                            Number(inv.balance_due) > 0 ? "text-red-500" : "text-gray-400"
                                        )}>
                                            {Number(inv.balance_due) > 0 ? `Due: ${formatCurrency(inv.balance_due)}` : 'Full Paid'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {invoices.length === 0 && (
                                <div className="p-20 text-center opacity-20">
                                    <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No Traffic Logged</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, trend, isCurrency = true, color = 'black' }: any) {
    const isRed = color === 'red';

    return (
        <Card className="border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100 overflow-hidden bg-white hover:ring-black transition-all group">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className={cn(
                        "p-3 rounded-2xl transition-all group-hover:scale-110",
                        isRed ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-900 group-hover:bg-black group-hover:text-white"
                    )}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        isRed ? "bg-red-50 text-red-600" : "bg-gray-50 text-gray-400"
                    )}>
                        {trend.startsWith('+') ? <ArrowUpRight className="w-2.5 h-2.5" /> : null}
                        {trend}
                    </div>
                </div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</h3>
                <p className={cn(
                    "text-3xl font-black tracking-tighter",
                    isRed ? "text-red-600" : "text-black"
                )}>
                    {isCurrency ? formatCurrency(value) : value}
                </p>
            </CardContent>
        </Card>
    );
}
