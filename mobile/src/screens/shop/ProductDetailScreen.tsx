import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProductById } from '../../api/products';
import Button from '../../components/Button';
import { useCart } from '../../hooks/useCart';

const ProductDetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { productId } = route.params;
    const { data: product, isLoading } = useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProductById(productId)
    });
    const { addToCart } = useCart();
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);

    if (isLoading || !product) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    const handleAddToCart = () => {
        // In a real app, we would select a specific variant based on size/color
        // For now, we'll just pick the first variant or error if none
        if (product.product_variants && product.product_variants.length > 0) {
            const variantId = product.product_variants[0].id;
            addToCart({ productId: product.id, variantId, quantity: 1 }, {
                onSuccess: () => {
                    Alert.alert('Success', 'Added to cart');
                },
                onError: () => {
                    Alert.alert('Error', 'Failed to add to cart');
                }
            });
        } else {
            Alert.alert('Error', 'No variants available');
        }
    };

    console.log("product---", product)

    return (
        <View style={styles.container}>
            <ScrollView>
                <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
                    {product.product_images && product.product_images.length > 0 ? (
                        product.product_images.map((img: any) => (
                            <Image key={img.id} source={{ uri: img.image_url }} style={styles.image} />
                        ))
                    ) : (
                        <Image source={{ uri: product.image_url || 'https://via.placeholder.com/400' }} style={styles.image} />
                    )}
                </ScrollView>

                <View style={styles.infoContainer}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.brand}>{product.brands?.name || 'Brand'}</Text>
                            <Text style={styles.title}>{product.name}</Text>
                        </View>
                        <Text style={styles.price}>${product.price}</Text>
                    </View>

                    <Text style={styles.description}>{product.description}</Text>

                    {/* Simple Variant Selector (if variants exist) */}
                    {product.product_variants && product.product_variants.length > 0 && (
                        <View style={styles.variantContainer}>
                            <Text style={styles.variantLabel}>Size: {product.product_variants[0].size}</Text>
                            <Text style={styles.variantLabel}>Color: {product.product_variants[0].color}</Text>
                        </View>
                    )}

                    <Button title="ADD TO CART" onPress={handleAddToCart} />
                </View>
            </ScrollView>
            {/* Header Back Button Overlay */}
            <SafeAreaView style={styles.headerOverlay}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{product.title}</Text>
            </SafeAreaView>
        </View>
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
    image: {
        width: Dimensions.get('window').width,
        height: 413,
    },
    infoContainer: {
        padding: 16,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    brand: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F6F6F6',
        marginBottom: 4,
    },
    title: {
        fontSize: 11,
        color: '#ABB4BD',
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    description: {
        fontSize: 14,
        color: '#F6F6F6',
        lineHeight: 21,
        marginBottom: 20,
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#F6F6F6',
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerTitle: {
        color: '#F6F6F6',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 16,
    },
    imageContainer: {
        height: 413,
        width: '100%',
    },
    variantContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 16,
    },
    variantLabel: {
        color: '#F6F6F6',
        fontSize: 16,
        backgroundColor: '#2A2C36',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
    }
});

export default ProductDetailScreen;
