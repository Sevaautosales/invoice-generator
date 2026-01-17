'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight, Loader2, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import {
    startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths, isSameMonth, parseISO,
    startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addMonths, subWeeks, addWeeks,
    eachWeekOfInterval, isSameWeek, startOfYear, endOfYear, eachYearOfInterval, subYears, addYears
} from 'date-fns';

type ViewMode = 'week' | 'month';

interface Invoice {
    id: string;
    total_amount: number;
    invoice_date: string;
    created_at: string;
    customer_name: string;
    customer_phone: string;
    invoice_number: string;
}

export default function FinancialPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [referenceDate, setReferenceDate] = useState(new Date());
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [pickerYear, setPickerYear] = useState(new Date().getFullYear());

    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [stats, setStats] = useState({
        totalSales: 0,
        activeClients: 0,
        growth: 0
    });

    useEffect(() => {
        fetchFinancialData();
    }, [viewMode, referenceDate]);

    const fetchFinancialData = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*');

            if (error) throw error;
            const invoicesList: Invoice[] = data || [];
            setInvoices(invoicesList);

            let chartData: any[] = [];
            let growth = 0;

            if (viewMode === 'week') {
                const start = startOfWeek(referenceDate, { weekStartsOn: 1 });
                const end = endOfWeek(referenceDate, { weekStartsOn: 1 });
                const days = eachDayOfInterval({ start, end });

                chartData = days.map(day => ({
                    name: format(day, 'EEE'),
                    total: invoicesList.reduce((sum: number, inv: Invoice) => {
                        const invDate = parseISO(inv.invoice_date || inv.created_at);
                        return isSameDay(invDate, day) ? sum + Number(inv.total_amount) : sum;
                    }, 0)
                }));

                // Growth vs previous week
                const prevWeekStart = subWeeks(start, 1);
                const prevWeekEnd = subWeeks(end, 1);
                const currentTotal = chartData.reduce((s: number, d: any) => s + d.total, 0);
                const prevTotal = invoicesList.reduce((sum: number, inv: Invoice) => {
                    const invDate = parseISO(inv.invoice_date || inv.created_at);
                    return (invDate >= prevWeekStart && invDate <= prevWeekEnd) ? sum + Number(inv.total_amount) : sum;
                }, 0);
                growth = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0;

            } else {
                const start = startOfMonth(referenceDate);
                const end = endOfMonth(referenceDate);
                // Group by week for the month
                const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });

                chartData = weeks.map((week, idx) => ({
                    name: `Week ${idx + 1}`,
                    total: invoicesList.reduce((sum: number, inv: Invoice) => {
                        const invDate = parseISO(inv.invoice_date || inv.created_at);
                        return isSameWeek(invDate, week, { weekStartsOn: 1 }) &&
                            invDate >= start && invDate <= end ? sum + Number(inv.total_amount) : sum;
                    }, 0)
                }));

                // Growth vs previous month
                const prevMonth = subMonths(start, 1);
                const currentTotal = chartData.reduce((s: number, d: any) => s + d.total, 0);
                const prevTotal = invoicesList.reduce((sum: number, inv: Invoice) => {
                    const invDate = parseISO(inv.invoice_date || inv.created_at);
                    return isSameMonth(invDate, prevMonth) ? sum + Number(inv.total_amount) : sum;
                }, 0);
                growth = prevTotal > 0 ? ((currentTotal - prevTotal) / prevTotal) * 100 : 0;
            }

            setMonthlyData(chartData);
            setStats({
                totalSales: invoicesList.reduce((sum: number, inv: Invoice) => sum + Number(inv.total_amount), 0),
                activeClients: new Set(invoicesList.map((inv: Invoice) => inv.customer_phone)).size,
                growth
            });
        } catch (error: any) {
            console.error('Error fetching financial data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const maxVal = Math.max(...monthlyData.map(d => d.total), 1000);

    const handleMonthSelect = (monthIdx: number) => {
        const newDate = new Date(pickerYear, monthIdx, 1);
        setReferenceDate(newDate);
        setViewMode('month');
        setShowMonthPicker(false);
    };

    const resetToToday = () => {
        setReferenceDate(new Date());
        setViewMode('month');
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header with Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-sky-500 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Financial Insights</span>
                    </div>
                    <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Ledger Overview</h2>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-gray-50/50 p-1 rounded-2xl flex items-center gap-1 border border-gray-100 relative">
                        <button
                            onClick={() => setViewMode('week')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                viewMode === 'week' ? "bg-white text-sky-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => { setViewMode('month'); setReferenceDate(new Date()); }}
                            className={cn(
                                "px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                                viewMode === 'month' && isSameMonth(referenceDate, new Date()) ? "bg-white text-sky-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            This Month
                        </button>
                        <div className="relative">
                            <button
                                onClick={() => setShowMonthPicker(!showMonthPicker)}
                                className={cn(
                                    "px-6 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                                    viewMode === 'month' && !isSameMonth(referenceDate, new Date()) ? "bg-white text-sky-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {format(referenceDate, 'MMMM yyyy')}
                            </button>

                            {showMonthPicker && (
                                <div className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="flex items-center justify-between mb-4 px-2">
                                        <button onClick={() => setPickerYear(y => y - 1)} className="p-1 hover:bg-gray-50 rounded-lg text-gray-400"><ChevronLeft className="w-4 h-4" /></button>
                                        <span className="text-sm font-black text-black">{pickerYear}</span>
                                        <button onClick={() => setPickerYear(y => y + 1)} className="p-1 hover:bg-gray-50 rounded-lg text-gray-400"><ChevronRight className="w-4 h-4" /></button>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                                            <button
                                                key={m}
                                                onClick={() => handleMonthSelect(i)}
                                                className={cn(
                                                    "py-2 text-[10px] font-black uppercase rounded-lg transition-all",
                                                    isSameMonth(referenceDate, new Date(pickerYear, i, 1))
                                                        ? "bg-sky-500 text-white"
                                                        : "hover:bg-sky-50 text-gray-400 hover:text-sky-600"
                                                )}
                                            >
                                                {m}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={resetToToday}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-sky-500 hover:scale-110 transition-all shadow-sm"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <StatCard
                    label={viewMode === 'week' ? "Weekly Performance" : `${format(referenceDate, 'MMMM')} Revenue`}
                    value={monthlyData.reduce((s, d) => s + d.total, 0)}
                    icon={TrendingUp}
                    trend={stats.growth >= 0 ? `+${stats.growth.toFixed(1)}%` : `${stats.growth.toFixed(1)}%`}
                    color="blue"
                />
                <StatCard
                    label="Business Reach"
                    value={stats.activeClients}
                    icon={Users}
                    isCurrency={false}
                    trend="Lifetime"
                    color="gray"
                />
            </div>

            {/* Main Charts area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <Card className="lg:col-span-8 border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100 overflow-hidden bg-white">
                    <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                        <div>
                            <h3 className="text-xl font-black text-black tracking-tight uppercase">
                                {viewMode === 'week' ? 'Daily Velocity' : 'Weekly Breakdown'}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                Revenue flow for {viewMode === 'week' ? `Week of ${format(referenceDate, 'MMM d')}` : format(referenceDate, 'MMMM yyyy')}
                            </p>
                        </div>
                    </div>
                    <CardContent className="h-[400px] flex items-end justify-between p-12 gap-4 relative">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                                <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
                            </div>
                        ) : null}

                        {monthlyData.map((d, i) => (
                            <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                                <div
                                    className="w-full bg-sky-50 rounded-t-xl transition-all duration-700 group-hover:bg-sky-500 relative"
                                    style={{ height: `${(d.total / maxVal) * 100}%`, minHeight: '4px' }}
                                >
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                        <div className="bg-black text-white px-3 py-2 rounded-xl shadow-2xl scale-110">
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter mb-0.5">{d.name}</p>
                                            <p className="text-[10px] font-black uppercase tracking-tighter whitespace-nowrap">
                                                {formatCurrency(d.total)}
                                            </p>
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
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Transaction Journal</p>
                    </div>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-50">
                            {invoices.slice(0, 8).map((inv, i) => (
                                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-all group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-full bg-sky-50 flex items-center justify-center text-[10px] font-black text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-all">
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
                                    <p className="text-[10px] font-black uppercase tracking-widest">No Records Found</p>
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
                        "flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm",
                        trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : (trend === 'Lifetime' ? "bg-gray-50 text-gray-400" : "bg-rose-50 text-rose-600")
                    )}>
                        {trend.startsWith('+') ? <ArrowUpRight className="w-2.5 h-2.5" /> : (trend === 'Lifetime' ? null : <ArrowDownRight className="w-2.5 h-2.5" />)}
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
