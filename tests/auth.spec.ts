import { test, expect } from '@playwright/test'

// Requires Supabase "Confirm email" to be OFF so signUp returns a usable
// account immediately (Authentication → Providers → Email).
function uniqueEmail() {
  // no Date.now in some sandboxes; use random-ish from performance + counter
  const rand = Math.floor(performance.now() * 1000) % 1_000_000
  return `test_${rand}@example.com`
}

test('register then sign in lands on the board', async ({ page }) => {
  const email = uniqueEmail()
  const password = 'Passw0rd!'

  await page.goto('/login')

  // switch to register
  await page.getByRole('button', { name: 'Register' }).click()
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Register' }).click()

  // back on login form after successful registration
  await expect(page.getByText('You can sign in now.')).toBeVisible()

  // sign in
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Sign in' }).click()

  // protected board renders
  await expect(page.getByRole('heading', { name: 'My Board' })).toBeVisible()
})

test('login page renders and toggles to register', async ({ page }) => {
  await page.goto('/login')
  await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  await page.getByRole('button', { name: 'Register' }).click()
  await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible()
})
