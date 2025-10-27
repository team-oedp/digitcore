# Customizable Icons Documentation

## Overview

The Customizable Icons system allows you to dynamically style SVG icons using CSS custom properties. All icons in the `public/icons/` directory have been converted to support customizable fill colors, stroke colors, and opacity values while maintaining their original appearance as fallbacks.

## Quick Start

```tsx
import { CustomizableIcon, getIconPath } from '@/components/icons';

// Basic usage with default colors
<CustomizableIcon src={getIconPath(1)} width={64} height={64} />

// Custom colors
<CustomizableIcon 
  src="/icons/icon-05.svg"
  fillColor="#ff6b9d"
  strokeColor="#c44569"
  width={64}
  height={64}
/>
```

## API Reference

### CustomizableIcon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | **required** | Path to the SVG file |
| `fillColor` | `string` | `undefined` | Custom fill color (CSS color value) |
| `fillOpacity` | `number` | `undefined` | Fill opacity (0-1) |
| `strokeColor` | `string` | `undefined` | Custom stroke color (CSS color value) |
| `strokeOpacity` | `number` | `undefined` | Stroke opacity (0-1) |
| `strokeWidth` | `number` | `undefined` | Stroke width |
| `width` | `number` | `undefined` | Icon width in pixels |
| `height` | `number` | `undefined` | Icon height in pixels |
| `className` | `string` | `''` | CSS class name |
| `alt` | `string` | `'Icon'` | Alt text for accessibility |

### Utility Functions

#### `getIconPath(iconNumber: number): string`

Generates the path for numbered icons (1-24).

```tsx
getIconPath(1)  // Returns "/icons/icon-01.svg"
getIconPath(15) // Returns "/icons/icon-15.svg"
```

#### `applyColorPreset(preset: string, overrides?: object): object`

Applies predefined color schemes.

