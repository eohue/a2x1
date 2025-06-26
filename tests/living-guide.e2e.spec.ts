import { test, expect } from '@playwright/test';

test.describe('Living Guide 승인 워크플로우', () => {
  test('생활백서 목록/상세/다국어/접근성 UI', async ({ page }) => {
    await page.goto('/resident/living-guide');
    // 타이틀, 목차, 안내문구 노출
    await expect(page.getByRole('heading', { name: /생활백서|Living Guide/ })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /목차|Table of Contents/ })).toBeVisible();
    // 다국어 전환(영어)
    await page.getByRole('button', { name: /영어|English/ }).click();
    await expect(page.getByRole('heading', { name: /Living Guide/ })).toBeVisible();
    // 다시 한국어
    await page.getByRole('button', { name: /한국어|Korean/ }).click();
    await expect(page.getByRole('heading', { name: /생활백서/ })).toBeVisible();
    // 접근성: aria-label, aria-live, role 등 주요 속성 확인
    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByRole('alert')).not.toBeVisible();
  });

  test('관리자 승인/반려/이력/롤백 UI', async ({ page }) => {
    await page.goto('/admin/living-guide');
    // 타이틀, 알림, 목차, 테이블 노출
    await expect(page.getByRole('heading', { name: /승인 관리|Approval Management/ })).toBeVisible();
    await expect(page.getByRole('region', { name: /알림|Notifications/ })).toBeVisible();
    await expect(page.getByRole('navigation', { name: /목차|Table of Contents/ })).toBeVisible();
    await expect(page.getByRole('table', { name: /목록|List/ })).toBeVisible();
    // 승인/반려/상세/삭제 버튼 노출
    await expect(page.getByRole('button', { name: /승인|Approve/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /거절|Reject/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /상세|Detail/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /삭제|Delete/ })).toBeVisible();
    // 이력/롤백 UI
    await page.getByRole('button', { name: /상세|Detail/ }).first().click();
    await expect(page.getByRole('region', { name: /상세|Detail/ })).toBeVisible();
    await expect(page.getByRole('table', { name: /이력|History/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /롤백|Rollback/ })).toBeVisible();
  });
}); 