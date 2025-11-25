import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCategories } from '../../api/categories';
import { getProducts } from '../../api/products';
import ProductCard from '../../components/ProductCard';

const HomeScreen = () => {
    const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
    const { data: productsData } = useQuery({
        queryKey: ['products', 'newest'],
        queryFn: () => getProducts({ sort_by: 'newest', limit: 10 })
    });

    const products = productsData?.data || [];

    const renderHeader = () => (
        <View>
            <View style={styles.heroContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80' }}
                    style={styles.heroImage}
                />
                <View style={styles.heroOverlay}>
                    <Text style={styles.heroTitle}>Fashion Sale</Text>
                    <TouchableOpacity style={styles.heroButton}>
                        <Text style={styles.heroButtonText}>Check</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New</Text>
                <Text style={styles.sectionLink}>View all</Text>
            </View>
            <Text style={styles.sectionSubtitle}>You've never seen it before!</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProductCard product={item} />}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F28',
    },
    contentContainer: {
        paddingBottom: 20,
    },
    heroContainer: {
        height: 500, // Big hero image as per design
        marginBottom: 30,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        position: 'absolute',
        bottom: 30,
        left: 16,
    },
    heroTitle: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 16,
        width: 200,
    },
    heroButton: {
        backgroundColor: '#EF3651',
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignSelf: 'flex-start',
    },
    heroButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
        textTransform: 'uppercase',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 4,
    },
    sectionTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    sectionLink: {
        fontSize: 11,
        color: '#F6F6F6',
    },
    sectionSubtitle: {
        fontSize: 11,
        color: '#ABB4BD',
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
});

export default HomeScreen;
