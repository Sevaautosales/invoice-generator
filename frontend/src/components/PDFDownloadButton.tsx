'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/Button';
import { Download, Loader2 } from 'lucide-react';
import { InvoicePDF } from './InvoicePDF';

// Dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

interface PDFDownloadButtonProps {
    data: any;
    fileName?: string;
}

export default function PDFDownloadButton({ data, fileName = 'invoice.pdf' }: PDFDownloadButtonProps) {
    return (
        <div className="inline-block">
            <PDFDownloadLink
                document={<InvoicePDF data={data} />}
                fileName={fileName}
            >
                {({ blob, url, loading, error }) => (
                    <Button
                        variant="primary"
                        disabled={loading}
                        className="h-12 px-8 rounded-2xl bg-black border-black shadow-lg shadow-black/10 transition-all active:scale-95 uppercase tracking-widest font-black text-[10px]"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-3 animate-spin text-white" />
                        ) : (
                            <Download className="w-4 h-4 mr-3 text-white" />
                        )}
                        {loading ? 'Processing...' : 'Export PDF'}
                    </Button>
                )}
            </PDFDownloadLink>
        </div>
    );
}
