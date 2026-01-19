'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Loader2 } from 'lucide-react';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from '@/components/InvoicePDF';

interface PDFDownloadIconButtonProps {
    data: any;
    fileName?: string;
}

export default function PDFDownloadIconButton({ data, fileName = 'invoice.pdf' }: PDFDownloadIconButtonProps) {
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
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            disabled={isGenerating}
            onClick={handleDownload}
            className="h-10 w-10 p-0 rounded-full border-sky-50 bg-sky-50/30 hover:border-sky-500 hover:bg-sky-50 active:scale-90 transition-all group"
        >
            {isGenerating ? (
                <Loader2 className="w-4 h-4 text-sky-400 animate-spin" />
            ) : (
                <Download className="w-4 h-4 text-sky-400 group-hover:text-sky-600" />
            )}
        </Button>
    );
}
