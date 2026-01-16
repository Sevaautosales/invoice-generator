'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { User, Car, Hash, IndianRupee, Save, Download, ClipboardList, Info } from 'lucide-react';
import { formatCurrency, cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import AlertDialog from '@/components/AlertDialog';

export default function InvoiceForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        invoice_number: 'AUTO',
        customer_name: '',
        customer_phone: '',
        customer_address: '',
        vehicle_model: '',
        engine_number: '',
        chassis_number: '',
        vehicle_price: 0,
        other_charges: 0,
        amount_paid: 0,
    });

    const [totals, setTotals] = useState({
        total: 0,
        balance: 0,
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
        const total = Number(formData.vehicle_price) + Number(formData.other_charges);
        const balance = total - Number(formData.amount_paid);

        setTotals({
            total,
            balance,
        });
    }, [formData.vehicle_price, formData.other_charges, formData.amount_paid]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name.includes('price') || name.includes('charges') || name.includes('paid')
                ? (value === '' ? 0 : parseFloat(value))
                : value,
        }));
    };

    const handleClear = () => {
        setFormData({
            invoice_number: 'AUTO',
            customer_name: '',
            customer_phone: '',
            customer_address: '',
            vehicle_model: '',
            engine_number: '',
            chassis_number: '',
            vehicle_price: 0,
            other_charges: 0,
            amount_paid: 0,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { data, error } = await supabase
                .from('invoices')
                .insert([
                    {
                        customer_name: formData.customer_name,
                        customer_phone: formData.customer_phone,
                        customer_address: formData.customer_address,
                        vehicle_model: formData.vehicle_model,
                        engine_number: formData.engine_number,
                        chassis_number: formData.chassis_number,
                        vehicle_price: formData.vehicle_price,
                        other_charges: formData.other_charges,
                        total_amount: totals.total,
                        amount_paid: formData.amount_paid,
                        balance_due: totals.balance,
                        status: totals.balance <= 0 ? 'paid' : 'pending'
                    }
                ])
                .select();

            if (error) throw error;

            setAlertDialog({
                isOpen: true,
                title: 'Success!',
                message: 'Invoice saved successfully.',
                type: 'success'
            });
            handleClear();
        } catch (error: any) {
            console.error('Error saving invoice:', error);
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
                        <div className="h-1 w-8 bg-black rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Generation System</span>
                    </div>
                    <h2 className="text-4xl font-black text-black tracking-tighter uppercase">New Invoice</h2>
                    <p className="text-gray-400 font-medium mt-1 text-sm uppercase tracking-wider">Seva Auto Sales Professional Billing</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" type="button" onClick={handleClear} className="px-6 border-gray-200">
                        <Download className="w-4 h-4 mr-2 text-gray-400" />
                        Clear
                    </Button>
                    <Button variant="primary" type="submit" disabled={isSubmitting} className="px-8 bg-black border-black">
                        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        {isSubmitting ? 'Saving...' : 'Finalize & Save'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* Customer Details */}
                    <Card className="border-0 shadow-2xl shadow-gray-100 ring-1 ring-gray-100">
                        <CardHeader className="border-b border-gray-50 pb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-black rounded-xl">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight text-gray-900">Customer</CardTitle>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.1em]">Client Information</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-gray-100 rounded-full">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Required</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
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
                            <div className="md:col-span-2">
                                <Input
                                    label="Address"
                                    name="customer_address"
                                    value={formData.customer_address}
                                    onChange={handleChange}
                                    placeholder="Complete mailing address"
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
                                    <div className="p-2.5 bg-gray-100 rounded-xl">
                                        <Car className="w-5 h-5 text-black" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl font-black tracking-tight text-gray-900">Vehicle</CardTitle>
                                        <p className="text-[10px] text-gray-400 uppercase font-black tracking-[0.1em]">Technical Details</p>
                                    </div>
                                </div>
                                <div className="px-3 py-1 bg-gray-100 rounded-full">
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Specifications</span>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                            <div className="md:col-span-2">
                                <Input
                                    label="Vehicle Model"
                                    name="vehicle_model"
                                    value={formData.vehicle_model}
                                    onChange={handleChange}
                                    placeholder="Make and Model (e.g. Honda City 2024)"
                                    required
                                    className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                                />
                            </div>
                            <Input
                                label="Engine Number"
                                name="engine_number"
                                value={formData.engine_number}
                                onChange={handleChange}
                                placeholder="Enter engine identifier"
                                required
                                icon={<Hash className="w-4 h-4" />}
                                className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                            />
                            <Input
                                label="Chassis Number"
                                name="chassis_number"
                                value={formData.chassis_number}
                                onChange={handleChange}
                                placeholder="Enter chassis identifier"
                                required
                                icon={<ClipboardList className="w-4 h-4" />}
                                className="bg-gray-50/50 border-gray-100 focus:bg-white transition-all"
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Pricing Summary */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
                    <Card className="border-0 shadow-3xl shadow-black/5 ring-1 ring-gray-200 overflow-hidden bg-white">
                        <CardHeader className="bg-black py-8 border-b-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
                                    <IndianRupee className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-white text-xl font-black tracking-tight">Summary</CardTitle>
                                    <p className="text-[10px] text-white/40 uppercase font-black tracking-[0.2em]">Financials</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-8 px-8">
                            <Input
                                label="Unit Price"
                                name="vehicle_price"
                                type="number"
                                value={formData.vehicle_price || ''}
                                onChange={handleChange}
                                icon={<span className="text-sm font-bold">₹</span>}
                                required
                                className="text-lg font-bold border-gray-100 bg-gray-50/30"
                            />

                            <div className="space-y-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <Info className="w-3.5 h-3.5 text-gray-300" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Additional</span>
                                </div>
                                <Input
                                    label="Other Charges"
                                    name="other_charges"
                                    type="number"
                                    value={formData.other_charges || ''}
                                    onChange={handleChange}
                                    icon={<span className="text-sm font-bold">₹</span>}
                                    className="bg-gray-50/30"
                                />
                            </div>

                            <div className="pt-8 mt-4 border-t border-gray-100 space-y-4">
                                <Input
                                    label="Amount Paid"
                                    name="amount_paid"
                                    type="number"
                                    value={formData.amount_paid || ''}
                                    onChange={handleChange}
                                    icon={<span className="text-sm font-bold">₹</span>}
                                    className="bg-gray-50/30"
                                />

                                <div className="pt-6 border-t-2 border-dashed border-gray-100 space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Amount Due</p>
                                            <span className="text-3xl font-black text-black tracking-tighter">
                                                {formatCurrency(totals.total)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Balance Remaining</p>
                                            <span className={cn(
                                                "text-2xl font-black tracking-tighter",
                                                totals.balance > 0 ? "text-red-600" : "text-gray-900"
                                            )}>
                                                {formatCurrency(totals.balance)}
                                            </span>
                                        </div>
                                        {totals.balance <= 0 && formData.amount_paid > 0 && (
                                            <div className="px-3 py-1 bg-black text-white text-[9px] font-black uppercase rounded-full">
                                                Full Paid
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50/50 py-6 px-8 border-t border-gray-100">
                            <div className="flex items-center justify-between w-full">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">ID: {formData.invoice_number}</span>
                                <div className="w-2 h-2 rounded-full bg-black animate-pulse" />
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
            />
        </form>
    );
}
