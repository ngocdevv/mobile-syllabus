import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import client from '../../api/client';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../contexts/AuthContext';

const signUpSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpScreen = () => {
    const navigation = useNavigation<any>();
    const { login } = useAuth();
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
        // resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const response = await client.post('/auth/register', {
                email: data.email,
                password: data.password,
                full_name: data.name,
            });

            const { user, token } = response.data;
            login(user, token);
        } catch (error: any) {
            Alert.alert('Sign Up Failed', error.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>Sign up</Text>
                </View>

                <View style={styles.form}>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Name"
                                value={value}
                                onChangeText={onChange}
                                error={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Email"
                                value={value}
                                onChangeText={onChange}
                                error={errors.email?.message}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <Input
                                label="Password"
                                value={value}
                                onChangeText={onChange}
                                error={errors.password?.message}
                                secureTextEntry
                            />
                        )}
                    />

                    <View style={styles.loginLinkContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                            <Ionicons name="arrow-forward" size={24} color="#EF3651" />
                        </TouchableOpacity>
                    </View>

                    <Button
                        title="SIGN UP"
                        onPress={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                    />
                </View>

                <View style={styles.socialSection}>
                    <Text style={styles.socialText}>Or sign up with social account</Text>
                    <View style={styles.socialButtons}>
                        <TouchableOpacity style={styles.socialButton}>
                            <FontAwesome name="google" size={24} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <FontAwesome name="facebook" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>
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
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    header: {
        marginTop: 30,
        marginBottom: 70,
    },
    title: {
        fontSize: 34,
        fontWeight: 'bold',
        color: '#F6F6F6',
    },
    form: {
        marginBottom: 30,
    },
    loginLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 28,
        marginTop: 16,
    },
    loginLink: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        color: '#F6F6F6',
        fontSize: 14,
        marginRight: 4,
    },
    socialSection: {
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 20,
    },
    socialText: {
        color: '#F6F6F6',
        fontSize: 14,
        marginBottom: 12,
    },
    socialButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    socialButton: {
        width: 92,
        height: 64,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 8,
    },
});

export default SignUpScreen;
