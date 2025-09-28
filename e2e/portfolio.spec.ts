import { test, expect } from '@playwright/test';

test.describe('Portfolio Application', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the main heading is visible
    await expect(page.locator('h1')).toContainText('Portfolio');
    
    // Check if navigation is present
    await expect(page.locator('nav')).toBeVisible();
    
    // Check if hero section is visible
    await expect(page.locator('section').first()).toBeVisible();
  });

  test('should toggle between PM and Developer tracks', async ({ page }) => {
    await page.goto('/');
    
    // Click on Developer track
    await page.click('button:has-text("Developer")');
    
    // Verify content changes
    await expect(page.locator('text=Senior Full Stack Mobile Developer')).toBeVisible();
    
    // Click on Project Manager track
    await page.click('button:has-text("Project Manager")');
    
    // Verify content changes back
    await expect(page.locator('text=Certified Project Manager')).toBeVisible();
  });

  test('should navigate to different sections', async ({ page }) => {
    await page.goto('/');
    
    // Test navigation links
    const sections = ['About', 'Experience', 'Projects', 'Skills', 'Contact'];
    
    for (const section of sections) {
      await page.click(`a[href="#${section.toLowerCase()}"]`);
      // Wait for scroll animation
      await page.waitForTimeout(500);
      
      // Check if section is in viewport
      const sectionElement = page.locator(`#${section.toLowerCase()}`);
      await expect(sectionElement).toBeInViewport();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu button is visible
    await expect(page.locator('button').filter({ hasText: /menu/i })).toBeVisible();
    
    // Open mobile menu
    await page.click('button:has(svg)');
    
    // Check if mobile navigation is visible
    await expect(page.locator('nav').last()).toBeVisible();
  });

  test('should have proper accessibility', async ({ page }) => {
    await page.goto('/');
    
    // Check for proper heading hierarchy
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThan(0);
    
    // Check for alt text on images (when added)
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
    
    // Check for proper button labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasText = await button.textContent();
      const hasAriaLabel = await button.getAttribute('aria-label');
      
      expect(hasText || hasAriaLabel).toBeTruthy();
    }
  });

  test('should load all sections without errors', async ({ page }) => {
    await page.goto('/');
    
    // Wait for all sections to load
    await page.waitForLoadState('networkidle');
    
    // Check that no JavaScript errors occurred
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    // Scroll through all sections to trigger any lazy loading
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    await page.waitForTimeout(1000);
    
    expect(errors).toHaveLength(0);
  });
});