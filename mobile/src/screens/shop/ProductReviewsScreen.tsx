import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getProductReviews } from '../../api/products';
import { format } from 'date-fns';

const ProductReviewsScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { productId } = route.params;

    const { data: reviews, isLoading } = useQuery({
        queryKey: ['reviews', productId],
        queryFn: () => getProductReviews(productId)
    });

    const renderReviewItem = ({ item }: { item: any }) => (
        <View style={styles.reviewItem}>
            <View style={styles.reviewHeader}>
                <Image
                    source={{ uri: item.user?.avatar_url || 'https://via.placeholder.com/40' }}
                    style={styles.avatar}
                />
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.user?.full_name || 'Anonymous'}</Text>
                    <View style={styles.ratingRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name={star <= item.rating ? "star" : "star-outline"}
                                size={14}
                                color="#FFBA49"
                            />
                        ))}
                    </View>
                </View>
                <Text style={styles.date}>{item.created_at ? format(new Date(item.created_at), 'MMM dd, yyyy') : ''}</Text>
            </View>
            <Text style={styles.reviewText}>{item.comment}</Text>
            {item.images && item.images.length > 0 && (
                <View style={styles.reviewImages}>
                    {item.images.map((img: string, index: number) => (
                        <Image key={index} source={{ uri: img }} style={styles.reviewImage} />
                    ))}
                </View>
            )}
            <TouchableOpacity style={styles.helpfulButton}>
                <Text style={styles.helpfulText}>Helpful</Text>
                <Ionicons name="thumbs-up-outline" size={14} color="#ABB4BD" />
            </TouchableOpacity>
        </View>
    );

    const averageRating = reviews?.reduce((acc: number, curr: any) => acc + curr.rating, 0) / (reviews?.length || 1);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#F6F6F6" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Rating&Reviews</Text>
            </View>

            <View style={styles.summaryContainer}>
                <View>
                    <Text style={styles.averageRating}>{averageRating ? averageRating.toFixed(1) : '0.0'}</Text>
                    <Text style={styles.ratingCount}>{reviews?.length || 0} ratings</Text>
                </View>
                <View style={styles.starsContainer}>
                    {/* Placeholder for star distribution bars if needed, for now just stars */}
                    <View style={{ flexDirection: 'row' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                                key={star}
                                name={star <= Math.round(averageRating || 0) ? "star" : "star-outline"}
                                size={20}
                                color="#FFBA49"
                            />
                        ))}
                    </View>
                </View>
            </View>

            <FlatList
                data={reviews}
                renderItem={renderReviewItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No reviews yet</Text>
                    </View>
                }
            />

            <TouchableOpacity style={styles.writeReviewButton}>
                <Ionicons name="pencil" size={20} color="#F6F6F6" />
                <Text style={styles.writeReviewText}>Write a review</Text>
            </TouchableOpacity>
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
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2C36',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
    },
    averageRating: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    ratingCount: {
        fontSize: 14,
        color: '#ABB4BD',
    },
    starsContainer: {
        alignItems: 'flex-end',
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    reviewItem: {
        backgroundColor: '#2A2C36', // Or transparent with border? Design usually has cards or list items
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        position: 'relative',
    },
    reviewHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    userName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#F6F6F6',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
    },
    date: {
        fontSize: 12,
        color: '#ABB4BD',
    },
    reviewText: {
        fontSize: 14,
        color: '#F6F6F6',
        lineHeight: 21,
        marginBottom: 12,
    },
    reviewImages: {
        flexDirection: 'row',
        marginBottom: 12,
        gap: 8,
    },
    reviewImage: {
        width: 80,
        height: 80,
        borderRadius: 4,
    },
    helpfulButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
    },
    helpfulText: {
        fontSize: 12,
        color: '#ABB4BD',
        marginRight: 4,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#ABB4BD',
        fontSize: 16,
    },
    writeReviewButton: {
        position: 'absolute',
        bottom: 24,
        right: 16,
        backgroundColor: '#EF3651',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    writeReviewText: {
        color: '#F6F6F6',
        fontWeight: 'bold',
        marginLeft: 8,
    }
});

export default ProductReviewsScreen;
