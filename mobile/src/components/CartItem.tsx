import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface CartItemProps {
    item: any;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
    return (
        <View style={styles.container}>
            <Image source={{ uri: item.image_url || 'https://via.placeholder.com/104' }} style={styles.image} />
            <View style={styles.infoContainer}>
                <View style={styles.headerRow}>
                    <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                    <TouchableOpacity onPress={() => onRemove(item.id)}>
                        <Text style={styles.removeText}>X</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.variant}>Color: {item.color || 'N/A'}   Size: {item.size || 'N/A'}</Text>

                <View style={styles.footerRow}>
                    <View style={styles.quantityContainer}>
                        <TouchableOpacity onPress={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))} style={styles.qtyButton}>
                            <Text style={styles.qtyButtonText}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.quantity}>{item.quantity}</Text>
                        <TouchableOpacity onPress={() => onUpdateQuantity(item.id, item.quantity + 1)} style={styles.qtyButton}>
                            <Text style={styles.qtyButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.price}>${item.price * item.quantity}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#2A2C36',
        borderRadius: 8,
        marginBottom: 24,
        overflow: 'hidden',
    },
    image: {
        width: 104,
        height: 104,
    },
    infoContainer: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    title: {
        color: '#F6F6F6',
        fontSize: 16,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 8,
    },
    removeText: {
        color: '#ABB4BD',
        fontSize: 14,
    },
    variant: {
        color: '#ABB4BD',
        fontSize: 11,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    qtyButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1E1F28',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    qtyButtonText: {
        color: '#ABB4BD',
        fontSize: 20,
    },
    quantity: {
        color: '#F6F6F6',
        fontSize: 14,
        marginHorizontal: 12,
    },
    price: {
        color: '#F6F6F6',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default CartItem;
