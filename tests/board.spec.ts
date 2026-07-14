import { test, expect } from '@playwright/test'

function uniqueEmail() {
  const rand = Math.floor(performance.now() * 1000) % 1_000_000
  return `board_${rand}@example.com`
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

test('create a task and see it in Backlog, then delete it', async ({ page }) => {
  await registerAndLogin(page)

  await page.getByTestId('new-task-btn').click()
  await page.getByLabel('Title').fill('Design homepage')
  await page.getByLabel('Description').fill('Draft the hero section')
  await page.getByLabel('Priority').selectOption('high')
  await page.getByRole('button', { name: 'Create task' }).click()

  const backlog = page.getByTestId('column-backlog')
  await expect(backlog.getByText('Design homepage')).toBeVisible()
  await expect(backlog.getByText('High')).toBeVisible()

  await backlog.getByTestId('task-card').first().hover()
  await backlog.getByTestId('delete-task').first().click()
  await expect(backlog.getByText('Design homepage')).toHaveCount(0)
})
