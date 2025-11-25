import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Button from '../../components/Button';

const OrderDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { orderId } = route.params as { orderId: string } || { orderId: '1947034' };

    // Mock data
    const order = {
        id: orderId,
        date: '05-12-2019',
        trackingNumber: 'IW3475453455',
        status: 'Delivered',
        items: [
            {
                id: '1',
                name: 'Pullover',
                brand: 'Mango',
                color: 'Gray',
                size: 'L',
                price: 51,
                units: 1,
                image: 'https://i.pravatar.cc/150?img=1', // Placeholder
            },
            {
                id: '2',
                name: 'Sport Dress',
                brand: 'Dorothy Perkins',
                color: 'Black',
                size: 'M',
                price: 22,
                units: 1,
                image: 'https://i.pravatar.cc/150?img=2', // Placeholder
            },
            {
                id: '3',
                name: 'Sport Dress',
                brand: 'Dorothy Perkins',
                color: 'Black',
                size: 'S',
                price: 22,
                units: 1,
                image: 'https://i.pravatar.cc/150?img=3', // Placeholder
            },
        ],
        shippingAddress: '3 Newbridge Court, Chino Hills, CA 91709, United States',
        paymentMethod: '**** **** **** 3947',
        deliveryMethod: 'FedEx, 3 days, 15$',
        discount: 10,
        totalAmount: 133,
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="chevron-left" size={28} color="#F6F6F6" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Details</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.topInfo}>
                    <View style={styles.row}>
                        <Text style={styles.orderId}>Order №{order.id}</Text>
                        <Text style={styles.date}>{order.date}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Tracking number: <Text style={styles.value}>{order.trackingNumber}</Text></Text>
                        <Text style={styles.statusDelivered}>{order.status}</Text>
                    </View>
                    <Text style={styles.itemsCount}>{order.items.length} items</Text>
                </View>

                {order.items.map(item => (
                    <View key={item.id} style={styles.itemCard}>
                        <Image source={{ uri: item.image }} style={styles.itemImage} />
                        <View style={styles.itemInfo}>
                            <Text style={styles.itemTitle}>{item.name}</Text>
                            <Text style={styles.itemBrand}>{item.brand}</Text>
                            <View style={styles.itemDetailsRow}>
                                <Text style={styles.itemDetail}>Color: <Text style={styles.itemDetailValue}>{item.color}</Text></Text>
                                <Text style={[styles.itemDetail, { marginLeft: 10 }]}>Size: <Text style={styles.itemDetailValue}>{item.size}</Text></Text>
                            </View>
                            <View style={styles.itemFooter}>
                                <Text style={styles.itemUnits}>Units: {item.units}</Text>
                                <Text style={styles.itemPrice}>{item.price}$</Text>
                            </View>
                        </View>
                    </View>
                ))}

                <Text style={styles.sectionTitle}>Order information</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Shipping Address:</Text>
                    <Text style={styles.infoValue}>{order.shippingAddress}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Payment method:</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {/* Icon placeholder */}
                        <Image source={require('../../assets/images/mastercard.png')} style={{ width: 32, height: 20, marginRight: 10 }} resizeMode="contain" />
                        <Text style={styles.infoValue}>{order.paymentMethod}</Text>
                    </View>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Delivery method:</Text>
                    <Text style={styles.infoValue}>{order.deliveryMethod}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Discount:</Text>
                    <Text style={styles.infoValue}>{order.discount}%, Personal promo code</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Total Amount:</Text>
                    <Text style={styles.infoValue}>{order.totalAmount}$</Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <Button title="Reorder" variant="outline" onPress={() => { }} />
                    <View style={{ height: 16 }} />
                    <Button title="Leave feedback" onPress={() => { }} />
                </View>
            </ScrollView>
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
        backgroundColor: '#1E1F28',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    content: {
        padding: 16,
        paddingBottom: 30,
    },
    topInfo: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        alignItems: 'center',
    },
    orderId: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    date: {
        fontSize: 14,
        color: '#ABB4BD',
    },
    label: {
        fontSize: 14,
        color: '#ABB4BD',
    },
    value: {
        color: '#F6F6F6',
        fontWeight: '500',
    },
    statusDelivered: {
        color: '#55D85A',
        fontSize: 14,
        fontWeight: '500',
    },
    itemsCount: {
        fontSize: 14,
        color: '#F6F6F6',
        marginTop: 8,
        fontWeight: '500',
    },
    itemCard: {
        flexDirection: 'row',
        backgroundColor: '#2A2C36',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    itemImage: {
        width: 104,
        height: 104,
    },
    itemInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F6F6F6',
        marginBottom: 4,
    },
    itemBrand: {
        fontSize: 11,
        color: '#ABB4BD',
        marginBottom: 4,
    },
    itemDetailsRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    itemDetail: {
        fontSize: 11,
        color: '#ABB4BD',
    },
    itemDetailValue: {
        color: '#F6F6F6',
    },
    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemUnits: {
        fontSize: 11,
        color: '#ABB4BD',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#F6F6F6',
        marginTop: 10,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    infoLabel: {
        width: 120,
        fontSize: 14,
        color: '#ABB4BD',
    },
    infoValue: {
        flex: 1,
        fontSize: 14,
        color: '#F6F6F6',
        fontWeight: '500',
    },
    buttonsContainer: {
        marginTop: 20,
    },
});

export default OrderDetailScreen;
