import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
    label: string;
    error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, error ? styles.errorBorder : null]}>
                <Text style={[styles.label, error ? styles.errorLabel : null]}>{label}</Text>
                <TextInput style={styles.input} {...props} />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    inputContainer: {
        backgroundColor: '#2A2C36',
        borderRadius: 4,
        paddingHorizontal: 20,
        paddingVertical: 12,
        height: 64,
        justifyContent: 'center',
    },
    label: {
        color: '#ABB4BD',
        fontSize: 11,
        marginBottom: 4,
    },
    input: {
        color: '#F5F5F5',
        fontSize: 14,
    },
    errorBorder: {
        borderWidth: 1,
        borderColor: '#FF2424',
    },
    errorLabel: {
        color: '#FF2424',
    },
    errorText: {
        color: '#FF2424',
        fontSize: 11,
        marginTop: 4,
        marginLeft: 20,
    },
});

export default Input;
