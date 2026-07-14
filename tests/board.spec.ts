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

test('edit a task moves it to another column and persists after reload', async ({ page }) => {
  await registerAndLogin(page)

  await page.getByTestId('new-task-btn').click()
  await page.getByLabel('Title').fill('Write API docs')
  await page.getByRole('button', { name: 'Create task' }).click()

  const backlog = page.getByTestId('column-backlog')
  await expect(backlog.getByText('Write API docs')).toBeVisible()

  await backlog.getByText('Write API docs').click()
  await page.getByLabel('Status').selectOption('in_progress')
  await page.getByLabel('Description').fill('Cover auth + tasks endpoints')
  await page.getByRole('button', { name: 'Save changes' }).click()

  const inProgress = page.getByTestId('column-in_progress')
  await expect(inProgress.getByText('Write API docs')).toBeVisible()
  await expect(backlog.getByText('Write API docs')).toHaveCount(0)

  await page.reload()
  await expect(page.getByTestId('column-in_progress').getByText('Write API docs')).toBeVisible()
})

test('search filters tasks across columns', async ({ page }) => {
  await registerAndLogin(page)

  for (const title of ['Fix login bug', 'Update pricing page']) {
    await page.getByTestId('new-task-btn').click()
    await page.getByLabel('Title').fill(title)
    await page.getByRole('button', { name: 'Create task' }).click()
  }

  await page.getByTestId('search-input').fill('pricing')
  await expect(page.getByText('Update pricing page')).toBeVisible()
  await expect(page.getByText('Fix login bug')).toHaveCount(0)
})
