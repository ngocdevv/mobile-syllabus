import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../api/categories';

const ShopScreen = () => {
    const navigation = useNavigation<any>();
    const { data: categories, isLoading } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

    if (isLoading) {
        return <View style={styles.center}><Text style={styles.text}>Loading...</Text></View>;
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Text style={styles.headerTitle}>Categories</Text>

            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.categoryItem}
                        onPress={() => navigation.navigate('Catalog', { categoryId: item.id, categoryName: item.name })}
                    >
                        <Text style={styles.categoryName}>{item.name}</Text>
                        {item.image_url && <Image source={{ uri: item.image_url }} style={styles.categoryImage} />}
                    </TouchableOpacity>
                )}
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F6F6F6',
        textAlign: 'center',
        marginVertical: 16,
    },
    listContent: {
        paddingHorizontal: 16,
    },
    categoryItem: {
        backgroundColor: '#2A2C36',
        borderRadius: 8,
        marginBottom: 16,
        height: 100,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        overflow: 'hidden',
    },
    categoryName: {
        color: '#F6F6F6',
        fontSize: 18,
        fontWeight: 'bold',
    },
    categoryImage: {
        width: '50%',
        height: '100%',
        position: 'absolute',
        right: 0,
    }
});

export default ShopScreen;
