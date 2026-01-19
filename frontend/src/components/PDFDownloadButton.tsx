'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Loader2 } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/InvoicePDF';

interface PDFDownloadButtonProps {
    data: any;
    fileName?: string;
}

export default function PDFDownloadButton({ data, fileName = 'invoice.pdf' }: PDFDownloadButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (isGenerating) return;

        setIsGenerating(true);
        try {
            // Use @react-pdf/renderer for high-quality, vector-based PDF
            const blob = await pdf(<InvoicePDF data={data} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('PDF Generation Error:', error);
            alert('Failed to generate PDF.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="inline-block">
            <Button
                variant="primary"
                disabled={isGenerating}
                onClick={handleDownload}
                className="h-12 px-8 rounded-2xl bg-sky-500 border-sky-500 shadow-lg shadow-sky-500/10 transition-all active:scale-95 uppercase tracking-widest font-black text-[10px] hover:bg-sky-600 hover:border-sky-600"
            >
                {isGenerating ? (
                    <Loader2 className="w-4 h-4 mr-3 animate-spin text-white" />
                ) : (
                    <Download className="w-4 h-4 mr-3 text-white" />
                )}
                {isGenerating ? 'Generating...' : 'Export PDF'}
            </Button>
        </div>
    );
}
