import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface Product {
    id: string;
    title: string;
    price: number;
    main_image_url: string;
    brand: string;
    rating: number;
    review_count: number;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigation = useNavigation<any>();

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
        >
            <View style={styles.imageContainer}>
                <Image source={{ uri: product.main_image_url }} style={styles.image} />
                {/* Discount badge could go here */}
            </View>
            <View style={styles.infoContainer}>
                <View style={styles.ratingContainer}>
                    {/* Stars could go here */}
                    <Text style={styles.ratingText}>({product.review_count})</Text>
                </View>
                <Text style={styles.brand}>{product.brand}</Text>
                <Text style={styles.title} numberOfLines={1}>{product.title}</Text>
                <Text style={styles.price}>${product.price}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 150,
        marginRight: 16,
        marginBottom: 24,
    },
    imageContainer: {
        width: 150,
        height: 184,
        borderRadius: 8,
        overflow: 'hidden',
        marginBottom: 8,
        backgroundColor: '#2A2C36',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        paddingHorizontal: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    ratingText: {
        color: '#ABB4BD',
        fontSize: 10,
    },
    brand: {
        color: '#ABB4BD',
        fontSize: 11,
        marginBottom: 4,
    },
    title: {
        color: '#F6F6F6',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    price: {
        color: '#F6F6F6',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default ProductCard;
