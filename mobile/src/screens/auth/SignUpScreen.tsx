import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { z } from 'zod';
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
            const response = await client.post('/auth/signup', {
                email: data.email,
                password: data.password,
                full_name: data.name,
            });

            const { user, session } = response.data;
            login(user, session.access_token);
        } catch (error: any) {
            Alert.alert('Sign Up Failed', error.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
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

                <View style={styles.footer}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={styles.footerText}>Already have an account? <Text style={styles.link}>Login</Text></Text>
                    </TouchableOpacity>
                </View>

                <Button
                    title="SIGN UP"
                    onPress={handleSubmit(onSubmit)}
                    loading={isSubmitting}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1F28',
        paddingHorizontal: 16,
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
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 28,
        marginTop: 16,
    },
    footerText: {
        color: '#F6F6F6',
        fontSize: 14,
    },
    link: {
        color: '#EF3651',
    },
});

export default SignUpScreen;
