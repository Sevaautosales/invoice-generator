import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { formatCurrency } from '@/lib/utils';
import { numberToWords } from '@/lib/numberToWords';

// Define styles
const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#1a1a1a',
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column'
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    labelInvoice: {
        color: '#0EA5E9',
        fontSize: 20,
        fontWeight: 'bold'
    },
    labelRecipient: {
        fontSize: 7,
        color: '#9ca3af',
        fontWeight: 'bold'
    },
    brandingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    companySection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flex: 1
    },
    logo: {
        width: 50,
        height: 50
    },
    companyInfo: {
        flex: 1
    },
    companyName: {
        fontSize: 32,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 2
    },
    companyTagline: {
        fontSize: 9,
        color: '#9ca3af',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    companyDetails: {
        fontSize: 7,
        color: '#6b7280',
        lineHeight: 1.3,
        marginTop: 5,
        textTransform: 'uppercase'
    },
    contactSection: {
        textAlign: 'right'
    },
    contactText: {
        fontSize: 11,
        fontWeight: 'bold'
    },
    estLabel: {
        fontSize: 8,
        color: '#d1d5db',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'right',
        marginTop: 15
    },
    infoGrid: {
        flexDirection: 'row',
        borderTop: 1,
        borderBottom: 1,
        borderColor: '#f3f4f6',
        paddingVertical: 12,
        marginBottom: 20,
        backgroundColor: '#f9fafb'
    },
    infoCol: {
        flex: 1,
        paddingHorizontal: 15
    },
    infoColBorder: {
        borderLeft: 1,
        borderColor: '#f3f4f6'
    },
    infoLabel: {
        fontSize: 7,
        color: '#9ca3af',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 2
    },
    infoValue: {
        fontSize: 12,
        fontWeight: 'bold'
    },
    carDetails: {
        marginBottom: 15,
        borderBottom: 1,
        borderColor: '#f3f4f6',
        paddingBottom: 10
    },
    carHeader: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#0EA5E9'
    },
    carGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    carItem: {
        fontSize: 8,
        color: '#4b5563',
        marginBottom: 2
    },
    carBoldValue: {
        color: '#000',
        fontWeight: 'bold'
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: 2,
        borderColor: '#000',
        paddingBottom: 5,
        marginBottom: 5,
        fontWeight: 'bold'
    },
    col1: { width: '8%', fontSize: 11 },
    col2: { width: '47%', fontSize: 11 },
    col3: { width: '22%', textAlign: 'right', fontSize: 11 },
    col4: { width: '23%', textAlign: 'right', fontSize: 11 },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottom: 1,
        borderColor: '#f3f4f6'
    },
    itemTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    itemSub: {
        fontSize: 7,
        color: '#9ca3af',
        marginTop: 2
    },
    totalsSection: {
        alignItems: 'flex-end',
        marginTop: 20,
        marginBottom: 20
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 220,
        backgroundColor: '#f9fafb',
        padding: 8,
        borderRadius: 8,
        marginBottom: 10
    },
    totalLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        color: '#9ca3af'
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    amountWordsHeader: {
        fontSize: 7,
        color: '#9ca3af',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'right'
    },
    amountWords: {
        fontSize: 8,
        fontWeight: 'bold',
        textAlign: 'right',
        fontStyle: 'italic'
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 30
    },
    notesSection: {
        width: '50%'
    },
    notesBox: {
        backgroundColor: '#f0f9ff',
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0f2fe'
    },
    footerMeta: {
        fontSize: 7,
        fontWeight: 'bold',
        color: '#9ca3af',
        marginTop: 10,
        textTransform: 'uppercase'
    },
    authSection: {
        width: '40%',
        alignItems: 'flex-end'
    },
    authLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 35
    },
    authLine: {
        width: 150,
        height: 1,
        backgroundColor: '#e5e7eb'
    },
    authSub: {
        fontSize: 8,
        color: '#9ca3af',
        marginTop: 5,
        textTransform: 'uppercase'
    },
    termsSection: {
        backgroundColor: '#f9fafb',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20
    },
    termsHeader: {
        fontSize: 8,
        fontWeight: 'bold',
        marginBottom: 5,
        textTransform: 'uppercase'
    },
    termsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    termItem: {
        width: '50%',
        fontSize: 6.5,
        color: '#6b7280',
        marginBottom: 3,
        paddingRight: 10
    },
    footer: {
        marginTop: 'auto',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTop: 1,
        borderColor: '#f3f4f6',
        paddingTop: 10
    },
    footerText: {
        fontSize: 6.5,
        color: '#d1d5db',
        fontWeight: 'bold',
        textTransform: 'uppercase'
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
                            <Text style={[styles.companyDetails, { marginTop: 2 }]}>
                                Work: Street No. 14, Ghanshyam Nagar Soc., Opp. New Shaktivijay, L.H. Road, SURAT.
                            </Text>
                            <Text style={[styles.companyDetails, { marginTop: 2 }]}>
                                Email: sevaautosales@gmail.com  |  Web: sevaautosales.vercel.app
                            </Text>
                        </View>
                    </View>
                    <View style={styles.contactSection}>
                        <Text style={styles.contactText}>Mo. 99043 66000</Text>
                        <Text style={styles.contactText}>94271 00629</Text>
                        <Text style={styles.estLabel}>Est. 2005</Text>
                    </View>
                </View>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoCol}>
                        <Text style={styles.infoLabel}>Bill No.:</Text>
                        <Text style={styles.infoValue}>{data.invoice_number}</Text>
                        <Text style={[styles.infoLabel, { marginTop: 10 }]}>Customer Details:</Text>
                        <Text style={styles.infoValue}>{data.customer_name}</Text>
                        <Text style={[styles.infoLabel, { fontSize: 6, textTransform: 'none' }]}>Ph: {data.customer_phone}</Text>
                    </View>
                    <View style={[styles.infoCol, styles.infoColBorder]}>
                        <Text style={styles.infoLabel}>Date:</Text>
                        <Text style={styles.infoValue}>{formattedDate}</Text>
                        <Text style={[styles.infoLabel, { marginTop: 10 }]}>Billing Address:</Text>
                        <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{data.billing_address}</Text>
                        <Text style={{ fontSize: 9, fontWeight: 'bold' }}>{data.customer_address}</Text>
                    </View>
                </View>

                {/* Car Details */}
                <View style={styles.carDetails}>
                    <Text style={styles.carHeader}>VEHICLE DETAILS:-</Text>
                    <View style={styles.carGrid}>
                        <View style={{ width: '45%' }}>
                            <Text style={styles.carItem}>Vehicle Model : <Text style={styles.carBoldValue}>{data.car_model}</Text></Text>
                            <Text style={styles.carItem}>Reg no. : <Text style={styles.carBoldValue}>{data.reg_no}</Text></Text>
                        </View>
                        <View style={{ width: '45%' }}>
                            {data.engine_number && <Text style={styles.carItem}>Engine No. : <Text style={styles.carBoldValue}>{data.engine_number}</Text></Text>}
                            {data.chassis_number && <Text style={styles.carItem}>Chassis No. : <Text style={styles.carBoldValue}>{data.chassis_number}</Text></Text>}
                        </View>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.tableHeader}>
                    <Text style={styles.col1}>No.</Text>
                    <Text style={styles.col2}>Descriptions</Text>
                    <Text style={styles.col3}>Rate</Text>
                    <Text style={styles.col4}>Amount</Text>
                </View>

                {data.items.map((item: any, idx: number) => (
                    <View key={idx} style={styles.tableRow}>
                        <Text style={styles.col1}>{(idx + 1).toString().padStart(2, '0')}</Text>
                        <View style={styles.col2}>
                            <Text style={styles.itemTitle}>{item.description}</Text>
                            <Text style={styles.itemSub}>Quality modification with precision engineering</Text>
                        </View>
                        <Text style={styles.col3}>{formatCurrency(item.selling_price).replace('₹', '')}</Text>
                        <Text style={styles.col4}>{formatCurrency(item.amount).replace('₹', '')}</Text>
                    </View>
                ))}

                {/* Totals */}
                <View style={styles.totalsSection}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>{formatCurrency(data.total_amount)}</Text>
                    </View>
                    <Text style={styles.amountWordsHeader}>Amount in Words:</Text>
                    <Text style={styles.amountWords}>{amountInWords}</Text>
                </View>

                {/* Meta Row (Terms + Signature) */}
                <View style={[styles.metaRow, { alignItems: 'flex-end', marginBottom: 20 }]}>
                    <View style={styles.notesSection}>
                        {data.notes ? (
                            <View style={[styles.notesBox, { marginBottom: 10 }]}>
                                <Text style={[styles.infoLabel, { color: '#0EA5E9' }]}>Notes:</Text>
                                <Text style={{ fontSize: 8, fontWeight: 'bold', textTransform: 'uppercase', fontStyle: 'italic' }}>
                                    {data.notes}
                                </Text>
                            </View>
                        ) : null}

                        {/* Terms and Conditions inside meta */}
                        <View style={styles.termsSection}>
                            <Text style={styles.termsHeader}>Terms & Conditions:</Text>
                            <View style={{ gap: 3 }}>
                                <Text style={{ fontSize: 7.5, color: '#6b7280', fontWeight: 'bold' }}>1. Goods once sold will not taken back.</Text>
                                <Text style={{ fontSize: 7.5, color: '#6b7280', fontWeight: 'bold' }}>2. Damage while using not covered under warranty.</Text>
                                <Text style={{ fontSize: 7.5, color: '#6b7280', fontWeight: 'bold' }}>3. Product carries 1 YEAR Warranty.</Text>
                                <Text style={{ fontSize: 7.5, color: '#6b7280', fontWeight: 'bold' }}>4. Repaired/Alteration is at owner risk.</Text>
                            </View>
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
                    <Text style={styles.footerText}>Seva Auto Sales</Text>
                </View>
            </Page>
        </Document>
    );
};
