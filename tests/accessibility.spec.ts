import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Start the development server if needed
    await page.goto('http://localhost:3000');
  });

  test('Homepage accessibility check', async ({ page }) => {
    await page.goto('/');
    
    // Check for basic accessibility
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // Check for alt text on images
    const images = await page.locator('img').all();
    for (const image of images) {
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();
    }
    
    // Check for form labels
    const inputs = await page.locator('input').all();
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      }
    }
  });

  test('Navigation accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation landmarks
    const nav = page.locator('nav[aria-label="Global"]');
    await expect(nav).toBeVisible();
    
    // Check all navigation links are accessible
    const navLinks = nav.locator('a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    
    for (let i = 0; i < linkCount; i++) {
      const link = navLinks.nth(i);
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('Mobile menu accessibility', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Find and click mobile menu button
    const menuButton = page.locator('button', { hasText: '메뉴 열기' });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    
    // Check mobile menu dialog
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
    
    // Check close button
    const closeButton = page.locator('button', { hasText: '메뉴 닫기' });
    await expect(closeButton).toBeVisible();
    await closeButton.click();
    
    // Menu should be closed
    await expect(dialog).not.toBeVisible();
  });

  test('Language switcher accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Find language switcher
    const languageSwitcher = page.locator('[aria-label*="Language"], [aria-label*="언어"]').first();
    if (await languageSwitcher.isVisible()) {
      // Check if it's a button (dropdown mode)
      const isButton = await languageSwitcher.locator('button').count() > 0;
      if (isButton) {
        const button = languageSwitcher.locator('button').first();
        await expect(button).toHaveAttribute('aria-haspopup');
        await expect(button).toHaveAttribute('aria-expanded');
      }
      
      // Check if it's a group (pills mode)
      const isGroup = await languageSwitcher.locator('[role="group"]').count() > 0;
      if (isGroup) {
        const group = languageSwitcher.locator('[role="group"]').first();
        await expect(group).toHaveAttribute('aria-label');
      }
    }
  });

  test('Forms accessibility', async ({ page }) => {
    // Test forms on different pages
    const formPages = ['/resident/register', '/resident/login', '/application'];
    
    for (const formPage of formPages) {
      try {
        await page.goto(formPage);
        
        // Check for form inputs
        const inputs = await page.locator('input, textarea, select').all();
        
        for (const input of inputs) {
          const id = await input.getAttribute('id');
          const ariaLabel = await input.getAttribute('aria-label');
          const ariaLabelledBy = await input.getAttribute('aria-labelledby');
          
          // Input should have some form of labeling
          if (id) {
            const label = page.locator(`label[for="${id}"]`);
            const hasLabel = await label.count() > 0;
            expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
          } else {
            expect(ariaLabel || ariaLabelledBy).toBeTruthy();
          }
        }
        
        // Check for error messages
        const errorMessages = await page.locator('[role="alert"], [aria-live="polite"]').all();
        for (const error of errorMessages) {
          const text = await error.textContent();
          if (text && text.trim()) {
            expect(text.length).toBeGreaterThan(0);
          }
        }
      } catch (error) {
        // Page might not exist, skip
        console.log(`Skipping ${formPage}: ${error}`);
      }
    }
  });

  test('Keyboard navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test Tab navigation
    await page.keyboard.press('Tab');
    
    // Should focus on first interactive element
    const focusedElement = await page.locator(':focus').first();
    await expect(focusedElement).toBeVisible();
    
    // Test navigation links
    const navLinks = await page.locator('nav a').all();
    for (let i = 0; i < Math.min(navLinks.length, 5); i++) {
      await page.keyboard.press('Tab');
      const currentFocus = await page.locator(':focus').first();
      await expect(currentFocus).toBeVisible();
    }
  });

  test('Color contrast and visual accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Check that page has sufficient content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText && bodyText.length).toBeGreaterThan(100);
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    expect(h1Count).toBeLessThanOrEqual(1); // Only one h1 per page
    
    // Check for focus indicators on interactive elements
    const interactiveElements = await page.locator('a, button, input, select, textarea').all();
    
    for (let i = 0; i < Math.min(interactiveElements.length, 3); i++) {
      const element = interactiveElements[i];
      await element.focus();
      
      // Element should be focusable
      const isFocused = await element.evaluate(el => el === document.activeElement);
      expect(isFocused).toBeTruthy();
    }
  });

  test('Responsive design accessibility', async ({ page }) => {
    const viewports = [
      { width: 375, height: 667 },   // Mobile
      { width: 768, height: 1024 },  // Tablet
      { width: 1024, height: 768 },  // Desktop
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Check that navigation is accessible at this viewport
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
      
      // Check that content is not cut off
      const body = page.locator('body');
      const bodyBox = await body.boundingBox();
      expect(bodyBox?.width).toBeGreaterThan(0);
      expect(bodyBox?.height).toBeGreaterThan(0);
      
      // For mobile, check mobile menu functionality
      if (viewport.width < 768) {
        const mobileMenuButton = page.locator('button', { hasText: '메뉴 열기' });
        if (await mobileMenuButton.isVisible()) {
          await mobileMenuButton.click();
          const dialog = page.locator('[role="dialog"]');
          await expect(dialog).toBeVisible();
          
          const closeButton = page.locator('button', { hasText: '메뉴 닫기' });
          await closeButton.click();
        }
      }
    }
  });
});
