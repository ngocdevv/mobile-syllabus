import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import { getProducts } from '../../api/products';
import ProductCard from '../../components/ProductCard';

const CatalogScreen = () => {
    const route = useRoute<any>();
    const { categoryId, categoryName } = route.params || {};

    const { data: productsData, isLoading } = useQuery({
        queryKey: ['products', categoryId],
        queryFn: () => getProducts({ category_id: categoryId })
    });

    const products = productsData?.data || [];

    if (isLoading) {
        return <View style={styles.center}><Text style={styles.text}>Loading...</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Text style={styles.headerTitle}>{categoryName || 'Products'}</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProductCard product={item} />}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContent}
            />
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
        marginTop: 10,
        marginBottom: 20,
    },
    listContent: {
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    }
});

export default CatalogScreen;
