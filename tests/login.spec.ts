import { expect, test } from '@playwright/test'

const credentials = {
  username: 'test',
  password: 'password123',
}

test.describe('Login flow', () => {
  test('allows a user to sign in and reach the dashboard', async ({ page }) => {
    // Step 1: Open the login page using the app route requested for E2E testing.
    await page.goto('/login')

    // Step 2: Confirm the sign-in form is visible before interacting with it.
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()

    // Step 3: Fill in the username and password fields with the required credentials.
    await page.getByLabel(/username/i).fill(credentials.username)
    await page.getByLabel(/password/i).fill(credentials.password)

    // Step 4: Click the login button and capture the auth response for better failure reporting.
    const signInButton = page.getByRole('button', { name: /^sign in$/i })
    const loginResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/auth/signin') && response.request().method() === 'POST',
    )

    await signInButton.click()

    const loginResponse = await loginResponsePromise
    if (!loginResponse.ok()) {
      let errorDetails = `Login request failed with status ${loginResponse.status()}.`

      try {
        const body = (await loginResponse.json()) as { error?: string; details?: string[] }
        const extraDetails = [body.error, ...(body.details ?? [])].filter(Boolean).join(' ')
        if (extraDetails) {
          errorDetails = `${errorDetails} ${extraDetails}`
        }
      } catch {
        // Keep the default error message when the response body is not JSON.
      }

      throw new Error(errorDetails)
    }

    // Step 5: Wait for the successful redirect to the dashboard route.
    await page.waitForURL((url) => url.pathname === '/', { timeout: 10_000 })

    // Step 6: Verify the dashboard content is visible after navigation completes.
    await expect(page.getByRole('heading', { name: /student overview/i })).toBeVisible()
  })
})
