'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search, Filter, Download, Eye, FileText, Plus, Hash, Loader2, Trash2 } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ConfirmDialog from '@/components/ConfirmDialog';
import AlertDialog from '@/components/AlertDialog';

export default function InvoicesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => { }
    });
    const [alertDialog, setAlertDialog] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'success'
    });

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('invoices')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setInvoices(data || []);
        } catch (error: any) {
            console.error('Error fetching invoices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string, invoiceNumber: string) => {
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Invoice',
            message: `Are you sure you want to delete invoice ${invoiceNumber}? This action cannot be undone.`,
            onConfirm: async () => {
                try {
                    const { error } = await supabase
                        .from('invoices')
                        .delete()
                        .eq('id', id);

                    if (error) throw error;

                    setAlertDialog({
                        isOpen: true,
                        title: 'Success!',
                        message: 'Invoice deleted successfully.',
                        type: 'success'
                    });
                    fetchInvoices();
                } catch (error: any) {
                    console.error('Error deleting invoice:', error);
                    setAlertDialog({
                        isOpen: true,
                        title: 'Error',
                        message: 'Failed to delete invoice: ' + error.message,
                        type: 'error'
                    });
                }
            }
        });
    };

    const filteredInvoices = invoices.filter(inv =>
        inv.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.vehicle_model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.engine_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inv.chassis_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 bg-black rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Database</span>
                    </div>
                    <h2 className="text-4xl font-black text-black tracking-tighter">Records</h2>
                    <p className="text-gray-400 font-medium mt-1 text-sm uppercase tracking-wider">Historical Invoice Management</p>
                </div>
                <Link href="/">
                    <Button variant="primary" className="px-8 bg-black border-black">
                        <Plus className="w-4 h-4 mr-2" />
                        New Entry
                    </Button>
                </Link>
            </div>

            <div className="flex gap-4 items-center">
                <div className="flex-1">
                    <Input
                        placeholder="Search by customer, invoice #, vehicle, or engine..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                        className="bg-white border-gray-100 shadow-sm"
                    />
                </div>
                <Button variant="outline" onClick={fetchInvoices} className="border-gray-200 text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                    <Filter className="w-3.5 h-3.5 mr-2" />
                    Reset List
                </Button>
            </div>

            <Card className="border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100 overflow-hidden">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/30">
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID / Date</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Technical Specs</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Pricing</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 bg-white">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-8 h-8 text-black animate-spin" />
                                                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Syncing Records...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredInvoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 transition-all group">
                                        <td className="px-8 py-8">
                                            <div className="space-y-1">
                                                <span className="text-sm font-black text-black tracking-tight block">{invoice.invoice_number}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">
                                                    {new Date(invoice.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="space-y-1">
                                                <span className="text-sm font-black text-gray-700 tracking-tight block">{invoice.customer_name}</span>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{invoice.customer_phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="space-y-2">
                                                <span className="text-sm font-black text-gray-700 tracking-tight block uppercase">{invoice.vehicle_model}</span>
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-0.5 rounded-md">
                                                        <Hash className="w-2.5 h-2.5 text-gray-400" />
                                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">Eng: {invoice.engine_number}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="space-y-1">
                                                <span className="text-base font-black text-black tracking-tighter block">{formatCurrency(invoice.total_amount)}</span>
                                                <span className={cn(
                                                    "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full inline-block",
                                                    invoice.status === 'paid' ? "bg-black text-white" : "bg-gray-100 text-gray-400"
                                                )}>
                                                    {invoice.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <div className="flex justify-end gap-3">
                                                <Link href={`/invoice/${invoice.id}`}>
                                                    <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-full border-gray-100 hover:border-black active:scale-90">
                                                        <Eye className="w-4 h-4 text-gray-900" />
                                                    </Button>
                                                </Link>
                                                <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-full border-gray-100 hover:border-black active:scale-90">
                                                    <Download className="w-4 h-4 text-gray-400 group-hover:text-black" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDelete(invoice.id, invoice.invoice_number)}
                                                    className="h-10 w-10 p-0 rounded-full border-gray-100 hover:border-red-500 hover:bg-red-50 active:scale-90 transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {!isLoading && filteredInvoices.length === 0 && (
                        <div className="p-24 text-center">
                            <div className="inline-flex p-6 bg-gray-50 rounded-3xl mb-6">
                                <FileText className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-black tracking-tight">No Records Found</h3>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mt-2 max-w-xs mx-auto leading-relaxed">
                                {invoices.length === 0 ? "Your database is currently empty." : "We couldn't locate any invoices matching your specific search."}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Custom Dialogs */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type="danger"
                confirmText="Delete"
                cancelText="Cancel"
            />
            <AlertDialog
                isOpen={alertDialog.isOpen}
                onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
                title={alertDialog.title}
                message={alertDialog.message}
                type={alertDialog.type}
            />
        </div>
    );
}
