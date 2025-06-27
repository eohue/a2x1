# ApplicationCTA Component

A full-width, visually distinct call-to-action section that encourages users to apply for housing. This component is designed to create a compelling visual break in the page flow and drive user engagement toward the application process.

## Features

- **Full-width responsive design** with Tailwind CSS utilities
- **Background gradient styling** using the design system color palette
- **Internationalized content** pulled from translation files
- **Accessible markup** with proper ARIA labels and semantic structure
- **Smooth scroll interaction** to application section
- **Responsive typography** that scales appropriately on all devices
- **Decorative visual elements** including background gradients and SVG waves

## Usage

### Basic Implementation

```tsx
import { ApplicationCTA } from '@/components/ApplicationCTA';

export function MyPage() {
  return (
    <div>
      {/* Other page content */}
      <ApplicationCTA />
      
      {/* Application form section */}
      <section id="application">
        {/* Your application form here */}
      </section>
    </div>
  );
}
```

### Translation Keys

The component uses the following translation keys from `cta` namespace:

```json
{
  "cta": {
    "title": "Ready to Join Our Community?",
    "subtitle": "Take the first step towards better living...",
    "button": "Apply for Housing"
  }
}
```

### Responsive Behavior

- **Mobile (sm and below)**: Single column layout, smaller text sizes
- **Tablet (md-lg)**: Increased spacing and text sizes
- **Desktop (xl and above)**: Maximum visual impact with largest text sizes

## Design Details

### Color Scheme
- **Primary gradient**: `from-primary-600 via-primary-700 to-primary-800`
- **Text colors**: White headline, `primary-100` for subtitle
- **Button styling**: White background with `primary-700` text

### Typography
- **Headline**: Responsive from `text-3xl` to `text-5xl`
- **Subtitle**: Responsive from `text-lg` to `text-2xl`
- **Button**: `text-lg` with semibold weight

### Spacing
- **Vertical padding**: Responsive from `py-16` to `py-24`
- **Content max-width**: `max-w-7xl` with responsive horizontal padding

## Accessibility

- Uses semantic `<section>` element with descriptive `aria-label`
- Button includes `aria-describedby` reference for screen readers
- Decorative elements marked with `aria-hidden="true"`
- Proper heading hierarchy with `<h2>` element
- Screen reader optimized content with `.sr-only` class

## Interaction

When the CTA button is clicked:
1. Prevents default link behavior
2. Searches for element with `id="application"`
3. Smoothly scrolls to the application section
4. Sets focus on the application section for keyboard navigation

## Customization

### Modifying Colors
Update the gradient classes in the main section:
```tsx
className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800"
```

### Changing Scroll Target
Modify the `handleApplyClick` function to target a different element ID:
```tsx
const applicationSection = document.getElementById('your-custom-id');
```

### Adding Custom Styling
Pass additional classes through the button's `className` prop or wrap the component in a container with custom styles.

## Dependencies

- **next-intl**: For internationalization
- **React**: Core framework
- **Tailwind CSS**: Styling framework
- **clsx/tailwind-merge**: Class name utilities (via Button component)

## File Structure

```
components/
├── ApplicationCTA.tsx           # Main component
├── ApplicationCTA.examples.tsx  # Usage examples
├── ApplicationCTA.md           # This documentation
└── __tests__/
    └── ApplicationCTA.test.tsx # Test suite
```

## Testing

The component includes comprehensive tests covering:
- Rendering with translations
- Accessibility attributes
- Scroll behavior
- Error handling
- Responsive design classes

Run tests with:
```bash
npm test ApplicationCTA
```

## Browser Support

Compatible with all modern browsers that support:
- CSS Grid and Flexbox
- CSS Custom Properties (CSS Variables)
- SVG rendering
- Smooth scrolling behavior
