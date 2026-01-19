import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import { formatCurrency } from '@/lib/utils';
import { numberToWords } from '@/lib/numberToWords';

// Register Inter font
Font.register({
    family: 'Inter',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf', fontWeight: 400 },
        { src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.ttf', fontWeight: 700 },
        { src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-900-normal.ttf', fontWeight: 900 },
        { src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-italic.ttf', fontStyle: 'italic', fontWeight: 400 },
        { src: 'https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-italic.ttf', fontStyle: 'italic', fontWeight: 700 },
    ]
});

const themeColor = '#0EA5E9';

const styles = StyleSheet.create({
    page: {
        paddingVertical: 20, // Preview has padding inside Card, but page allows bleeding.
        paddingHorizontal: 0,
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter',
    },
    // Preview uses px-8 (32px) -> 32 * 0.7 = 22.4
    section: {
        marginHorizontal: 22,
    },
    // Header: px-8 (32px), pt-6 (24px)
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 11, // mb-4 (16px * 0.7)
        paddingHorizontal: 22,
        paddingTop: 17
    },
    labelInvoice: {
        color: themeColor,
        fontSize: 14, // text-xl (20px * 0.7)
        fontWeight: 900,
        letterSpacing: 2, // tracking-widest
        textTransform: 'uppercase'
    },
    labelRecipient: {
        fontSize: 7, // text-[10px] * 0.7
        color: '#9ca3af',
        fontWeight: 900,
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
    // Branding: px-8 (32px), mb-8 (32px)
    brandingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 22,
        marginBottom: 22,
        position: 'relative'
    },
    companySection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 11, // gap-4 (16px * 0.7)
        flex: 1
    },
    logo: {
        width: 56, // w-20 (80px * 0.7 = 56)
        height: 56
    },
    companyInfo: {
        flex: 1
    },
    companyName: {
        fontSize: 25, // text-4xl (36px * 0.7 = 25.2)
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#1a1a1a',
        letterSpacing: -1, // tracking-tighter
        lineHeight: 1
    },
    companyTagline: {
        fontSize: 6.5, // text-[9px] * 0.7
        color: '#9ca3af',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 1.4, // tracking-[0.2em]
        marginTop: 4
    },
    companyDetails: {
        fontSize: 7, // text-[10px] * 0.7
        color: '#6b7280', // gray-500
        lineHeight: 1.3,
        marginTop: 4, // space-y-1
        textTransform: 'uppercase',
        fontWeight: 700,
        maxWidth: 280
    },
    addressDetails: {
        fontSize: 6.5, // 9px * 0.7
        color: '#4b5563',
        marginTop: 2,
        fontWeight: 700,
    },
    contactSection: {
        textAlign: 'right',
        paddingRight: 0
    },
    contactText: {
        fontSize: 9.8, // text-sm (14px * 0.7)
        fontWeight: 900,
        color: '#1a1a1a',
        marginBottom: 2
    },
    estLabel: {
        fontSize: 7, // text-[10px]
        color: '#d1d5db', // gray-300
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 2,
        position: 'absolute',
        right: 0,
        top: 28,
        transform: 'rotate(90deg)',
    },
    // Info Grid: py-6 (24px * 0.7 = 16.8), mx-8 (22)
    infoGrid: {
        flexDirection: 'row',
        borderTop: 1,
        borderBottom: 1,
        borderColor: '#f3f4f6', // gray-100
        paddingVertical: 17,
        marginBottom: 22,
        backgroundColor: 'rgba(249, 250, 251, 0.3)',
        marginHorizontal: 22
    },
    infoCol: {
        flex: 1,
        paddingRight: 16
    },
    infoColBorder: {
        borderLeft: 1,
        borderColor: '#f3f4f6',
        paddingLeft: 22 // pl-8 (32 * 0.7)
    },
    infoLabel: {
        fontSize: 7, // text-[10px]
        color: '#9ca3af', // gray-400
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 0
    },
    infoValue: {
        fontSize: 9.8, // text-[14px]
        fontWeight: 900,
        color: '#000000'
    },
    infoSubValue: {
        fontSize: 7.7, // text-[11px]
        fontWeight: 700,
        color: '#4b5563',
        marginTop: 2,
        textTransform: 'uppercase'
    },
    // Car Details: mx-8 (22), mb-8 (22)
    carDetails: {
        marginHorizontal: 22,
        marginBottom: 22,
    },
    carHeader: {
        fontSize: 7.7, // text-[11px]
        fontWeight: 900,
        marginBottom: 8,
        color: '#111827',
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        borderBottom: 1,
        borderColor: '#f3f4f6',
        paddingBottom: 5
    },
    carGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 22
    },
    carItem: {
        fontSize: 7.7, // text-[11px]
        color: '#4b5563',
        fontWeight: 700,
        marginBottom: 2.8, // space-y-1
        textTransform: 'uppercase'
    },
    carBoldValue: {
        color: '#000',
        fontWeight: 900
    },
    // Table Header: mx-8 (22)
    tableHeader: {
        flexDirection: 'row',
        marginHorizontal: 22,
        borderBottom: 2,
        borderColor: '#000',
        paddingBottom: 5.6, // pb-2 (8px * 0.7)
        marginBottom: 0,
        fontWeight: 900,
        fontSize: 7.7, // text-[11px]
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: '#1a1a1a'
    },
    col1: { width: '8.33%' },
    col2: { width: '41.67%' },
    col3: { width: '25%', textAlign: 'right' },
    col4: { width: '25%', textAlign: 'right' },
    tableRow: {
        flexDirection: 'row',
        marginHorizontal: 22,
        paddingVertical: 14, // py-5 (20px * 0.7)
        borderBottom: 1,
        borderColor: '#f3f4f6',
        alignItems: 'flex-start'
    },
    rowNo: {
        fontSize: 9.1, // text-[13px]
        fontWeight: 900,
        color: '#d1d5db',
        width: '8.33%'
    },
    itemTitle: {
        fontSize: 9.8, // text-[14px]
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#000',
        lineHeight: 1.1,
        letterSpacing: -0.3 // tracking-tight
    },
    itemSub: {
        fontSize: 7, // text-[10px]
        color: '#9ca3af',
        marginTop: 4, // mt-1.5
        fontWeight: 700,
        textTransform: 'uppercase',
        opacity: 0.8
    },
    rowPrice: {
        fontSize: 10.5, // text-[15px]
        fontWeight: 900,
        color: '#111827',
        textAlign: 'right',
        width: '25%'
    },
    rowAmount: {
        fontSize: 10.5, // text-[15px]
        fontWeight: 900,
        color: '#000',
        textAlign: 'right',
        width: '25%'
    },
    totalsSection: {
        alignItems: 'flex-end',
        marginHorizontal: 22,
        marginTop: 17, // pt-6
        marginBottom: 33, // mb-12
        paddingTop: 17,
        borderTop: 1,
        borderColor: '#f3f4f6'
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 179, // w-64 (256px * 0.7)
        backgroundColor: '#f9fafb',
        paddingHorizontal: 11, // p-4 (16px * 0.7)
        paddingVertical: 11,
        borderRadius: 8, // rounded-xl (use 8 for pdf)
        marginBottom: 11
    },
    totalLabel: {
        fontSize: 9.8, // text-sm
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#9ca3af',
        letterSpacing: 1.5
    },
    totalValue: {
        fontSize: 21, // text-3xl (30px * 0.7)
        fontWeight: 900,
        color: '#000',
        letterSpacing: -1
    },
    amountWordsHeader: {
        fontSize: 7, // text-[10px]
        color: '#9ca3af',
        fontWeight: 900,
        textTransform: 'uppercase',
        textAlign: 'right',
        letterSpacing: 1.5,
        marginBottom: 2.8
    },
    amountWords: {
        fontSize: 7.7, // text-[11px]
        fontWeight: 900,
        textAlign: 'right',
        fontStyle: 'italic',
        color: '#111827',
        maxWidth: 224, // max-w-md (448px * 0.7 approx 313, reduced for safety)
        textTransform: 'uppercase',
        lineHeight: 1.2
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 22,
        marginBottom: 33, // mb-12
        alignItems: 'flex-end',
        gap: 22
    },
    notesSection: {
        width: '60%' // space-y-4
    },
    notesBox: {
        backgroundColor: 'rgba(14, 165, 233, 0.04)',
        padding: 8.4, // p-3
        borderRadius: 8, // rounded-xl
        borderWidth: 1,
        borderColor: 'rgba(14, 165, 233, 0.08)',
        marginBottom: 11 // space-y-4
    },
    termsSection: {
        backgroundColor: 'rgba(249, 250, 251, 0.6)',
        padding: 11, // p-4
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#f3f4f6'
    },
    termsHeader: {
        fontSize: 7, // text-[10px]
        fontWeight: 900,
        marginBottom: 5.6, // mb-2
        textTransform: 'uppercase',
        color: '#111827',
        letterSpacing: 1.5
    },
    termItem: {
        flexDirection: 'row',
        marginBottom: 2
    },
    termIdx: {
        fontSize: 5.6, // text-[8px]
        fontWeight: 900,
        color: '#d1d5db',
        marginRight: 5.6
    },
    termText: {
        fontSize: 5.6, // text-[8px]
        color: '#6b7280',
        fontWeight: 700,
        textTransform: 'uppercase'
    },
    authSection: {
        paddingTop: 11,
        alignItems: 'flex-end'
    },
    authLabel: {
        fontSize: 8.4, // text-[12px]
        fontWeight: 900,
        marginBottom: 33, // mb-12
        textTransform: 'uppercase',
        color: '#111827'
    },
    authLine: {
        width: 134, // w-48 (192px * 0.7)
        height: 1,
        backgroundColor: '#d1d5db'
    },
    authSub: {
        fontSize: 7, // text-[10px]
        color: '#9ca3af',
        fontWeight: 900,
        marginTop: 5.6,
        textTransform: 'uppercase',
        letterSpacing: 1.5
    },
    footer: {
        marginTop: 'auto',
        marginHorizontal: 22,
        marginBottom: 22, // mb-8
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    footerText: {
        fontSize: 7, // text-[10px]
        color: '#d1d5db',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 1.5
    },
    footerCompany: {
        color: 'rgba(0,0,0,0.2)'
    }
});

