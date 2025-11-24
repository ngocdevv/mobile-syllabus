import React from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../../hooks/useCart';
import CartItem from '../../components/CartItem';
import Button from '../../components/Button';
import client from '../../api/client';

const BagScreen = () => {
    const { cartItems, isLoading, updateCartItem, removeFromCart } = useCart();

    const totalAmount = cartItems?.reduce((sum: number, item: any) => {
        return sum + (item.product_variants.products.price * item.quantity);
    }, 0) || 0;

    const handleCheckout = async () => {
        try {
            await client.post('/orders');
            Alert.alert('Success', 'Order placed successfully!');
            // Invalidate cart query handled by mutation in useCart? 
            // Actually createOrder clears cart on backend, so we should invalidate cart query.
            // But createOrder is not in useCart hook yet. 
            // For now, just alert. Ideally we should have a checkout mutation.
        } catch (error) {
            Alert.alert('Error', 'Failed to place order');
        }
    };

    if (isLoading) {
        return <View style={styles.center}><Text style={styles.text}>Loading...</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Text style={styles.headerTitle}>My Bag</Text>

            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <CartItem
                        item={item}
                        onUpdateQuantity={(id, qty) => updateCartItem({ itemId: id, quantity: qty })}
                        onRemove={(id) => removeFromCart(id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>Your bag is empty</Text>}
            />

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total amount:</Text>
                    <Text style={styles.totalValue}>${totalAmount}</Text>
                </View>
                <Button title="CHECK OUT" onPress={handleCheckout} disabled={!cartItems || cartItems.length === 0} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F28',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1E1F28',
    },
    text: {
        color: '#F6F6F6',
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#F6F6F6',
        marginHorizontal: 16,
        marginTop: 30,
        marginBottom: 24,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    emptyText: {
        color: '#ABB4BD',
        textAlign: 'center',
        marginTop: 40,
    },
    footer: {
        padding: 16,
        backgroundColor: '#1E1F28',
        borderTopWidth: 1,
        borderTopColor: '#2A2C36',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    totalLabel: {
        color: '#ABB4BD',
        fontSize: 14,
    },
    totalValue: {
        color: '#F6F6F6',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BagScreen;
