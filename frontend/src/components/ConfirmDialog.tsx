'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    type?: 'danger' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    type = 'warning',
    confirmText = 'Confirm',
    cancelText = 'Cancel'
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const iconConfig = {
        danger: { Icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        warning: { Icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
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
                <div className="p-8">
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

                    {/* Actions */}
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 h-12 rounded-2xl border-gray-200 font-bold uppercase tracking-widest text-[10px]"
                        >
                            {cancelText}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            className={`flex-1 h-12 rounded-2xl font-bold uppercase tracking-widest text-[10px] ${type === 'danger'
                                    ? 'bg-red-600 border-red-600 hover:bg-red-700'
                                    : 'bg-black border-black'
                                }`}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
