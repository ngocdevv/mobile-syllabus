# Tab Bar Icons

Custom SVG icons for bottom tab navigation, designed based on Figma specifications.

## Components

### HomeIcon
- **Activated**: Filled home icon
- **Inactive**: Outlined home icon

### ShopIcon
- **Activated**: Filled shopping cart icon
- **Inactive**: Outlined shopping cart icon

### BagIcon
- **Activated**: Filled shopping bag icon
- **Inactive**: Outlined shopping bag icon

### ProfileIcon
- **Activated**: Filled account/profile icon
- **Inactive**: Outlined account/profile icon

## Usage

```tsx
import { HomeIcon, ShopIcon, BagIcon, ProfileIcon } from '../components/TabBarIcons';

// In your tab navigator
<Tab.Screen 
    name="Home" 
    component={HomeStack}
    options={{
        tabBarIcon: ({ focused, color }) => (
            <HomeIcon focused={focused} color={color} size={24} />
        ),
    }}
/>
```

## Props

All icon components accept the following props:

- `focused` (boolean): Whether the tab is currently active
- `color` (string): The color to apply to the icon (automatically provided by React Navigation)
- `size` (number, optional): The size of the icon in pixels (default: 24)

## Design System

- **Primary Color (Active)**: #EF3651
- **Secondary Color (Inactive)**: #ABB4BD
- **Background**: #1E1F28

## Source

Icons are based on the Figma design:
- Activated icons: https://www.figma.com/design/OT2qXZDd10PBgDr9WRkc7F/E-commerce-Application-by-Fively-_-Dark-version--Copy-?node-id=80-14
- Inactive icons: https://www.figma.com/design/OT2qXZDd10PBgDr9WRkc7F/E-commerce-Application-by-Fively-_-Dark-version--Copy-?node-id=80-13
