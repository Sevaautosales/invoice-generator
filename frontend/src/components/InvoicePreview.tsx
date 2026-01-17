'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { formatCurrency, cn } from '@/lib/utils';
import { numberToWords } from '@/lib/numberToWords';
import Image from 'next/image';

interface InvoicePreviewProps {
    data: {
        invoice_number: string;
        invoice_date: string;
        customer_name: string;
        customer_phone: string;
        customer_address?: string; // region
        billing_address?: string; // full
        car_model?: string;
        reg_no?: string;
        engine_number?: string;
        chassis_number?: string;
        notes?: string;
        items: Array<{
            description: string;
            mrp: number;
            selling_price: number;
            amount: number;
        }>;
        total_amount: number;
    };
}

// Color Constants to avoid Tailwind v4 oklch/lab parsing issues in html2canvas
const colors = {
    gray900: '#111827',
    gray600: '#4b5563',
    gray500: '#6b7280',
    gray400: '#9ca3af',
    gray300: '#d1d5db',
    gray200: '#e5e7eb',
    gray100: '#f3f4f6',
    gray50: '#f9fafb',
    black: '#000000',
    white: '#FFFFFF',
    theme: '#0EA5E9'
};

export default function InvoicePreview({ data }: InvoicePreviewProps) {
    const formattedDate = data.invoice_date ? new Date(data.invoice_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : '';

    const amountInWords = `INR ${numberToWords(data.total_amount)} Rupees Only.`;

    return (
        <Card id="invoice-capture-area" className="w-full max-w-[850px] mx-auto bg-white border-0 print:shadow-none print:border-0 print:p-0 print:m-0 print:max-w-none overflow-hidden font-sans text-gray-900 mb-20 p-4 sm:p-8 relative print:bg-white" style={{ color: colors.gray900 }}>
            {/* CardContent with A4 aspect ratio matching: 850px width -> ~1200px height */}
            <CardContent className="p-0 border flex flex-col print:border-0 print:min-h-0" style={{ borderColor: colors.gray100, minHeight: '1202px' }}>

                {/* Top Header Label */}
                <div className="flex justify-between items-start mb-4 px-8 pt-6">
                    <h2 style={{ color: colors.theme }} className="font-black text-xl tracking-widest uppercase">INVOICE</h2>
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gray400 }}>ORIGINAL FOR RECIPIENT</span>
                </div>

                {/* Seva Auto Sales Branding */}
                <div className="flex justify-between items-start px-8 mb-8">
                    <div className="space-y-4 flex-1">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 flex items-center justify-center">
                                <img src="/logo.png" alt="SAS Logo" className="w-20 h-20 object-contain" />
                            </div>
                            <div>
                                <h1 className="text-4xl font-black tracking-tighter uppercase leading-none" style={{ color: '#1a1a1a' }}>Seva Auto Sales</h1>
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] mt-2" style={{ color: colors.gray400 }}>Professional Vehicle Modifications</p>
                            </div>
                        </div>

                        <div className="text-[10px] font-bold leading-relaxed uppercase space-y-1" style={{ color: colors.gray500 }}>
                            <p className="max-w-md" style={{ color: 'rgba(0,0,0,0.8)' }}>Side Car For Two Wheeler Scooter & Bike, Four Wheel Attachment For Handicap, Auto Clutch & Hand Operate Kit of Four Wheels Cars</p>
                            <div className="grid grid-cols-1 gap-1 text-[9px] pt-2 border-t" style={{ borderColor: '#f3f4f6' }}>
                                <p><span style={{ color: 'rgba(0,0,0,0.45)' }}>Work:</span> Street No. 14, Ghanshyam Nagar Soc., Opp. New Shaktivijay, L.H. Road, SURAT.</p>
                                <div className="flex gap-4">
                                    <p><span style={{ color: 'rgba(0,0,0,0.45)' }}>Email:</span> <span className="lowercase font-black" style={{ color: colors.black }}>sevaautosales@gmail.com</span></p>
                                    <p><span style={{ color: 'rgba(0,0,0,0.45)' }}>Web:</span> <span className="lowercase font-black" style={{ color: colors.black }}>sevaautosales.vercel.app</span></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm font-black mb-1" style={{ color: '#1a1a1a' }}>Mo. 99043 66000</div>
                        <div className="text-sm font-black" style={{ color: '#1a1a1a' }}>94271 00629</div>
                        <div className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] rotate-90 origin-right translate-x-4" style={{ color: colors.gray300 }}>Est. 2005</div>
                    </div>
                </div>

                {/* Info Grid (Customer & Invoice) */}
                <div className="grid grid-cols-2 gap-0 border-t border-b mx-8 py-6 mb-8" style={{ borderColor: colors.gray100, backgroundColor: 'rgba(249, 250, 251, 0.3)' }}>
                    <div className="space-y-4 pr-8">
                        <div className="flex gap-2 items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest w-24" style={{ color: colors.gray400 }}>Bill No.:</span>
                            <span className="text-[14px] font-black" style={{ color: colors.black }}>{data.invoice_number}</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gray400 }}>Customer Details:</p>
                            <p className="text-[14px] font-black uppercase" style={{ color: colors.black }}>{data.customer_name}</p>
                            {data.customer_phone && <p className="text-[11px] font-black" style={{ color: colors.gray600 }}>Ph: {data.customer_phone}</p>}
                        </div>
                    </div>
                    <div className="space-y-4 pl-8 border-l" style={{ borderColor: colors.gray100 }}>
                        <div className="flex gap-2 items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest w-24" style={{ color: colors.gray400 }}>Date:</span>
                            <span className="text-[14px] font-black" style={{ color: colors.black }}>{formattedDate}</span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gray400 }}>Billing Address:</p>
                            <div className="text-[11px] font-black uppercase" style={{ color: colors.gray600 }}>
                                <p className="leading-tight">{data.billing_address}</p>
                                <p className="mt-1">{data.customer_address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Car Details */}
                <div className="mx-8 mb-8 space-y-4">
                    <p className="text-[11px] font-black tracking-widest uppercase px-0 border-b pb-2 flex items-center gap-2" style={{ color: colors.gray900, borderColor: colors.gray100 }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.theme }} />
                        TECHNICAL SPECS:-
                    </p>
                    <div className="grid grid-cols-2 gap-8 text-[11px] font-black uppercase leading-relaxed" style={{ color: colors.gray600 }}>
                        <div className="space-y-1">
                            <p>Vehicle Model : <span className="font-black" style={{ color: colors.black }}>{data.car_model}</span></p>
                            <p>Reg no. : <span className="font-black" style={{ color: colors.black }}>{data.reg_no}</span></p>
                        </div>
                        <div className="space-y-1">
                            {data.engine_number && <p>Engine No. : <span className="font-black" style={{ color: colors.black }}>{data.engine_number}</span></p>}
                            {data.chassis_number && <p>Chassis No. : <span className="font-black" style={{ color: colors.black }}>{data.chassis_number}</span></p>}
                        </div>
                    </div>
                </div>

                {/* Table Header */}
                <div className="mx-8 mb-0 grid grid-cols-12 border-b-2 pb-2 text-[11px] font-black uppercase tracking-widest" style={{ borderColor: colors.black, color: '#1a1a1a' }}>
                    <div className="col-span-1">No.</div>
                    <div className="col-span-5">Descriptions</div>
                    <div className="col-span-3 text-right">Rate</div>
                    <div className="col-span-3 text-right">Amount</div>
                </div>

                {/* Table Rows */}
                <div className="mx-8 mb-6 divide-y" style={{ borderColor: '#f1f5f9' }}>
                    {data.items.map((item, idx) => (
                        <div key={idx} className="grid grid-cols-12 py-5 items-start">
                            <div className="col-span-1 text-[13px] font-black" style={{ color: colors.gray300 }}>{(idx + 1).toString().padStart(2, '0')}</div>
                            <div className="col-span-5 pr-4">
                                <p className="text-[14px] font-black uppercase tracking-tight leading-tight" style={{ color: colors.black }}>{item.description}</p>
                                <p className="text-[10px] font-bold uppercase leading-tight mt-1.5 opacity-80" style={{ color: colors.gray400 }}>
                                    Quality modification with precision engineering
                                </p>
                            </div>
                            <div className="col-span-3 text-right text-[15px] font-black" style={{ color: colors.gray900 }}>{formatCurrency(item.selling_price).replace('₹', '')}</div>
                            <div className="col-span-3 text-right text-[15px] font-black" style={{ color: colors.black }}>{formatCurrency(item.amount).replace('₹', '')}</div>
                        </div>
                    ))}
                </div>

                {/* Totals Section */}
                <div className="mx-8 mb-12 flex flex-col items-end border-t pt-6" style={{ borderColor: colors.gray100 }}>
                    <div className="flex justify-between w-64 items-center mb-4 p-4 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
                        <span className="text-sm font-black uppercase tracking-widest" style={{ color: colors.gray400 }}>Total</span>
                        <span className="text-3xl font-black tracking-tighter" style={{ color: colors.black }}>{formatCurrency(data.total_amount)}</span>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: colors.gray400 }}>Amount in Words:</p>
                        <p className="text-[11px] font-black uppercase italic max-w-md ml-auto" style={{ color: colors.gray900 }}>
                            {amountInWords}
                        </p>
                    </div>
                </div>

                {/* Footer Meta Row (Terms + Signature) */}
                <div className="mx-8 grid grid-cols-2 gap-8 items-end mb-12">
                    <div className="space-y-4">
                        {data.notes && (
                            <div className="p-3 rounded-xl border" style={{ backgroundColor: 'rgba(14, 165, 233, 0.04)', borderColor: 'rgba(14, 165, 233, 0.08)' }}>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: colors.theme }}>Notes:</p>
                                <p className="text-[11px] font-bold uppercase italic leading-relaxed" style={{ color: '#374151' }}>{data.notes}</p>
                            </div>
                        )}

                        {/* Terms and Conditions inside footer meta *) */}
                        <div className="p-4 rounded-xl border" style={{ backgroundColor: 'rgba(249, 250, 251, 0.6)', borderColor: colors.gray100 }}>
                            <p className="text-[10px] font-black uppercase mb-2 tracking-widest" style={{ color: colors.gray900 }}>Terms & Conditions:</p>
                            <div className="space-y-1">
                                {[
                                    'Goods once sold will not taken back.',
                                    'Damage while using not covered under warranty.',
                                    'Product carries 1 YEAR Warranty.',
                                    'Repaired/Alteration is at owner risk.'
                                ].map((term, i) => (
                                    <div key={i} className="flex gap-2">
                                        <span className="font-black text-[8px]" style={{ color: colors.gray300 }}>{i + 1}.</span>
                                        <span className="text-[8px] font-black uppercase" style={{ color: colors.gray500 }}>{term}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="text-right flex flex-col items-end pt-4">
                        <div className="relative text-right mb-0">
                            <p className="text-[12px] font-black uppercase mb-12" style={{ color: '#111827' }}>For Seva Auto Sales</p>
                            <div className="w-48 h-px ml-auto" style={{ backgroundColor: colors.gray300 }} />
                            <p className="text-[10px] font-black mt-2 uppercase tracking-widest" style={{ color: colors.gray400 }}>Authorized Signatory</p>
                        </div>
                    </div>
                </div>

                {/* Page Footer Text */}
                <div className="mt-auto mx-8 mb-8 flex justify-between items-center text-[10px] font-black uppercase tracking-widest" style={{ color: colors.gray300 }}>
                    <p>Page 1 of 1</p>
                    <p>Computer Generated Document • No Signature Required</p>
                    <p style={{ color: 'rgba(0,0,0,0.2)' }}>Seva Auto Sales</p>
                </div>

            </CardContent>
        </Card>
    );
}
