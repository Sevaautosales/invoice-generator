'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Download, Loader2 } from 'lucide-react';
import { exportElementToPDF } from '@/lib/exportPDF';
import { createRoot } from 'react-dom/client';
import InvoicePreview from './InvoicePreview';

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
            // Create a hidden container to render the preview for capture
            const container = document.createElement('div');
            container.id = 'hidden-invoice-capture-container';
            // Position off-screen and set consistent width for capture
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '-9999px';
            container.style.width = '850px';
            document.body.appendChild(container);

            const root = createRoot(container);

            // Wrap in a promise to wait for state/rendering to settle
            await new Promise<void>((resolve) => {
                root.render(<InvoicePreview data={data} />);
                // Small timeout to ensure Next.js Image and other styles are ready
                setTimeout(resolve, 500);
            });

            // Capture the specific area inside the newly rendered container
            await exportElementToPDF('invoice-capture-area', fileName);

            // Cleanup
            root.unmount();
            document.body.removeChild(container);
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
