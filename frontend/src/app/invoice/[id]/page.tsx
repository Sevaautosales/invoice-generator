'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import InvoicePreview from '@/components/InvoicePreview';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Printer, Loader2, History } from 'lucide-react';
import Link from 'next/link';
import PDFDownloadButton from '@/components/PDFDownloadButton';
import { supabase } from '@/lib/supabase';

export default function InvoiceDetailsPage() {
    const params = useParams();
    const id = params.id as string;
    const [invoice, setInvoice] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchInvoice();
        }
    }, [id]);

    const fetchInvoice = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            setInvoice(data);
        } catch (error: any) {
            console.error('Error fetching invoice:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-100 border-t-black rounded-full animate-spin" />
                    <History className="w-6 h-6 text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-black uppercase tracking-[0.3em]">Retrieving Document</p>
                    <p className="text-gray-400 text-xs font-bold mt-1 uppercase tracking-widest italic font-serif">Seva Auto Sales Database</p>
                </div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="bg-white rounded-[2rem] p-20 text-center shadow-2xl shadow-gray-100 ring-1 ring-gray-100 max-w-lg mx-auto mt-20">
                <div className="h-1 w-12 bg-black mx-auto mb-6 rounded-full" />
                <h2 className="text-3xl font-black text-black tracking-tight">Access Denied</h2>
                <p className="text-gray-400 mt-4 mb-10 font-medium leading-relaxed">The requested invoice could not be located in our secure database. It may have been relocated or removed.</p>
                <Link href="/invoices">
                    <Button variant="primary" className="px-10 bg-black border-black h-12 rounded-2xl">Return to Records</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                <div className="flex items-center gap-6">
                    <Link href="/invoices">
                        <Button variant="outline" size="sm" className="h-12 w-12 p-0 rounded-2xl border-gray-200 hover:border-black active:scale-90 transition-all">
                            <ArrowLeft className="w-5 h-5 text-black" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-1 w-4 bg-black rounded-full" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Document View</span>
                        </div>
                        <h2 className="text-3xl font-black text-black tracking-tighter">{invoice.invoice_number}</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                            Customer Receipt: <span className="text-gray-900">{invoice.customer_name}</span>
                        </p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={handlePrint} className="h-12 px-8 rounded-2xl border-gray-200 shadow-sm hover:bg-gray-50 uppercase tracking-widest font-black text-[10px]">
                        <Printer className="w-4 h-4 mr-3 text-black" />
                        Print Order
                    </Button>
                    <PDFDownloadButton
                        data={{
                            ...invoice,
                            created_at: new Date(invoice.created_at).toLocaleDateString()
                        }}
                        fileName={`${invoice.invoice_number}.pdf`}
                    />
                </div>
            </div>

            <div className="print:m-0 print:p-0">
                <InvoicePreview data={{
                    ...invoice,
                    created_at: new Date(invoice.created_at).toLocaleDateString()
                }} />
            </div>
        </div>
    );
}
