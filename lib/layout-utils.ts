/**
 * Layout utility functions for consistent styling and behavior
 */

export const layoutClasses = {
  container: 'min-h-[100dvh] bg-gray-50 text-gray-900 antialiased',
  html: 'font-manrope',
  body: 'min-h-[100dvh] bg-gray-50 text-gray-900 antialiased',
} as const;

export const fontVariables = {
  manrope: '--font-manrope',
} as const;

/**
 * Generate skip links for accessibility
 */
export function generateSkipLinks() {
  return [
    { href: '#main-content', text: 'Skip to main content' },
    { href: '#navigation', text: 'Skip to navigation' },
  ];
}

/**
 * Common ARIA attributes for better accessibility
 */
export const ariaAttributes = {
  main: {
    id: 'main-content',
    role: 'main',
    'aria-label': 'Main content',
  },
  navigation: {
    id: 'navigation',
    role: 'navigation',
    'aria-label': 'Main navigation',
  },
} as const;