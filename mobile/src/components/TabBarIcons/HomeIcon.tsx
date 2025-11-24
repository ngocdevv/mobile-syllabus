import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HomeIconProps {
    focused: boolean;
    color: string;
    size?: number;
}

export const HomeIcon: React.FC<HomeIconProps> = ({ focused, color, size = 24 }) => {
    if (focused) {
        // Activated version - filled
        return (
            <Svg width={size} height={size} viewBox="0 0 31 28" fill="none">
                <Path
                    d="M12.3529 27V17.5H18.6471V27H26.5882V14H31L15.5 0L0 14H4.41176V27H12.3529Z"
                    fill={color}
                />
            </Svg>
        );
    }

    // Inactive version - outlined
    return (
        <Svg width={size} height={size} viewBox="0 0 31 28" fill="none">
            <Path
                d="M12.3529 27V17.5H18.6471V27H26.5882V14H31L15.5 0L0 14H4.41176V27H12.3529Z"
                stroke={color}
                strokeWidth="1.5"
                fill="none"
            />
        </Svg>
    );
};
