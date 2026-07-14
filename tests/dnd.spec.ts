import { test, expect } from '@playwright/test'

function uniqueEmail() {
  const rand = Math.floor(performance.now() * 1000) % 1_000_000
  return `dnd_${rand}@example.com`
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

test('load sample data fills the board', async ({ page }) => {
  await registerAndLogin(page)
  await page.getByTestId('load-samples').click()
  // toHaveCount auto-retries until all six sample inserts land.
  await expect(page.getByTestId('task-card')).toHaveCount(6)
})
