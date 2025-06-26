# Button Component

A generic, accessible, and customizable button component built with Tailwind CSS and TypeScript.

## Features

- **4 Variants**: Primary, Secondary, Outline, Danger
- **4 Sizes**: Small (sm), Medium (md), Large (lg), Extra Large (xl)
- **Loading State**: Built-in spinner with customizable loading text
- **Disabled State**: Visual and functional disabled state
- **Full Width**: Option to make button take full width of container
- **i18n Support**: Accessible labels support internationalization
- **Ref Forwarding**: Supports React ref forwarding
- **Custom Styling**: `className` prop for additional styling

## Usage

```tsx
import { Button } from '@/components/common';

// Basic usage
<Button>Click me</Button>

// With variant and size
<Button variant="secondary" size="lg">
  Large Secondary Button
</Button>

// Loading state
<Button loading>
  Processing...
</Button>

// Full width
<Button fullWidth variant="outline">
  Full Width Outline Button
</Button>

// With custom loading text
<Button loading loadingText="Saving changes...">
  Save
</Button>

// Disabled
<Button disabled>
  Can't click me
</Button>

// Custom styling
<Button className="bg-gradient-to-r from-purple-500 to-pink-500">
  Gradient Button
</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'danger'` | `'primary'` | Visual style variant |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Button size |
| `fullWidth` | `boolean` | `false` | Whether button takes full width |
| `loading` | `boolean` | `false` | Shows loading spinner and disables button |
| `loadingText` | `string` | `undefined` | Custom loading text (falls back to i18n) |
| `disabled` | `boolean` | `false` | Disables the button |
| `className` | `string` | `undefined` | Additional CSS classes |
| `children` | `ReactNode` | - | Button content |

All standard HTML button attributes are also supported (`onClick`, `type`, `aria-*`, etc.).

## Internationalization

The component uses `next-intl` for loading spinner aria-label and default loading text. The following keys are used:

```json
{
  "button": {
    "loading": "Loading...",
    "loadingSpinner": "Loading spinner"
  }
}
```

## Accessibility

- Proper ARIA attributes (`aria-disabled`, `aria-label`)
- Loading spinner has appropriate `aria-label` and `role="img"`
- Focus ring styling with proper contrast
- Keyboard navigation support

## Styling

The component uses Tailwind CSS utility classes and follows the design system defined in `tailwind.config.js`. It leverages:

- Custom color palette (primary, secondary, error)
- Responsive design utilities
- Focus and hover states
- Animation utilities for loading spinner

## Examples

See `Button.examples.tsx` for comprehensive usage examples including all variants, sizes, states, and custom styling options.
