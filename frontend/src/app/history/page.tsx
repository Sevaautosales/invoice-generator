'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter, History, Car, User, Calendar, Hash, Loader2, ChevronRight } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

const CATEGORIES = [
    { label: 'All Work', value: 'all' },
    { label: 'Side Wheels', value: 'side-wheels' },
    { label: 'Side Car', value: 'side-car' },
    { label: 'Auto Clutch', value: 'auto clutch' },
    { label: 'Brake & Accelarator', value: 'brake' },
];

export default function HistoryPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('all');
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const ITEMS_PER_PAGE = 20;

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        setInvoices([]);
        setPage(0);
        setHasMore(true);
        fetchHistory(0, true);
    }, [debouncedSearch, activeCategory]);

    const fetchHistory = async (pageNumber: number, isInitial = false) => {
        if (isInitial) setIsLoading(true);
        else setIsFetchingMore(true);

        try {
            let query = supabase
                .from('invoices')
                .select('*', { count: 'exact' })
                .order('invoice_date', { ascending: false })
                .range(pageNumber * ITEMS_PER_PAGE, (pageNumber + 1) * ITEMS_PER_PAGE - 1);

            if (debouncedSearch) {
                query = query.or(`customer_name.ilike.%${debouncedSearch}%,car_model.ilike.%${debouncedSearch}%,invoice_number.ilike.%${debouncedSearch}%`);
            }


            const { data, error, count } = await query;

            if (error) throw error;

            const newInvoices = data || [];

            setInvoices(prev => isInitial ? newInvoices : [...prev, ...newInvoices]);
            setHasMore(count ? (pageNumber + 1) * ITEMS_PER_PAGE < count : false);
        } catch (error: any) {
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    };

    const loadMore = () => {
        if (hasMore && !isFetchingMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchHistory(nextPage);
        }
    };

    const getInvoiceCategory = (items: any[]) => {
        if (!items || !Array.isArray(items)) return 'Other';
        const itemNames = items.map(i => i.description.toLowerCase()).join(' ');

        if (itemNames.includes('side-wheels') || itemNames.includes('side wheels')) return 'Side Wheels';
        if (itemNames.includes('side-car') || itemNames.includes('side car')) return 'Side Car';
        if (itemNames.includes('auto clutch')) return 'Auto Clutch';
        if (itemNames.includes('brake') || itemNames.includes('accelarator')) return 'Brake & Accelarator';
        return 'Modifications';
    };

    // Client-side category filtering on the accumulated batches
    const filteredInvoices = invoices.filter(inv => {
        if (activeCategory === 'all') return true;
        const itemNames = (inv.items || []).map((i: any) => i.description.toLowerCase()).join(' ');
        return itemNames.includes(activeCategory);
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-sky-500 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Archive</span>
                    </div>
                    <h2 className="text-4xl font-black text-black tracking-tighter">Order History</h2>
                    <p className="text-gray-400 font-medium mt-1 text-sm uppercase tracking-wider">Historical Modification Database</p>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory(cat.value)}
                            className={cn(
                                "px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                                activeCategory === cat.value
                                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20 scale-105"
                                    : "bg-white text-gray-400 border border-gray-100 hover:border-sky-200 hover:text-sky-500"
                            )}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex-1">
                        <Input
                            placeholder="Find by vehicle, customer or bill number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={<Search className="w-4 h-4 text-sky-400" />}
                            className="bg-white border-gray-100 shadow-sm h-12"
                        />
                    </div>
                </div>
            </div>

            {/* History Grid */}
            {isLoading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Retrieving Archives...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredInvoices.map((inv) => (
                        <Link href={`/invoice/${inv.id}`} key={inv.id}>
                            <Card className="group hover:border-sky-500 transition-all duration-500 hover:shadow-2xl hover:shadow-sky-500/10 cursor-pointer overflow-hidden border-gray-100 ring-1 ring-gray-50">
                                <CardContent className="p-0">
                                    {/* Category Indicator */}
                                    <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex justify-between items-center group-hover:bg-sky-50/30 transition-colors">
                                        <span className="text-[9px] font-black text-sky-600 uppercase tracking-widest">
                                            {getInvoiceCategory(inv.items)}
                                        </span>
                                        <span className="text-[9px] font-bold text-gray-300">
                                            {new Date(inv.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <div>
                                            <h3 className="text-lg font-black text-black tracking-tight group-hover:text-sky-600 transition-colors uppercase">
                                                {inv.car_model}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Hash className="w-3 h-3 text-gray-300" />
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Reg: {inv.reg_no || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 py-4 border-y border-gray-50">
                                            <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center">
                                                <User className="w-4 h-4 text-sky-500" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-900">{inv.customer_name}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{inv.customer_phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center pt-2">
                                            <div className="space-y-0.5">
                                                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest font-sans">Bill Total</p>
                                                <p className="text-xl font-black text-black tracking-tighter">{formatCurrency(inv.total_amount)}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-sky-500 group-hover:border-sky-500 group-hover:translate-x-1 transition-all">
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}

            {hasMore && (
                <div className="flex justify-center pt-8">
                    <Button
                        onClick={loadMore}
                        disabled={isFetchingMore}
                        variant="outline"
                        className="px-12 py-6 rounded-2xl border-2 border-gray-100 font-black text-[10px] uppercase tracking-[0.2em] hover:bg-sky-500 hover:text-white hover:border-sky-500 transition-all group scale-100 hover:scale-105 active:scale-95"
                    >
                        {isFetchingMore ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Indexing...
                            </>
                        ) : (
                            <>
                                Load More Records
                                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </div>
            )}

            {!isLoading && filteredInvoices.length === 0 && (
                <div className="py-32 text-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                    <History className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <h3 className="text-lg font-black text-gray-900">No History Found</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
                        Try adjusting your filters or search terms
                    </p>
                </div>
            )}
        </div>
    );
}