interface InvoicePDFProps {
    data: any;
}

export const InvoicePDF = ({ data }: InvoicePDFProps) => {
    const formattedDate = data.invoice_date ? new Date(data.invoice_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }) : '';

    const amountInWords = `INR ${numberToWords(data.total_amount)} Rupees Only.`;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header Label */}
                <View style={styles.headerRow}>
                    <Text style={styles.labelInvoice}>INVOICE</Text>
                    <Text style={styles.labelRecipient}>ORIGINAL FOR RECIPIENT</Text>
                </View>

                {/* Branding */}
                <View style={styles.brandingRow}>
                    <View style={{ flex: 1 }}>
                        {/* Logo + Title Row */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 11 }}>
                            <View style={{ width: 56, height: 56, marginRight: 11, alignItems: 'center', justifyContent: 'center' }}>
                                <Image src="/logo.png" style={{ width: 56, height: 56, objectFit: 'contain' }} />
                            </View>
                            <View>
                                <Text style={styles.companyName}>Seva Auto Sales</Text>
                                <Text style={styles.companyTagline}>Professional Vehicle Modifications</Text>
                            </View>
                        </View>

                        {/* Details Block - Now below the logo row, matching Preview structure */}
                        <View>
                            <View style={{ marginBottom: 6 }}>
                                <Text style={styles.companyDetails}>
                                    Side Car For Two Wheeler Scooter & Bike, Four Wheel Attachment For Handicap, Auto Clutch & Hand Operate Kit of Four Wheels Cars
                                </Text>
                            </View>
                            <View style={{ paddingTop: 6, borderTop: 1, borderColor: '#f3f4f6' }}>
                                <Text style={styles.addressDetails}>
                                    <Text style={{ opacity: 0.4 }}>Work: </Text>Street No. 14, Ghanshyam Nagar Soc., Opp. New Shaktivijay, L.H. Road, SURAT.
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 2, gap: 11 }}>
                                    <Text style={styles.addressDetails}>
                                        <Text style={{ opacity: 0.4 }}>Email: </Text>sevaautosales@gmail.com
                                    </Text>
                                    <Text style={styles.addressDetails}>
                                        <Text style={{ opacity: 0.4 }}>Web: </Text>sevaautosales.vercel.app
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Right Side Contact */}
                    <View style={styles.contactSection}>
                        <Text style={styles.contactText}>Mo. 99043 66000</Text>
                        <Text style={styles.contactText}>99136 55204</Text>
                    </View>
                    <Text style={styles.estLabel}>Est. 2005</Text>
                </View>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoCol}>
                        <View style={{ flexDirection: 'row', marginBottom: 16, alignItems: 'center' }}>
                            <Text style={[styles.infoLabel, { marginBottom: 0, width: 80 }]}>Bill No.:</Text>
                            <Text style={styles.infoValue}>{data.invoice_number}</Text>
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Customer Details:</Text>
                            <Text style={[styles.infoValue, { textTransform: 'uppercase' }]}>{data.customer_name}</Text>
                            <Text style={styles.infoSubValue}>Ph: {data.customer_phone}</Text>
                        </View>
                    </View>
                    <View style={[styles.infoCol, styles.infoColBorder]}>
                        <View style={{ flexDirection: 'row', marginBottom: 16, alignItems: 'center' }}>
                            <Text style={[styles.infoLabel, { marginBottom: 0, width: 80 }]}>Date:</Text>
                            <Text style={styles.infoValue}>{formattedDate}</Text>
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Billing Address:</Text>
                            <Text style={[styles.infoSubValue, { fontSize: 11, color: '#4b5563', textTransform: 'uppercase' }]}>{data.billing_address}</Text>
                            <Text style={[styles.infoSubValue, { fontSize: 11, color: '#4b5563', textTransform: 'uppercase', marginTop: 4 }]}>{data.customer_address}</Text>
                        </View>
                    </View>
                </View>

                {/* Car Details */}
                <View style={styles.carDetails}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: themeColor, marginRight: 8 }} />
                        <Text style={styles.carHeader}>TECHNICAL SPECS:-</Text>
                    </View>
                    <View style={styles.carGrid}>
                        <View style={{ width: '48%' }}>
                            <Text style={styles.carItem}>Vehicle Model : <Text style={styles.carBoldValue}>{data.car_model}</Text></Text>
                            <Text style={styles.carItem}>Reg no. : <Text style={styles.carBoldValue}>{data.reg_no}</Text></Text>
                        </View>
                        <View style={{ width: '48%' }}>
                            {data.engine_number && <Text style={styles.carItem}>Engine No. : <Text style={styles.carBoldValue}>{data.engine_number}</Text></Text>}
                            {data.chassis_number && <Text style={styles.carItem}>Chassis No. : <Text style={styles.carBoldValue}>{data.chassis_number}</Text></Text>}
                        </View>
                    </View>
                </View>

                {/* Table Header */}
                <View style={styles.tableHeader}>
                    <Text style={styles.col1}>No.</Text>
                    <Text style={styles.col2}>Descriptions</Text>
                    <Text style={styles.col3}>Rate</Text>
                    <Text style={styles.col4}>Amount</Text>
                </View>

                {/* Items */}
                {data.items.map((item: any, idx: number) => (
                    <View key={idx} style={styles.tableRow}>
                        <Text style={styles.rowNo}>{(idx + 1).toString().padStart(2, '0')}</Text>
                        <View style={styles.col2}>
                            <Text style={styles.itemTitle}>{item.description}</Text>
                            <Text style={styles.itemSub}>Quality modification with precision engineering</Text>
                        </View>
                        <Text style={styles.rowPrice}>{formatCurrency(item.selling_price).replace('₹', '')}</Text>
                        <Text style={styles.rowAmount}>{formatCurrency(item.amount).replace('₹', '')}</Text>
                    </View>
                ))}

                {/* Totals */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>{formatCurrency(data.total_amount)}</Text>
                    </View>
                    <View style={{ textAlign: 'right' }}>
                        <Text style={styles.amountWordsHeader}>Amount in Words:</Text>
                        <Text style={styles.amountWords}>{amountInWords}</Text>
                    </View>
                </View>

                {/* Meta Row */}
                <View style={styles.metaRow}>
                    <View style={styles.notesSection}>
                        {data.notes ? (
                            <View style={styles.notesBox}>
                                <Text style={[styles.infoLabel, { color: themeColor, marginBottom: 4, fontSize: 10 }]}>Notes:</Text>
                                <Text style={{ fontSize: 11, fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', lineHeight: 1.4, color: '#1a1a1a' }}>{data.notes}</Text>
                            </View>
                        ) : null}

                        <View style={styles.termsSection}>
                            <Text style={styles.termsHeader}>Terms & Conditions:</Text>
                            {[
                                'Goods once sold will not taken back.',
                                'Damage while using not covered under warranty.',
                                'Product carries 1 YEAR Warranty.',
                                'Repaired/Alteration is at owner risk.'
                            ].map((term, i) => (
                                <View key={i} style={styles.termItem}>
                                    <Text style={styles.termIdx}>{i + 1}.</Text>
                                    <Text style={styles.termText}>{term}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <View style={styles.authSection}>
                        <Text style={styles.authLabel}>For Seva Auto Sales</Text>
                        <View style={styles.authLine} />
                        <Text style={styles.authSub}>Authorized Signatory</Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Page 1/1</Text>
                    <Text style={styles.footerText}>Computer Generated Document • No Signature Required</Text>
                    <Text style={[styles.footerText, styles.footerCompany]}>Seva Auto Sales</Text>
                </View>
            </Page>
        </Document>
    );
};
