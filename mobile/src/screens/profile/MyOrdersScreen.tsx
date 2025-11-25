import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

// Mock data for orders
const ORDERS = [
    {
        id: '1947034',
        trackingNumber: 'IW3475453455',
        quantity: 3,
        totalAmount: 112,
        date: '05-12-2019',
        status: 'Delivered',
    },
    {
        id: '1947035',
        trackingNumber: 'IW3475453456',
        quantity: 2,
        totalAmount: 90,
        date: '06-12-2019',
        status: 'Processing',
    },
    {
        id: '1947036',
        trackingNumber: 'IW3475453457',
        quantity: 1,
        totalAmount: 45,
        date: '07-12-2019',
        status: 'Cancelled',
    },
];

const TABS = ['Delivered', 'Processing', 'Cancelled'];

const MyOrdersScreen = () => {
    const navigation = useNavigation<any>();
    const [activeTab, setActiveTab] = useState('Delivered');

    const filteredOrders = ORDERS.filter(order => order.status === activeTab);

    const renderOrderItem = ({ item }: { item: typeof ORDERS[0] }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order №{item.id}</Text>
                <Text style={styles.orderDate}>{item.date}</Text>
            </View>
            <View style={styles.orderInfoRow}>
                <Text style={styles.label}>Tracking number:</Text>
                <Text style={styles.value}>{item.trackingNumber}</Text>
            </View>
            <View style={styles.orderInfoRow}>
                <View style={styles.quantityContainer}>
                    <Text style={styles.label}>Quantity: </Text>
                    <Text style={styles.value}>{item.quantity}</Text>
                </View>
                <View style={styles.totalContainer}>
                    <Text style={styles.label}>Total Amount: </Text>
                    <Text style={styles.totalValue}>{item.totalAmount}$</Text>
                </View>
            </View>
            <View style={styles.orderFooter}>
                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigation.navigate('OrderDetail', { orderId: item.id })}
                >
                    <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                <Text style={[styles.status,
                item.status === 'Delivered' ? styles.statusDelivered :
                    item.status === 'Processing' ? styles.statusProcessing :
                        styles.statusCancelled
                ]}>
                    {item.status}
                </Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="chevron-left" size={28} color="#F6F6F6" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.tabsContainer}>
                {TABS.map(tab => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No orders found</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F28',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 16,
        marginBottom: 20,
        marginTop: 10,
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    activeTab: {
        backgroundColor: '#F6F6F6',
    },
    tabText: {
        color: '#F6F6F6',
        fontSize: 14,
        fontWeight: '500',
    },
    activeTabText: {
        color: '#1E1F28',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    orderCard: {
        backgroundColor: '#2A2C36',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
    },
    orderNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    orderDate: {
        fontSize: 14,
        color: '#ABB4BD',
    },
    orderInfoRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        marginRight: 20,
    },
    totalContainer: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 14,
        color: '#ABB4BD',
        marginRight: 4,
    },
    value: {
        fontSize: 14,
        color: '#F6F6F6',
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 14,
        color: '#F6F6F6',
        fontWeight: 'bold',
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    detailsButton: {
        borderWidth: 1,
        borderColor: '#F6F6F6',
        borderRadius: 24,
        paddingVertical: 8,
        paddingHorizontal: 24,
    },
    detailsButtonText: {
        color: '#F6F6F6',
        fontSize: 14,
        fontWeight: '500',
    },
    status: {
        fontSize: 14,
        fontWeight: '500',
    },
    statusDelivered: {
        color: '#55D85A',
    },
    statusProcessing: {
        color: '#E0E0E0', // Or yellow
    },
    statusCancelled: {
        color: '#FF2424',
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#ABB4BD',
        fontSize: 16,
    },
});

export default MyOrdersScreen;
