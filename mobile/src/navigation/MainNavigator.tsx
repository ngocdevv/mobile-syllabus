import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/home/HomeScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import BagScreen from '../screens/bag/BagScreen';
import ShopScreen from '../screens/shop/ShopScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { HomeIcon, ShopIcon, BagIcon, ProfileIcon } from '../components/TabBarIcons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </Stack.Navigator>
    );
};

import CatalogScreen from '../screens/shop/CatalogScreen';

const ShopStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ShopMain" component={ShopScreen} />
            <Stack.Screen name="Catalog" component={CatalogScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        </Stack.Navigator>
    );
};

const MainNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#1E1F28',
                    borderTopColor: '#1E1F28',
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom + 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#EF3651',
                tabBarInactiveTintColor: '#ABB4BD',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeStack}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <HomeIcon focused={focused} color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Shop"
                component={ShopStack}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <ShopIcon focused={focused} color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Bag"
                component={BagScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <BagIcon focused={focused} color={color} size={24} />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <ProfileIcon focused={focused} color={color} size={24} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;
