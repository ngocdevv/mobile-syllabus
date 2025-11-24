import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'outline';
    loading?: boolean;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onPress, variant = 'primary', loading, disabled }) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                variant === 'outline' && styles.outlineContainer,
                disabled && styles.disabledContainer,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#fff' : '#DB3022'} />
            ) : (
                <Text style={[styles.text, variant === 'outline' && styles.outlineText]}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#DB3022',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        shadowColor: '#D32626',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#DB3022',
    },
    disabledContainer: {
        backgroundColor: '#9B9B9B',
        shadowOpacity: 0,
    },
    text: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    outlineText: {
        color: '#DB3022',
    },
});

export default Button;
