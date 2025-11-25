import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Input from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';

const SettingsScreen = () => {
    const navigation = useNavigation();
    const { user } = useAuth();

    const [fullName, setFullName] = useState(user?.full_name || 'User Name');
    const [dob, setDob] = useState('12/12/1989');
    const [password, setPassword] = useState('password');

    const [salesNotification, setSalesNotification] = useState(true);
    const [newArrivalsNotification, setNewArrivalsNotification] = useState(false);
    const [deliveryNotification, setDeliveryNotification] = useState(false);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialIcons name="chevron-left" size={28} color="#F6F6F6" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <Input
                    label="Full Name"
                    value={fullName}
                    onChangeText={setFullName}
                />
                <Input
                    label="Date of Birth"
                    value={dob}
                    onChangeText={setDob}
                />

                <View style={styles.passwordHeader}>
                    <Text style={styles.sectionTitle}>Password</Text>
                    <TouchableOpacity>
                        <Text style={styles.changeText}>Change</Text>
                    </TouchableOpacity>
                </View>
                <Input
                    label="Password"
                    value={password}
                    secureTextEntry
                    editable={false}
                />

                <Text style={styles.sectionTitle}>Notifications</Text>

                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Sales</Text>
                    <Switch
                        value={salesNotification}
                        onValueChange={setSalesNotification}
                        trackColor={{ false: '#2A2C36', true: '#55D85A' }}
                        thumbColor={salesNotification ? '#F6F6F6' : '#F6F6F6'}
                    />
                </View>
                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>New arrivals</Text>
                    <Switch
                        value={newArrivalsNotification}
                        onValueChange={setNewArrivalsNotification}
                        trackColor={{ false: '#2A2C36', true: '#55D85A' }}
                        thumbColor={newArrivalsNotification ? '#F6F6F6' : '#F6F6F6'}
                    />
                </View>
                <View style={styles.switchRow}>
                    <Text style={styles.switchLabel}>Delivery status changes</Text>
                    <Switch
                        value={deliveryNotification}
                        onValueChange={setDeliveryNotification}
                        trackColor={{ false: '#2A2C36', true: '#55D85A' }}
                        thumbColor={deliveryNotification ? '#F6F6F6' : '#F6F6F6'}
                    />
                </View>

                {/* Help Center could be another section */}
            </ScrollView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 8,
        paddingVertical: 10,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    content: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#F6F6F6',
        marginBottom: 16,
        marginTop: 10,
    },
    passwordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 16,
    },
    changeText: {
        color: '#ABB4BD',
        fontSize: 14,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    switchLabel: {
        color: '#F6F6F6',
        fontSize: 14,
        fontWeight: '500',
    },
});

export default SettingsScreen;
