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
        paddingVertical: 16,
        paddingHorizontal: 0,
        fontSize: 10,
        fontFamily: 'Inter',
        color: '#111827',
        backgroundColor: '#FFFFFF',
    },
    section: {
        marginHorizontal: 32,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 32,
        paddingTop: 12
    },
    labelInvoice: {
        color: themeColor,
        fontSize: 20,
        fontWeight: 900,
        letterSpacing: 2,
        textTransform: 'uppercase'
    },
    labelRecipient: {
        fontSize: 10,
        color: '#9ca3af',
        fontWeight: 700,
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
    brandingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        marginBottom: 16,
        position: 'relative'
    },
    companySection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        flex: 1
    },
    logo: {
        width: 64,
        height: 64
    },
    companyInfo: {
        flex: 1
    },
    companyName: {
        fontSize: 34,
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#1a1a1a',
        letterSpacing: -1,
        lineHeight: 1
    },
    companyTagline: {
        fontSize: 9,
        color: '#9ca3af',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginTop: 2
    },
    companyDetails: {
        fontSize: 10,
        color: '#4b5563',
        lineHeight: 1.3,
        marginTop: 8,
        textTransform: 'uppercase',
        fontWeight: 700,
        maxWidth: 400
    },
    addressDetails: {
        fontSize: 9,
        color: '#4b5563',
        marginTop: 1,
        fontWeight: 700,
    },
    contactSection: {
        textAlign: 'right',
        paddingRight: 24
    },
    contactText: {
        fontSize: 14,
        fontWeight: 900,
        color: '#1a1a1a',
        marginBottom: 2
    },
    estLabel: {
        fontSize: 10,
        color: '#d1d5db',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 3,
        position: 'absolute',
        right: 0,
        top: 24,
        transform: 'rotate(90deg)',
    },
    infoGrid: {
        flexDirection: 'row',
        borderTop: 1,
        borderBottom: 1,
        borderColor: '#f3f4f6',
        paddingVertical: 12,
        marginBottom: 16,
        backgroundColor: '#f9fafb',
        paddingHorizontal: 32
    },
    infoCol: {
        flex: 1,
        paddingRight: 16
    },
    infoColBorder: {
        borderLeft: 1,
        borderColor: '#f3f4f6',
        paddingLeft: 32
    },
    infoLabel: {
        fontSize: 10,
        color: '#9ca3af',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 2
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 900,
        color: '#000000'
    },
    infoSubValue: {
        fontSize: 11,
        fontWeight: 700,
        color: '#4b5563',
        marginTop: 1
    },
    carDetails: {
        marginHorizontal: 32,
        marginBottom: 16,
        borderBottom: 1,
        borderColor: '#f3f4f6',
        paddingBottom: 8
    },
    carHeader: {
        fontSize: 11,
        fontWeight: 900,
        marginBottom: 8,
        color: '#111827',
        letterSpacing: 1.5,
        textTransform: 'uppercase'
    },
    carGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    carItem: {
        fontSize: 11,
        color: '#4b5563',
        fontWeight: 700,
        marginBottom: 2,
        textTransform: 'uppercase'
    },
    carBoldValue: {
        color: '#000',
        fontWeight: 900
    },
    tableHeader: {
        flexDirection: 'row',
        marginHorizontal: 32,
        borderBottom: 2,
        borderColor: '#000',
        paddingBottom: 4,
        marginBottom: 0,
        fontWeight: 900,
        fontSize: 11,
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
        marginHorizontal: 32,
        paddingVertical: 10,
        borderBottom: 1,
        borderColor: '#f3f4f6',
        alignItems: 'flex-start'
    },
    rowNo: {
        fontSize: 13,
        fontWeight: 900,
        color: '#d1d5db',
        width: '8.33%'
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#000',
        lineHeight: 1.1
    },
    itemSub: {
        fontSize: 10,
        color: '#9ca3af',
        marginTop: 2,
        fontWeight: 700,
        textTransform: 'uppercase',
        opacity: 0.7
    },
    rowPrice: {
        fontSize: 15,
        fontWeight: 900,
        color: '#111827',
        textAlign: 'right',
        width: '25%'
    },
    rowAmount: {
        fontSize: 15,
        fontWeight: 900,
        color: '#000',
        textAlign: 'right',
        width: '25%'
    },
    totalsSection: {
        alignItems: 'flex-end',
        marginHorizontal: 32,
        marginTop: 12,
        marginBottom: 16,
        paddingTop: 12,
        borderTop: 1,
        borderTopColor: '#f3f4f6'
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: 256,
        backgroundColor: '#f9fafb',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 8
    },
    totalLabel: {
        fontSize: 14,
        fontWeight: 900,
        textTransform: 'uppercase',
        color: '#9ca3af',
        letterSpacing: 1.5
    },
    totalValue: {
        fontSize: 30,
        fontWeight: 900,
        color: '#000',
        letterSpacing: -1.5
    },
    amountWordsHeader: {
        fontSize: 10,
        color: '#9ca3af',
        fontWeight: 900,
        textTransform: 'uppercase',
        textAlign: 'right',
        letterSpacing: 1,
        marginBottom: 1
    },
    amountWords: {
        fontSize: 11,
        fontWeight: 900,
        textAlign: 'right',
        fontStyle: 'italic',
        color: '#111827',
        maxWidth: 320,
        textTransform: 'uppercase',
        lineHeight: 1.2
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 32,
        marginTop: 4,
        marginBottom: 16,
        alignItems: 'flex-end'
    },
    notesSection: {
        width: '50%'
    },
    notesBox: {
        backgroundColor: '#f0f9ff',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0f2fe',
        marginBottom: 8
    },
    termsSection: {
        backgroundColor: '#f9fafb',
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f3f4f6'
    },
    termsHeader: {
        fontSize: 10,
        fontWeight: 900,
        marginBottom: 4,
        textTransform: 'uppercase',
        color: '#111827',
        letterSpacing: 1
    },
    termItem: {
        flexDirection: 'row',
        marginBottom: 2
    },
    termIdx: {
        fontSize: 8,
        fontWeight: 900,
        color: '#d1d5db',
        marginRight: 6
    },
    termText: {
        fontSize: 8,
        color: '#6b7280',
        fontWeight: 700,
        textTransform: 'uppercase'
    },
    authSection: {
        width: '40%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    authLabel: {
        fontSize: 12,
        fontWeight: 900,
        marginBottom: 32,
        textTransform: 'uppercase',
        color: '#1a110d'
    },
    authLine: {
        width: 192,
        height: 1,
        backgroundColor: '#e5e7eb'
    },
    authSub: {
        fontSize: 10,
        color: '#9ca3af',
        fontWeight: 900,
        marginTop: 8,
        textTransform: 'uppercase',
        letterSpacing: 1.5
    },
    footer: {
        marginTop: 'auto',
        marginHorizontal: 32,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f9fafb'
    },
    footerText: {
        fontSize: 10,
        color: '#d1d5db',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: 1.5
    },
    footerCompany: {
        color: '#1a1a1a',
        opacity: 0.2
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
                    <View style={styles.companySection}>
                        <Image src="/logo.png" style={styles.logo} />
                        <View style={styles.companyInfo}>
                            <Text style={styles.companyName}>Seva Auto Sales</Text>
                            <Text style={styles.companyTagline}>PROFESSIONAL VEHICLE MODIFICATIONS</Text>
                            <Text style={styles.companyDetails}>
                                Side Car For Two Wheeler Scooter & Bike, Four Wheel Attachment For Handicap, Auto Clutch & Hand Operate Kit of Four Wheels Cars
                            </Text>
                            <View style={{ marginTop: 8, borderTop: 1, borderColor: '#f3f4f6', paddingTop: 8 }}>
                                <Text style={styles.addressDetails}>
                                    <Text style={{ opacity: 0.4 }}>Work: </Text>Street No. 14, Ghanshyam Nagar Soc., Opp. New Shaktivijay, L.H. Road, SURAT.
                                </Text>
                                <View style={{ flexDirection: 'row', marginTop: 2, gap: 16 }}>
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
                    <View style={styles.contactSection}>
                        <Text style={styles.contactText}>Mo. 99043 66000</Text>
                        <Text style={styles.contactText}>94271 00629</Text>
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
