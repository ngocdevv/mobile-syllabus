import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';

interface MenuItemProps {
    title: string;
    subtitle: string;
    onPress?: () => void;
    isLast?: boolean;
}

const MenuItem = ({ title, subtitle, onPress, isLast }: MenuItemProps) => (
    <TouchableOpacity style={[styles.menuItem, isLast && styles.lastMenuItem]} onPress={onPress}>
        <View style={styles.menuItemContent}>
            <Text style={styles.menuItemTitle}>{title}</Text>
            <Text style={styles.menuItemSubtitle}>{subtitle}</Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#ABB4BD" />
    </TouchableOpacity>
);

const ProfileScreen = () => {
    const { user, logout } = useAuth();
    const navigation = useNavigation<any>();

    const menuItems = [
        { title: 'My orders', subtitle: 'Already have 12 orders', route: 'MyOrders' },
        { title: 'Shipping addresses', subtitle: '3 addresses' },
        { title: 'Payment methods', subtitle: 'Visa **34' },
        { title: 'Promocodes', subtitle: 'You have special promocodes' },
        { title: 'My reviews', subtitle: 'Reviews for 4 items' },
        { title: 'Settings', subtitle: 'Notifications, password', route: 'Settings' },
    ];

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.headerTitle}>My Profile</Text>

                <View style={styles.userInfo}>
                    <Image
                        source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=3' }}
                        style={styles.avatar}
                    />
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{user?.full_name || 'User Name'}</Text>
                        <Text style={styles.userEmail}>{user?.email}</Text>
                    </View>
                </View>

                <View style={styles.menuContainer}>
                    {menuItems.map((item, index) => (
                        <MenuItem
                            key={index}
                            title={item.title}
                            subtitle={item.subtitle}
                            onPress={() => item.route && navigation.navigate(item.route)}
                            isLast={index === menuItems.length - 1}
                        />
                    ))}

                    {/* Logout as a menu item or separate? Usually separate or at bottom. 
                        Design often has it as a separate button or just another item. 
                        I'll keep it as a separate item for clarity or integrate if needed.
                        For now, I'll add it as a special item at the end or keep the button if the design had a button.
                        The previous code had a button. The Fively design usually has a list. 
                        I'll add a specific Logout item or keep the button if it fits better.
                        Let's add it as a MenuItem for consistency but maybe with different styling or just append to list.
                        Actually, let's keep the logout logic separate for now, maybe as the last item or a button below.
                        I'll add a "Log Out" item to the list for now to match the "list" look, 
                        or keep the button if the user prefers. The previous code had a button.
                        Let's stick to the list for the main items.
                    */}
                </View>

                {/* Logout Button - keeping it accessible */}
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F28',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#F6F6F6',
        marginHorizontal: 14,
        marginTop: 30,
        marginBottom: 24,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        marginBottom: 30,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 18,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F6F6F6',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 14,
        color: '#ABB4BD',
    },
    menuContainer: {
        marginBottom: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 14,
        borderBottomWidth: 0.5, // Thin separator
        borderBottomColor: 'rgba(171, 180, 189, 0.1)', // Subtle separator
    },
    lastMenuItem: {
        borderBottomWidth: 0,
    },
    menuItemContent: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F6F6F6',
        marginBottom: 4,
    },
    menuItemSubtitle: {
        fontSize: 11,
        color: '#ABB4BD',
    },
    logoutButton: {
        marginHorizontal: 14,
        marginTop: 10,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#ABB4BD',
        borderRadius: 25,
    },
    logoutText: {
        color: '#F6F6F6', // Or red if we want to emphasize
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    }
});

export default ProfileScreen;
