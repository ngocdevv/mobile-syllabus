import React, { useState, useRef, useMemo } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProductById } from '../../api/products';
import Button from '../../components/Button';
import { useCart } from '../../hooks/useCart';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import SelectionBottomSheet from '../../components/SelectionBottomSheet';

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
    const [isFavorite, setIsFavorite] = useState(false);

    const sizeSheetRef = useRef<BottomSheetModal>(null);
    const colorSheetRef = useRef<BottomSheetModal>(null);

    const sizes = useMemo(() => {
        if (!product?.product_variants) return [];
        return Array.from(new Set(product.product_variants.map((v: any) => v.size))).filter(Boolean) as string[];
    }, [product]);

    const colors = useMemo(() => {
        if (!product?.product_variants) return [];
        return Array.from(new Set(product.product_variants.map((v: any) => v.color))).filter(Boolean) as string[];
    }, [product]);

    if (isLoading || !product) {
        return (
            <View style={styles.center}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            Alert.alert('Please select size and color');
            return;
        }

        const variant = product.product_variants?.find(
            (v: any) => v.size === selectedSize && v.color === selectedColor
        );

        if (variant) {
            addToCart({ productId: product.id, variantId: variant.id, quantity: 1 }, {
                onSuccess: () => {
                    Alert.alert('Success', 'Added to cart');
                },
                onError: () => {
                    Alert.alert('Error', 'Failed to add to cart');
                }
            });
        } else {
            Alert.alert('Error', 'Variant not available');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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
                    <View style={styles.selectorsRow}>
                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => sizeSheetRef.current?.present()}
                        >
                            <Text style={styles.selectorLabel}>{selectedSize || 'Size'}</Text>
                            <Ionicons name="chevron-down" size={20} color="#F6F6F6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.selectorButton}
                            onPress={() => colorSheetRef.current?.present()}
                        >
                            <Text style={styles.selectorLabel}>{selectedColor || 'Color'}</Text>
                            <Ionicons name="chevron-down" size={20} color="#F6F6F6" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.favoriteButton}
                            onPress={() => setIsFavorite(!isFavorite)}
                        >
                            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#EF3651" : "#F6F6F6"} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.brand}>{product.brands?.name || 'Brand'}</Text>
                            <Text style={styles.title}>{product.name}</Text>
                            <View style={styles.ratingContainer}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Ionicons key={star} name="star" size={14} color="#FFBA49" />
                                ))}
                                <Text style={styles.ratingCount}>(10)</Text>
                            </View>
                        </View>
                        <Text style={styles.price}>${product.price}</Text>
                    </View>

                    <Text style={styles.description}>{product.description}</Text>

                    <View style={styles.addToCartContainer}>
                        <Button title="ADD TO CART" onPress={handleAddToCart} />
                    </View>
                </View>
            </ScrollView>

            <SafeAreaView style={styles.headerOverlay}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#F6F6F6" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{product.name}</Text>
                <TouchableOpacity style={styles.shareButton}>
                    <Ionicons name="share-social" size={24} color="#F6F6F6" />
                </TouchableOpacity>
            </SafeAreaView>

            <SelectionBottomSheet
                bottomSheetRef={sizeSheetRef}
                title="Select Size"
                options={sizes}
                selectedOption={selectedSize}
                onSelect={setSelectedSize}
            />

            <SelectionBottomSheet
                bottomSheetRef={colorSheetRef}
                title="Select Color"
                options={colors}
                selectedOption={selectedColor}
                onSelect={setSelectedColor}
            />
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
    imageContainer: {
        height: 413,
        width: '100%',
    },
    image: {
        width: Dimensions.get('window').width,
        height: 413,
    },
    infoContainer: {
        padding: 16,
    },
    selectorsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    selectorButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#ABB4BD',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        width: '35%',
        height: 40,
    },
    selectorLabel: {
        color: '#F6F6F6',
        fontSize: 14,
    },
    favoriteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2A2C36',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
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
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingCount: {
        color: '#ABB4BD',
        fontSize: 10,
        marginLeft: 4,
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
    addToCartContainer: {
        marginTop: 10,
        marginBottom: 20,
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#F6F6F6',
        fontSize: 18,
        fontWeight: 'bold',
    },
    shareButton: {
        padding: 8,
    }
});

export default ProductDetailScreen;
