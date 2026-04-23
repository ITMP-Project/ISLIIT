import type { FullConfig } from '@playwright/test'

const credentials = {
  username: 'test0002',
  password: 'password123',
}

const apiUrl = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:4000'

async function readJsonSafe(response: Response) {
  try {
    return await response.json()
  } catch {
    return null
  }
}

async function ensureApiIsHealthy() {
  const response = await fetch(`${apiUrl}/api/health`)

  if (!response.ok) {
    throw new Error(`API health check failed with status ${response.status}.`)
  }
}

async function ensureLoginUser() {
  const signupResponse = await fetch(`${apiUrl}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!signupResponse.ok && signupResponse.status !== 409) {
    const errorBody = await readJsonSafe(signupResponse)
    throw new Error(
      `Unable to create the Playwright login user. ${errorBody?.error ?? `Status ${signupResponse.status}`}`,
    )
  }

  const signinResponse = await fetch(`${apiUrl}/api/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  })

  if (!signinResponse.ok) {
    const errorBody = await readJsonSafe(signinResponse)
    throw new Error(
      [
        'Playwright setup could not authenticate with the required test credentials.',
        `Expected username "${credentials.username}" with password "${credentials.password}".`,
        `Server response: ${errorBody?.error ?? `Status ${signinResponse.status}`}.`,
      ].join(' '),
    )
  }
}

export default async function globalSetup(_: FullConfig) {
  await ensureApiIsHealthy()
  await ensureLoginUser()
}