Available presets:
- `primary` - Brand colors (#85A374)
- `success` - Green colors (#10b981)
- `warning` - Orange colors (#f59e0b)
- `error` - Red colors (#ef4444)
- `info` - Blue colors (#3b82f6)
- `neutral` - Gray colors (#6b7280)
- `muted` - Muted colors with reduced opacity

```tsx
<CustomizableIcon 
  src={getIconPath(3)}
  {...applyColorPreset('success')}
/>

// With overrides
<CustomizableIcon 
  src={getIconPath(3)}
  {...applyColorPreset('success', { fillOpacity: 0.8 })}
/>
```

## Usage Examples

### Basic Customization

```tsx
// Default appearance (uses original SVG colors)
<CustomizableIcon src="/icons/icon-01.svg" width={48} height={48} />

// Custom fill color only
<CustomizableIcon 
  src="/icons/icon-02.svg" 
  fillColor="#9b59b6"
  width={48} 
  height={48} 
/>

// Custom stroke color only
<CustomizableIcon 
  src="/icons/icon-03.svg" 
  strokeColor="#e74c3c"
  width={48} 
  height={48} 
/>

// Both fill and stroke
<CustomizableIcon 
  src="/icons/icon-04.svg" 
  fillColor="#3498db"
  strokeColor="#2980b9"
  width={48} 
  height={48} 
/>
```

### Opacity Control

```tsx
// Reduce fill opacity
<CustomizableIcon 
  src="/icons/icon-05.svg" 
  fillOpacity={0.3}
  width={48} 
  height={48} 
/>

// Reduce stroke opacity
<CustomizableIcon 
  src="/icons/icon-06.svg" 
  strokeOpacity={0.5}
  width={48} 
  height={48} 
/>

// Control both opacities
<CustomizableIcon 
  src="/icons/icon-07.svg" 
  fillOpacity={0.7}
  strokeOpacity={0.8}
  width={48} 
  height={48} 
/>
```

### Interactive States

```tsx
function InteractiveIcon() {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <CustomizableIcon 
      src="/icons/icon-08.svg"
      fillColor={isHovered ? '#ff6b9d' : undefined}
      strokeColor={isHovered ? '#c44569' : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      width={64}
      height={64}
      className="cursor-pointer transition-all duration-200"
    />
  );
}
```

### Theme Integration

```tsx
// Using CSS custom properties for theme support
<CustomizableIcon 
  src="/icons/icon-09.svg"
  fillColor="var(--primary-color)"
  strokeColor="var(--primary-dark)"
  width={48}
  height={48}
/>

// Conditional theming
function ThemedIcon() {
  const { theme } = useTheme();
  
  return (
    <CustomizableIcon 
      src="/icons/icon-10.svg"
      fillColor={theme === 'dark' ? '#ffffff' : '#000000'}
      fillOpacity={theme === 'dark' ? 0.9 : 0.8}
      width={48}
      height={48}
    />
  );
}
```

### Responsive Sizing

```tsx
// Responsive icon sizes
<CustomizableIcon 
  src="/icons/icon-11.svg"
  fillColor="#8b5cf6"
  className="w-8 h-8 md:w-12 md:h-12 lg:w-16 lg:h-16"
/>

// Different sizes for different contexts
<div className="flex items-center gap-2">
  <CustomizableIcon src="/icons/icon-12.svg" width={16} height={16} />
  <span>Small icon in text</span>
</div>

<div className="text-center">
  <CustomizableIcon src="/icons/icon-12.svg" width={96} height={96} />
  <h3>Large feature icon</h3>
</div>
```

## Available Icons

The system includes 24 pre-converted icons:

- `icon-01.svg` through `icon-24.svg`
- All located in `public/icons/`
- All support the same customization properties

## Technical Details

### How It Works

1. **SVG Conversion**: Original SVG files have been processed to replace hardcoded attributes with CSS custom properties:
   - `fill="#85A374"` → `fill="var(--icon-fill-color, #85A374)"`
   - `fill-opacity="0.5"` → `fill-opacity="var(--icon-fill-opacity, 0.5)"`
   - `stroke="#85A374"` → `stroke="var(--icon-stroke-color, #85A374)"`
   - `stroke-opacity="0.5"` → `stroke-opacity="var(--icon-stroke-opacity, 0.5)"`

2. **CSS Custom Properties**: The `CustomizableIcon` component applies CSS custom properties as inline styles, which override the default values while preserving fallbacks.

3. **Performance**: CSS custom properties are GPU-accelerated and don't cause layout recalculations, making color changes very performant.

### Browser Support

- CSS custom properties are supported in all modern browsers
- Fallback values ensure icons display correctly even if custom properties aren't supported
- No JavaScript required for basic functionality

### Accessibility

- Always provide meaningful `alt` text
- Ensure sufficient color contrast for visibility
- Consider users with color vision deficiencies when choosing colors

```tsx
<CustomizableIcon 
  src="/icons/icon-13.svg"
  alt="Settings icon"
  fillColor="#2563eb"
  width={24}
  height={24}
/>
```

## Migration Guide

### From Static Icons

If you're currently using static SVG icons:

```tsx
// Before
<img src="/icons/icon-01.svg" width={48} height={48} alt="Icon" />

// After (same appearance)
<CustomizableIcon src="/icons/icon-01.svg" width={48} height={48} alt="Icon" />

// After (with customization)
<CustomizableIcon 
  src="/icons/icon-01.svg" 
  fillColor="#9b59b6"
  width={48} 
  height={48} 
  alt="Icon" 
/>
```

### Adding New Icons

To add new customizable icons:

1. Place your SVG file in `public/icons/`
2. Run the conversion script: `npm run convert-svgs`
3. Use with `CustomizableIcon` component

## Best Practices

1. **Consistent Sizing**: Use consistent icon sizes throughout your application
2. **Color Harmony**: Use color presets or a consistent color palette
3. **Performance**: Avoid changing colors on every render; use `useMemo` for dynamic colors
4. **Accessibility**: Always provide alt text and ensure good contrast
5. **Fallbacks**: Test that icons look good with default colors

## Troubleshooting

### Icons Not Changing Color

- Ensure the SVG file has been converted with the script
- Check that you're using the correct CSS custom property names
- Verify the SVG elements have the attributes you're trying to customize

### Performance Issues

- Use `React.memo` for icons that don't change frequently
- Avoid inline object creation for style props
- Consider using CSS classes for static color schemes

### TypeScript Errors

- Ensure you're importing types: `import type { CustomizableIconProps } from '@/components/icons'`
- Check that color values are valid CSS color strings
- Verify opacity values are between 0 and 1