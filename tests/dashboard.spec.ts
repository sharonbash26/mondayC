import { test, expect } from '@playwright/test'

function uniqueEmail() {
  const rand = Math.floor(performance.now() * 1000) % 1_000_000
  return `dash_${rand}@example.com`
}

async function registerAndLogin(page: import('@playwright/test').Page) {
  const email = uniqueEmail()
  const password = 'Passw0rd!'
  await page.goto('/login')
  await page.getByRole('button', { name: 'Register' }).click()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Register' }).click()
  await expect(page.getByText('You can sign in now.')).toBeVisible()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page.getByRole('heading', { name: 'My Board' })).toBeVisible()
}

test('dashboard shows accurate total after adding a task', async ({ page }) => {
  await registerAndLogin(page)

  await page.getByTestId('new-task-btn').click()
  await page.getByLabel('Title').fill('Prep demo')
  await page.getByRole('button', { name: 'Create task' }).click()

  await page.getByRole('link', { name: 'Dashboard' }).click()
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByText('Total tasks')).toBeVisible()
  await expect(page.locator('text=Total tasks').locator('..').getByText('1')).toBeVisible()
})

test('mobile viewport: sidebar hidden by default and opens via menu', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await registerAndLogin(page)

  await expect(page.getByRole('link', { name: 'Dashboard' })).not.toBeVisible()
  await page.getByLabel('Open menu').click()
  await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
})
