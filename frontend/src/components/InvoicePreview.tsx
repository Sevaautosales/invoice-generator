'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { MapPin, Phone, Hash, ClipboardList } from 'lucide-react';

interface InvoicePreviewProps {
    data: {
        invoice_number: string;
        created_at: string;
        customer_name: string;
        customer_phone: string;
        customer_address?: string;
        vehicle_model: string;
        engine_number: string;
        chassis_number: string;
        vehicle_price: number;
        other_charges: number;
        total_amount: number;
        amount_paid: number;
        balance_due: number;
    };
}

export default function InvoicePreview({ data }: InvoicePreviewProps) {
    return (
        <Card className="w-full max-w-4xl mx-auto bg-white border-0 shadow-[0_0_50px_rgba(0,0,0,0.05)] print:shadow-none print:border-0 overflow-hidden">
            <CardContent className="p-0">
                {/* Header Section */}
                <div className="bg-black p-12 text-white">
                    <div className="flex justify-between items-start">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-1.5 w-12 bg-white rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Official Invoice</span>
                            </div>
                            <h1 className="text-5xl font-black tracking-tighter leading-none">SEVA <br />AUTO SALES</h1>
                            <div className="pt-4 space-y-1.5 text-xs font-bold text-white/60 uppercase tracking-widest">
                                <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> 123 Dealer Row, Auto City, ST 12345</p>
                                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> (555) 123-4567</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <h2 className="text-8xl font-black text-white/5 tracking-tighter absolute top-0 right-0 pointer-events-none">INVOICE</h2>
                            <div className="relative pt-10">
                                <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Invoice Number</p>
                                <p className="text-2xl font-black tracking-tight">{data.invoice_number}</p>
                                <div className="mt-6">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">Date Issued</p>
                                    <p className="text-sm font-bold tracking-widest">{data.created_at}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-16 space-y-16">
                    {/* Customer & Vehicle Info */}
                    <div className="grid grid-cols-2 gap-20">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                    Bill To
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-2xl font-black text-black tracking-tight">{data.customer_name}</p>
                                    <div className="space-y-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest">
                                        <p className="flex items-center gap-2">{data.customer_phone}</p>
                                        {data.customer_address && (
                                            <p className="leading-relaxed max-w-[250px]">{data.customer_address}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                                    Vehicle Information
                                </h3>
                                <div className="space-y-6">
                                    <p className="text-2xl font-black text-black tracking-tight uppercase">{data.vehicle_model}</p>
                                    <div className="grid grid-cols-1 gap-6 text-xs font-bold uppercase tracking-widest">
                                        <div>
                                            <p className="text-[9px] text-gray-400 mb-1.5 flex items-center gap-2">
                                                <Hash className="w-3 h-3" /> Engine Number
                                            </p>
                                            <p className="text-black bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{data.engine_number}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] text-gray-400 mb-1.5 flex items-center gap-2">
                                                <ClipboardList className="w-3 h-3" /> Chassis Number
                                            </p>
                                            <p className="text-black bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">{data.chassis_number}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Table */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                            Financial Breakdown
                        </h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b-4 border-black">
                                    <th className="py-6 text-[10px] font-black text-black uppercase tracking-[0.4em]">Description</th>
                                    <th className="py-6 text-right text-[10px] font-black text-black uppercase tracking-[0.4em]">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <tr>
                                    <td className="py-8">
                                        <p className="text-base font-black text-black uppercase tracking-tight">Vehicle Purchase Price</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Base unit cost</p>
                                    </td>
                                    <td className="py-8 text-right text-lg font-black text-black">
                                        {formatCurrency(data.vehicle_price)}
                                    </td>
                                </tr>
                                {data.other_charges > 0 && (
                                    <tr>
                                        <td className="py-6">
                                            <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Service & Other Charges</p>
                                        </td>
                                        <td className="py-6 text-right text-sm font-bold text-gray-900">
                                            {formatCurrency(data.other_charges)}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary Calculations */}
                    <div className="flex justify-end pt-12">
                        <div className="w-full max-w-sm space-y-6">
                            <div className="space-y-3 pb-6 border-b border-gray-100">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest">Amount Paid</span>
                                    <span className="font-black text-black">{formatCurrency(data.amount_paid)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400 font-bold uppercase tracking-widest">Balance Due</span>
                                    <span className={data.balance_due > 0 ? "font-black text-red-600" : "font-black text-black"}>
                                        {formatCurrency(data.balance_due)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end pt-4 border-t-2 border-black">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-1">Total Amount Due</p>
                                    <span className="text-5xl font-black text-black tracking-tighter leading-none">
                                        {formatCurrency(data.total_amount)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-20 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-black uppercase tracking-widest">Seva Auto Sales</p>
                                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Authorized Dealer Signature Space</p>
                            </div>
                            <div className="text-right space-y-2">
                                <div className="h-px w-48 bg-gray-200 ml-auto" />
                                <p className="text-[9px] text-gray-300 font-bold uppercase tracking-[0.3em]">
                                    Digital Record - Computer Generated
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
