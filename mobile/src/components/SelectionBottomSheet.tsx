import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

interface SelectionBottomSheetProps {
    bottomSheetRef: React.RefObject<BottomSheetModal | null>;
    title: string;
    options: string[];
    selectedOption: string | null;
    onSelect: (option: string) => void;
}

const SelectionBottomSheet = ({ bottomSheetRef, title, options, selectedOption, onSelect }: SelectionBottomSheetProps) => {
    const snapPoints = useMemo(() => ['50%'], []);

    const renderBackdrop = (props: any) => (
        <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
        />
    );

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backdropComponent={renderBackdrop}
            backgroundStyle={{ backgroundColor: '#1E1F28' }}
            handleIndicatorStyle={{ backgroundColor: '#ABB4BD' }}
        >
            <BottomSheetView style={styles.contentContainer}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.optionsContainer}>
                    {options.map((option) => (
                        <TouchableOpacity
                            key={option}
                            style={[
                                styles.optionItem,
                                selectedOption === option && styles.selectedOptionItem
                            ]}
                            onPress={() => {
                                onSelect(option);
                                bottomSheetRef.current?.dismiss();
                            }}
                        >
                            <Text style={[
                                styles.optionText,
                                selectedOption === option && styles.selectedOptionText
                            ]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
        padding: 16,
        backgroundColor: '#1E1F28',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#F6F6F6',
        textAlign: 'center',
        marginBottom: 20,
    },
    optionsContainer: {
        flexDirection: 'column',
        gap: 12,
    },
    optionItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        backgroundColor: '#2A2C36',
        marginBottom: 8,
    },
    selectedOptionItem: {
        backgroundColor: '#EF3651',
    },
    optionText: {
        fontSize: 16,
        color: '#F6F6F6',
    },
    selectedOptionText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default SelectionBottomSheet;
