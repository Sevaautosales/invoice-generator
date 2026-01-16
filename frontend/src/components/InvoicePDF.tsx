import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 60,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#000000',
        backgroundColor: '#FFFFFF',
    },
    header: {
        backgroundColor: '#000000',
        padding: 40,
        margin: -60,
        marginBottom: 40,
        color: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    brandSection: {
        flexDirection: 'column',
    },
    brandLine: {
        height: 4,
        width: 30,
        backgroundColor: '#FFFFFF',
        marginBottom: 8,
        borderRadius: 2,
    },
    companyName: {
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: -1,
    },
    companyDetail: {
        fontSize: 8,
        color: '#999999',
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    invoiceMeta: {
        textAlign: 'right',
    },
    metaLabel: {
        fontSize: 8,
        color: '#666666',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    metaValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    contentArea: {
        marginTop: 40,
    },
    grid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 60,
    },
    gridCol: {
        width: '45%',
    },
    sectionHeading: {
        fontSize: 8,
        color: '#CCCCCC',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 12,
        borderBottom: '1pt solid #F0F0F0',
        paddingBottom: 4,
    },
    customerName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    customerDetail: {
        fontSize: 9,
        color: '#666666',
        lineHeight: 1.5,
    },
    vehicleName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    specRow: {
        marginBottom: 8,
    },
    specLabel: {
        fontSize: 7,
        color: '#999999',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 2,
    },
    specValue: {
        fontSize: 9,
        backgroundColor: '#F9F9F9',
        padding: 6,
        borderRadius: 4,
    },
    table: {
        marginTop: 20,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '3pt solid #000000',
        paddingBottom: 10,
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1pt solid #EEEEEE',
        paddingVertical: 15,
    },
    colDesc: { flex: 4 },
    colAmount: { flex: 2, textAlign: 'right' },
    tableHeaderLabel: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    descTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    descSub: {
        fontSize: 8,
        color: '#999999',
        marginTop: 2,
    },
    amountText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    summarySection: {
        marginTop: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    summaryContainer: {
        width: 220,
    },
    totalRow: {
        marginTop: 20,
        paddingTop: 15,
        borderTop: '2pt solid #000000',
    },
    totalLabel: {
        fontSize: 8,
        color: '#999999',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    totalValue: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: -1,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    paymentLabel: {
        fontSize: 7,
        color: '#999999',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    paymentValue: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    balanceDue: {
        color: '#D00000',
    },
    footer: {
        position: 'absolute',
        bottom: 60,
        left: 60,
        right: 60,
        borderTop: '1pt solid #EEEEEE',
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerLeft: {
        fontSize: 8,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    footerRight: {
        fontSize: 7,
        color: '#CCCCCC',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});

interface InvoicePDFProps {
    data: {
        invoice_number: string;
        created_at: string;
        customer_name: string;
        customer_phone: string;
        customer_address?: string;
        vehicle_model: string;
        engine_number: string;
        chassis_number: string;
        vehicle_price: number;
        other_charges: number;
        total_amount: number;
        amount_paid: number;
        balance_due: number;
    };
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(amount);
};

export const InvoicePDF = ({ data }: InvoicePDFProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Dark Header */}
            <View style={styles.header}>
                <View style={styles.brandSection}>
                    <View style={styles.brandLine} />
                    <Text style={styles.companyName}>SEVA AUTO SALES</Text>
                    <Text style={[styles.companyDetail, { color: '#AAAAAA' }]}>123 Dealer Row, Auto City, ST 12345</Text>
                    <Text style={[styles.companyDetail, { color: '#AAAAAA' }]}>PH: +91 00000 00000</Text>
                </View>
                <View style={styles.invoiceMeta}>
                    <Text style={styles.metaLabel}>Invoice No</Text>
                    <Text style={styles.metaValue}>{data.invoice_number}</Text>
                    <Text style={styles.metaLabel}>Date Issued</Text>
                    <Text style={[styles.metaValue, { fontSize: 11, marginBottom: 0 }]}>{data.created_at}</Text>
                </View>
            </View>

            <View style={styles.contentArea}>
                {/* Client & Vehicle Row */}
                <View style={styles.grid}>
                    <View style={styles.gridCol}>
                        <Text style={styles.sectionHeading}>Bill To</Text>
                        <Text style={styles.customerName}>{data.customer_name}</Text>
                        <Text style={styles.customerDetail}>{data.customer_phone}</Text>
                        {data.customer_address && (
                            <Text style={[styles.customerDetail, { marginTop: 4 }]}>{data.customer_address}</Text>
                        )}
                    </View>
                    <View style={styles.gridCol}>
                        <Text style={styles.sectionHeading}>Vehicle Specifications</Text>
                        <Text style={styles.vehicleName}>{data.vehicle_model}</Text>
                        <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Engine Number</Text>
                            <Text style={styles.specValue}>{data.engine_number}</Text>
                        </View>
                        <View style={styles.specRow}>
                            <Text style={styles.specLabel}>Chassis Number</Text>
                            <Text style={styles.specValue}>{data.chassis_number}</Text>
                        </View>
                    </View>
                </View>

                {/* Table */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderLabel, styles.colDesc]}>Description</Text>
                        <Text style={[styles.tableHeaderLabel, styles.colAmount]}>Total Amount</Text>
                    </View>

                    <View style={styles.tableRow}>
                        <View style={styles.colDesc}>
                            <Text style={styles.descTitle}>Vehicle Purchase Price</Text>
                            <Text style={styles.descSub}>Standard unit base cost for model listed above</Text>
                        </View>
                        <Text style={[styles.colAmount, styles.amountText]}>
                            {formatCurrency(data.vehicle_price)}
                        </Text>
                    </View>

                    {data.other_charges > 0 && (
                        <View style={styles.tableRow}>
                            <View style={styles.colDesc}>
                                <Text style={[styles.descTitle, { fontSize: 9 }]}>Service & Other Charges</Text>
                            </View>
                            <Text style={[styles.colAmount, styles.amountText, { fontSize: 9 }]}>
                                {formatCurrency(data.other_charges)}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Summary */}
                <View style={styles.summarySection}>
                    <View style={styles.summaryContainer}>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Amount Paid</Text>
                            <Text style={styles.paymentValue}>{formatCurrency(data.amount_paid)}</Text>
                        </View>
                        <View style={styles.paymentRow}>
                            <Text style={styles.paymentLabel}>Balance Remaining</Text>
                            <Text style={[styles.paymentValue, data.balance_due > 0 ? styles.balanceDue : {}]}>
                                {formatCurrency(data.balance_due)}
                            </Text>
                        </View>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Amount Due</Text>
                            <Text style={styles.totalValue}>{formatCurrency(data.total_amount)}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerLeft}>Seva Auto Sales</Text>
                <Text style={styles.footerRight}>Computer Generated Record - Official Receipt</Text>
            </View>
        </Page>
    </Document>
);
