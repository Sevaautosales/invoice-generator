'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Car, Hash, IndianRupee, Save, RotateCcw, ClipboardList, Info } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import AlertDialog from '@/components/AlertDialog';
import PDFDownloadButton from '@/components/PDFDownloadButton';

export default function InvoiceForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        invoice_number: '',
        invoice_date: new Date().toISOString().split('T')[0],
        customer_name: '',
        customer_phone: '',
        customer_address: '', // Billing region
        billing_address: '', // Full address
        car_model: '',
        reg_no: '',
        engine_number: '',
        chassis_number: '',
        notes: '',
        items: [
            { description: 'side-wheels', mrp: 0, selling_price: 0, amount: 0 }
        ]
    });

    const PRESET_ITEMS = [
        { description: 'side-wheels', mrp: 15000, selling_price: 12000 },
        { description: 'side-car', mrp: 45000, selling_price: 40000 },
        { description: 'brake and accelarator', mrp: 8000, selling_price: 7500 },
        { description: 'Auto-clutch', mrp: 57500, selling_price: 57500 },
    ];

    const [total, setTotal] = useState(0);

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

    const [lastSavedInvoice, setLastSavedInvoice] = useState<any>(null);

    const themeColor = '#0EA5E9'; // Sky blue from logo

    useEffect(() => {
        const totalAmount = formData.items.reduce((sum, item) => sum + Number(item.amount), 0);
        setTotal(totalAmount);
    }, [formData.items]);

    useEffect(() => {
        generateInvoiceNumber();
    }, []);

    const generateInvoiceNumber = async () => {
        const today = new Date();
        const year = String(today.getFullYear()).slice(-2);
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const dateString = `${year}${month}`;

        try {
            // Fetch all invoices from this month
            // We only look for sequences that match the new format YYMMSS (Length 6)
            // Existing legacy invoices are YYMMDDS (Length 7) -> We must ignore them
            const { data, error } = await supabase
                .from('invoices')
                .select('invoice_number')
                .like('invoice_number', `${dateString}%`);

            let nextNumber = 1;

            if (data && data.length > 0) {
                const sequences = data
                    .filter((inv: { invoice_number: string }) => inv.invoice_number.length === 6) // STRICT FILTER for new format
                    .map((inv: { invoice_number: string }) => {
                        const seq = inv.invoice_number.substring(dateString.length);
                        return parseInt(seq) || 0;
                    });

                if (sequences.length > 0) {
                    nextNumber = Math.max(...sequences) + 1;
                }
            }

            const paddedSequence = String(nextNumber).padStart(2, '0');

            setFormData(prev => ({
                ...prev,
                invoice_number: `${dateString}${paddedSequence}`
            }));
        } catch (error) {
            console.error('Error generating invoice number:', error);
            // Fallback
            setFormData(prev => ({
                ...prev,
                invoice_number: `${dateString}01`
            }));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleItemChange = (index: number, field: string, value: string | number) => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };

        // If selecting from preset
        // Autofill removed as per user request

        if (field === 'selling_price') {
            newItems[index].amount = Number(value);
        }

        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', mrp: 0, selling_price: 0, amount: 0 }]
        }));
    };

    const removeItem = (index: number) => {
        if (formData.items.length > 1) {
            setFormData(prev => ({
                ...prev,
                items: prev.items.filter((_, i) => i !== index)
            }));
        }
    };

    const handleClear = () => {
        setFormData({
            invoice_number: '',
            invoice_date: new Date().toISOString().split('T')[0],
            customer_name: '',
            customer_phone: '',
            customer_address: '',
            billing_address: '',
            car_model: '',
            reg_no: '',
            engine_number: '',
            chassis_number: '',
            notes: '',
            items: [{ description: '', mrp: 0, selling_price: 0, amount: 0 }]
        });
        generateInvoiceNumber();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (total <= 0) {
            setAlertDialog({
                isOpen: true,
                title: 'Invalid Amount',
                message: 'Please add items to the invoice before saving. Total cannot be zero.',
                type: 'error'
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const { data, error } = await supabase
                .from('invoices')
                .insert([
                    {
                        invoice_number: formData.invoice_number,
                        invoice_date: formData.invoice_date,
                        customer_name: formData.customer_name,
                        customer_phone: formData.customer_phone,
                        customer_address: formData.customer_address,
                        billing_address: formData.billing_address,
                        car_model: formData.car_model,
                        reg_no: formData.reg_no,
                        engine_number: formData.engine_number,
                        chassis_number: formData.chassis_number,
                        items: formData.items,
                        notes: formData.notes,
                        total_amount: total
                    }
                ])
                .select();

            if (error) throw error;

            const savedInvoice = data[0];

            setAlertDialog({
                isOpen: true,
                title: 'Success!',
                message: 'Invoice saved successfully to the database.',
                type: 'success'
            });

            // We need to keep the saved data for the download link even after clearing form
            setLastSavedInvoice({
                ...savedInvoice,
                created_at: new Date(savedInvoice.created_at).toLocaleDateString()
            });

            handleClear();
        } catch (error: any) {
            setAlertDialog({
                isOpen: true,
                title: 'Error',
                message: 'Failed to save invoice: ' + error.message,
                type: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-1 w-8 rounded-full" style={{ backgroundColor: themeColor }} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Generation System</span>
                    </div>
                    <h2 className="text-4xl font-black text-black tracking-tighter uppercase">New Invoice</h2>
                    <p className="text-gray-400 font-medium mt-1 text-sm uppercase tracking-wider">Seva Auto Sales Professional Billing</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* Customer Details */}
                    <Card className="border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100">
                        <CardHeader className="border-b border-gray-50 pb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-gray-50">
                                        <User className="w-5 h-5" style={{ color: themeColor }} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight text-gray-900">Customer</CardTitle>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.1em]">Client Information</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-sky-50 rounded-full">
                                    <span className="text-[10px] font-black text-sky-500 uppercase tracking-widest">Required</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 pt-5 md:pt-8 px-4 md:px-6">
                            <Input
                                label="Customer Name"
                                name="customer_name"
                                value={formData.customer_name}
                                onChange={handleChange}
                                placeholder="FullName"
                                required
                                className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                            />
                            <Input
                                label="Phone Number"
                                name="customer_phone"
                                value={formData.customer_phone}
                                onChange={handleChange}
                                placeholder="+91 00000 00000"
                                required
                                className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                            />
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label="Billing Address (Full)"
                                    name="billing_address"
                                    value={formData.billing_address}
                                    onChange={handleChange}
                                    placeholder="House No, Street, City, State, ZIP"
                                    className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                                />
                                <Input
                                    label="Region/City (Summary)"
                                    name="customer_address"
                                    value={formData.customer_address}
                                    onChange={handleChange}
                                    placeholder="e.g. SURAT, GUJARAT"
                                    className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-6">
                                <Input
                                    label="Invoice Number"
                                    name="invoice_number"
                                    value={formData.invoice_number}
                                    onChange={handleChange}
                                    placeholder="2500233"
                                    className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                                />
                                <Input
                                    label="Invoice Date"
                                    name="invoice_date"
                                    type="date"
                                    value={formData.invoice_date}
                                    onChange={handleChange}
                                    className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Vehicle Details */}
                    <Card className="border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100">
                        <CardHeader className="border-b border-gray-50 pb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-sky-50 rounded-xl">
                                        <Car className="w-5 h-5" style={{ color: themeColor }} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight text-gray-900">Vehicle Info</CardTitle>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.1em]">Technical Details</p>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 pt-5 md:pt-8 px-4 md:px-6">
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Input
                                    label="Vehicle Model"
                                    name="car_model"
                                    value={formData.car_model}
                                    onChange={handleChange}
                                    placeholder="e.g. HONDA JAZZ 2022"
                                    required
                                    className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                                />
                                <Input
                                    label="Registration No."
                                    name="reg_no"
                                    value={formData.reg_no}
                                    onChange={handleChange}
                                    placeholder="e.g. GJ 05 RS 3026"
                                    required
                                    className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all uppercase"
                                />
                            </div>
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-50 pt-6">
                                <Input
                                    label="Engine Number"
                                    name="engine_number"
                                    value={formData.engine_number}
                                    onChange={handleChange}
                                    placeholder="Identifier"
                                    icon={<Hash className="w-4 h-4" />}
                                    className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                                />
                                <Input
                                    label="Chassis Number"
                                    name="chassis_number"
                                    value={formData.chassis_number}
                                    onChange={handleChange}
                                    placeholder="Identifier"
                                    icon={<ClipboardList className="w-4 h-4" />}
                                    className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                                />
                            </div>
                            <div className="md:col-span-2 pt-6 border-t border-gray-50">
                                <Input
                                    label="Notes / Advance Settlement"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="e.g. TOTAL AMOUNT IS INCLUDING ADVANCE AMOUNT 3,000/-"
                                    className="bg-sky-50/30 border-sky-100"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items Details */}
                    <Card className="border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100">
                        <CardHeader className="border-b border-gray-50 pb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-xl bg-gray-50">
                                        <ClipboardList className="w-5 h-5" style={{ color: themeColor }} />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight text-gray-900">Items & Descriptions</CardTitle>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.1em]">Bill Items</p>
                                    </div>
                                </div>
                                <Button type="button" variant="outline" size="sm" onClick={addItem} className="text-xs h-8 border-sky-100 text-sky-600 hover:bg-sky-50">
                                    + Add Item
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-5 md:pt-8 px-4 md:px-6">
                            {/* Table Headers (Desktop Only) */}
                            <div className="hidden md:grid grid-cols-12 gap-4 px-1 mb-2">
                                <div className="col-span-1 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center self-end pb-2">#</div>
                                <div className="col-span-4 text-[10px] font-black text-gray-400 uppercase tracking-widest self-end pb-2">Item Details</div>
                                <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest self-end pb-2">MRP</div>
                                <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest self-end pb-2">Rate</div>
                                <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest self-end pb-2">Total</div>
                                <div className="col-span-1"></div>
                            </div>

                            {formData.items.map((item, index) => (
                                <div key={index} className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start md:items-center bg-gray-50/30 p-4 md:p-0 rounded-2xl md:bg-transparent border md:border-0 border-gray-100 relative group">

                                        {/* Index */}
                                        <div className="md:col-span-1 flex md:justify-center">
                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-[10px] font-bold text-gray-500">
                                                {index + 1}
                                            </span>
                                        </div>

                                        {/* Description Select */}
                                        <div className="md:col-span-4">
                                            <label className="text-xs font-bold text-gray-500 mb-1.5 block md:hidden">Select Item</label>
                                            <select
                                                className="flex h-12 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-medium appearance-none"
                                                value={PRESET_ITEMS.some(p => p.description === item.description) ? item.description : 'custom'}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    if (val === 'custom') {
                                                        handleItemChange(index, 'description', '');
                                                    } else {
                                                        handleItemChange(index, 'description', val);
                                                    }
                                                }}
                                            >
                                                <option value="custom">-- Custom Item --</option>
                                                {PRESET_ITEMS.map((p, i) => (
                                                    <option key={i} value={p.description}>{p.description}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* MRP */}
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 mb-1.5 block md:hidden">MRP</label>
                                            <Input
                                                type="number"
                                                value={item.mrp || ''}
                                                onChange={(e) => handleItemChange(index, 'mrp', e.target.value)}
                                                placeholder="0"
                                                className="bg-gray-50/50 border-gray-100 focus:bg-white text-gray-500"
                                            />
                                        </div>

                                        {/* Selling Price */}
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 mb-1.5 block md:hidden">Selling Price</label>
                                            <Input
                                                type="number"
                                                value={item.selling_price || ''}
                                                onChange={(e) => handleItemChange(index, 'selling_price', e.target.value)}
                                                placeholder="0"
                                                className="bg-gray-50/50 border-gray-100 focus:bg-white font-semibold text-gray-900"
                                            />
                                        </div>

                                        {/* Total */}
                                        <div className="md:col-span-2">
                                            <label className="text-xs font-bold text-gray-500 mb-1.5 block md:hidden">Total</label>
                                            <Input
                                                type="number"
                                                value={item.amount || ''}
                                                readOnly
                                                placeholder="0"
                                                className="bg-sky-50/30 border-sky-100 font-bold text-black cursor-default focus:ring-0"
                                            />
                                        </div>

                                        {/* Remove Button */}
                                        <div className="md:col-span-1 absolute md:static top-2 right-2 flex md:justify-center">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeItem(index)}
                                                disabled={formData.items.length === 1}
                                                className="text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors h-10 w-10 p-0 md:h-12 md:w-12"
                                            >
                                                <span className="text-xl leading-none">×</span>
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Custom Description Input */}
                                    {!PRESET_ITEMS.some(p => p.description === item.description) && (
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 px-1 animate-in slide-in-from-top-2 fade-in">
                                            <div className="md:col-span-1"></div>
                                            <div className="md:col-span-11">
                                                <Input
                                                    value={item.description}
                                                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                    placeholder="Enter custom item description..."
                                                    className="bg-yellow-50/50 border-yellow-100 focus:bg-white text-xs"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                {/* Pricing Summary */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
                    <Card className="border-0 shadow-3xl shadow-black/5 ring-1 ring-gray-200 overflow-hidden bg-white">
                        <CardHeader className="py-8 border-b-0" style={{ backgroundColor: themeColor }}>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-md">
                                    <IndianRupee className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-white text-xl font-black tracking-tight">Summary</CardTitle>
                                    <p className="text-[10px] text-white/50 uppercase font-black tracking-[0.2em]">Financials</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6 px-5 md:pt-8 md:px-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-3.5 h-3.5 text-gray-300" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Financials</span>
                                </div>
                                <div className="p-4 bg-sky-50/50 rounded-xl space-y-2 border border-sky-100">
                                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t-2 border-dashed border-gray-100 space-y-6">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount Payable</p>
                                        <span className="text-3xl font-black text-black tracking-tighter">
                                            {formatCurrency(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/50 py-8 px-8 border-t border-gray-100 flex flex-col gap-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting || total <= 0}
                                className={cn(
                                    "w-full h-14 text-white border-0 shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-sm font-black uppercase tracking-widest",
                                    total <= 0 ? "opacity-50 grayscale cursor-not-allowed" : ""
                                )}
                                style={{ backgroundColor: total <= 0 ? '#94a3b8' : themeColor }}
                            >
                                {isSubmitting ? <Loader2 className="w-5 h-5 mr-3 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
                                {isSubmitting ? 'Saving...' : 'Finalize & Save'}
                            </Button>

                            <Button variant="outline" type="button" onClick={handleClear} className="w-full h-12 border-sky-100 text-sky-600 hover:bg-sky-50 transition-all font-bold text-[11px] uppercase tracking-wider">
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reset Form
                            </Button>

                            <div className="flex items-center justify-between w-full pt-4 border-t border-gray-200/50 mt-2">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NR: {formData.invoice_number}</span>
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: themeColor }} />
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            </div>

            {/* Custom Alert Dialog */}
            <AlertDialog
                isOpen={alertDialog.isOpen}
                onClose={() => setAlertDialog({ ...alertDialog, isOpen: false })}
                title={alertDialog.title}
                message={alertDialog.message}
                type={alertDialog.type}
            >
                {lastSavedInvoice && alertDialog.type === 'success' && (
                    <div className="flex justify-center mb-2">
                        <PDFDownloadButton
                            data={lastSavedInvoice}
                            fileName={`${lastSavedInvoice.invoice_number}.pdf`}
                        />
                    </div>
                )}
            </AlertDialog>
        </form>
    );
}
