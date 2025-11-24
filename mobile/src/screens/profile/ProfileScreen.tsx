import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';

const ProfileScreen = () => {
    const { user, logout } = useAuth();

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Text style={styles.headerTitle}>My Profile</Text>

            <View style={styles.userInfo}>
                <Image
                    source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?img=3' }}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.userName}>{user?.full_name || 'User Name'}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>
            </View>

            <View style={styles.menu}>
                <Button title="LOG OUT" onPress={logout} variant="outline" />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F28',
    },
    headerTitle: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#F6F6F6',
        marginHorizontal: 16,
        marginTop: 30,
        marginBottom: 24,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 30,
    },
    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 16,
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
    menu: {
        paddingHorizontal: 16,
    }
});

export default ProfileScreen;
