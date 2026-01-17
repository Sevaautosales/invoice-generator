'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths, isSameMonth, parseISO } from 'date-fns';

export default function FinancialPage() {
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalSales: 0,
        activeClients: 0,
        thisMonthSales: 0,
        growth: 0
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

            // Calculate overall stats
            const totalSales = invoicesList.reduce((sum: number, inv: any) => sum + Number(inv.total_amount), 0);
            const activeClients = new Set(invoicesList.map((inv: any) => inv.customer_phone)).size;

            // Generate last 6 months intervals
            const now = new Date();
            const sixMonthsAgo = subMonths(now, 5);
            const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

            // Group by month
            const monthlyStats = months.map(monthDate => {
                const monthName = format(monthDate, 'MMM');
                const monthTotal = invoicesList.reduce((sum: number, inv: any) => {
                    const invDate = parseISO(inv.invoice_date || inv.created_at);
                    return isSameMonth(invDate, monthDate) ? sum + Number(inv.total_amount) : sum;
                }, 0);
                return { name: monthName, total: monthTotal };
            });

            setMonthlyData(monthlyStats);

            // This month growth calculation
            const currentMonthTotal = monthlyStats[monthlyStats.length - 1].total;
            const lastMonthTotal = monthlyStats[monthlyStats.length - 2]?.total || 0;
            const growth = lastMonthTotal > 0 ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100 : 0;

            setStats({
                totalSales,
                activeClients,
                thisMonthSales: currentMonthTotal,
                growth
            });
        } catch (error: any) {
            console.error('Error fetching financial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const maxMonthlyTotal = Math.max(...monthlyData.map(d => d.total), 1000);

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-sky-500 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Financial Insights</span>
                    </div>
                    <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Ledger Overview</h2>
                    <p className="text-gray-400 font-medium mt-1 text-sm uppercase tracking-wider italic">Revenue & Growth Analytics</p>
                </div>
                <div className="flex gap-4">
                    <div className="px-5 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">
                            {format(new Date(), 'yyyy')} Activity
                        </span>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <StatCard
                    label="Gross Revenue"
                    value={stats.totalSales}
                    icon={TrendingUp}
                    trend={stats.growth >= 0 ? `+${stats.growth.toFixed(1)}%` : `${stats.growth.toFixed(1)}%`}
                    color="blue"
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

            {/* Main Charts area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Card className="lg:col-span-8 border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                        <div>
                            <h3 className="text-xl font-black text-black tracking-tight uppercase">Monthly Growth</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Real-time Revenue Performance</p>
                        </div>
                        <div className="flex gap-2">
                            {monthlyData.slice(-4).map(d => (
                                <div key={d.name} className="px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-black uppercase text-gray-400">
                                    {d.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <CardContent className="h-[400px] flex items-end justify-between p-12 gap-4 bg-white relative">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                            </div>
                        ) : null}

                        {monthlyData.map((d, i) => (
                            <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                                <div
                                    className="w-full bg-sky-50 rounded-t-xl transition-all duration-700 group-hover:bg-sky-500 relative"
                                    style={{ height: `${(d.total / maxMonthlyTotal) * 100}%`, minHeight: '4px' }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                        <div className="bg-black text-white px-3 py-1.5 rounded-lg shadow-xl">
                                            <span className="text-[9px] font-black uppercase tracking-tighter whitespace-nowrap">
                                                {formatCurrency(d.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 text-[9px] font-black text-gray-300 uppercase text-center tracking-widest group-hover:text-sky-600 transition-colors">
                                    {d.name}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-4 border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100 overflow-hidden bg-white">
                    <div className="p-8 border-b border-gray-50">
                        <h3 className="text-xl font-black text-black tracking-tight uppercase">Recent Flow</h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Latest Live Transactions</p>
                    </div>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-50">
                            {invoices.slice(0, 8).map((inv, i) => (
                                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 group-hover:bg-sky-500 group-hover:text-white transition-all">
                                            {inv.customer_name[0]}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-gray-900 tracking-tight">{inv.customer_name}</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{inv.invoice_number}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-gray-900">{formatCurrency(inv.total_amount)}</p>
                                        <p className="text-[8px] font-bold text-gray-300 uppercase">{format(parseISO(inv.invoice_date || inv.created_at), 'dd MMM')}</p>
                                    </div>
                                </div>
                            ))}
                            {!isLoading && invoices.length === 0 && (
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
    return (
        <Card className="border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100 overflow-hidden bg-white hover:ring-sky-500 transition-all group">
            <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all scale-110">
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className={cn(
                        "flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                        trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : (trend === 'Active' ? "bg-gray-50 text-gray-400" : "bg-rose-50 text-rose-600")
                    )}>
                        {trend.startsWith('+') ? <ArrowUpRight className="w-2.5 h-2.5" /> : (trend === 'Active' ? null : <ArrowDownRight className="w-2.5 h-2.5" />)}
                        {trend}
                    </div>
                </div>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{label}</h3>
                <p className="text-3xl font-black tracking-tighter text-black">
                    {isCurrency ? formatCurrency(value) : value}
                </p>
            </CardContent>
        </Card>
    );
}
