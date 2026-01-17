'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface AlertDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'info';
    children?: React.ReactNode;
}

export default function AlertDialog({
    isOpen,
    onClose,
    title,
    message,
    type = 'success',
    children
}: AlertDialogProps) {
    if (!isOpen) return null;

    const iconConfig = {
        success: { Icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
        error: { Icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        info: { Icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' }
    };

    const { Icon, color, bg } = iconConfig[type];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl ${bg} mb-6`}>
                        <Icon className={`w-8 h-8 ${color}`} />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-black text-black tracking-tight mb-3">
                        {title}
                    </h3>
                    <p className="text-gray-600 font-medium leading-relaxed mb-8">
                        {message}
                    </p>

                    {children && (
                        <div className="mb-4">
                            {children}
                        </div>
                    )}

                    {/* Action */}
                    <Button
                        variant="primary"
                        onClick={onClose}
                        className="w-full h-12 rounded-2xl bg-black border-black font-bold uppercase tracking-widest text-[10px]"
                    >
                        Got It
                    </Button>
                </div>
            </div>
        </div>
    );
}
