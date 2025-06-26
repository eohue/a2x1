# LanguageSwitcher Component

A flexible language switching component that allows users to change locales in the application. The component supports multiple display modes, persistent storage, and integrates with the Next.js i18n framework.

## Features

- 🌐 **Multiple Display Modes**: Dropdown or pill button layout
- 🏴 **Flag Support**: Optional flag emojis alongside language names
- 💾 **Persistent Storage**: Saves selection to localStorage and cookies
- 🔄 **Next.js Integration**: Uses Next.js i18n routing with `router.replace()`
- ♿ **Accessibility**: Full ARIA support and keyboard navigation
- 🎨 **Customizable**: Flexible styling with multiple configuration options

## Usage

### Basic Usage (Dropdown)

```tsx
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export default function Header() {
  return (
    <header>
      <LanguageSwitcher />
    </header>
  );
}
```

### Pill Button Mode

```tsx
import { LanguageSwitcherPills } from '@/components/common/LanguageSwitcher';

export default function Navigation() {
  return (
    <nav>
      <LanguageSwitcherPills showCodesOnly />
    </nav>
  );
}
```

### Custom Configuration

```tsx
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export default function CustomSwitcher() {
  return (
    <LanguageSwitcher
      mode="pills"
      showFlags={false}
      showCodesOnly={true}
      className="my-custom-class"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mode` | `'dropdown' \| 'pills'` | `'dropdown'` | Display mode for the language switcher |
| `showFlags` | `boolean` | `true` | Whether to display flag emojis |
| `showCodesOnly` | `boolean` | `false` | Show only locale codes (KO, EN) instead of full names |
| `className` | `string` | `''` | Additional CSS classes |

## Supported Languages

The component currently supports:

- **Korean** (`ko`): 🇰🇷 한국어
- **English** (`en`): 🇺🇸 English

## Display Modes

### Dropdown Mode
- Compact design with a dropdown menu
- Uses a Button component with ChevronDown icon
- Good for headers and navigation bars
- Automatically closes when clicking outside

### Pills Mode
- Side-by-side button layout
- Clear visual indication of active language
- Good for settings pages or prominent locations
- Immediate visual feedback

## Persistence

The component automatically persists the user's language selection using two methods:

1. **localStorage**: `preferred-locale` key
2. **Cookie**: `preferred-locale` cookie (1 year expiration)

This ensures the selection is maintained across:
- Browser sessions
- Page refreshes
- Server-side rendering

## Accessibility

- Full ARIA support with proper roles and labels
- Keyboard navigation support
- Screen reader friendly
- Loading states with visual feedback
- Proper focus management

## Integration with Next.js i18n

The component integrates seamlessly with Next.js internationalization:

1. Uses `useLocale()` to get current locale
2. Uses `usePathname()` to maintain current path
3. Uses `router.replace()` to navigate with new locale
4. Implements `useTransition()` for smooth transitions

## Styling

The component uses Tailwind CSS classes and integrates with the existing Button component. It supports:

- Responsive design
- Dark/light mode compatibility (if configured)
- Custom theming through CSS variables
- Hover and focus states
- Loading animations

## Examples

### Header Implementation
```tsx
<header className="flex justify-between items-center p-4">
  <Logo />
  <LanguageSwitcher />
</header>
```

### Navigation Bar
```tsx
<nav className="flex items-center space-x-4">
  <NavLinks />
  <LanguageSwitcherPills showCodesOnly />
</nav>
```

### Settings Page
```tsx
<div className="settings-section">
  <h3>Language Preferences</h3>
  <LanguageSwitcher mode="pills" showFlags />
</div>
```

## Convenience Exports

Two pre-configured exports are available for common use cases:

- `LanguageSwitcherDropdown`: Dropdown mode with default settings
- `LanguageSwitcherPills`: Pills mode with default settings

## Technical Details

- Built with React hooks (`useState`, `useTransition`, `useEffect`)
- Uses `next-intl` for internationalization
- Implements proper TypeScript interfaces
- Follows React best practices for state management
- Optimized for performance with memoization where appropriate

## Browser Support

- All modern browsers
- Works with JavaScript disabled (graceful degradation)
- Supports both client-side and server-side rendering
