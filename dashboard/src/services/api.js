const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    throw new Error('Login failed')
  }

  return response.json()
}

export async function getVariants(intentId, apiKey) {
  const response = await fetch(`${API_BASE_URL}/v1/variants/${intentId}`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch variants')
  }

  return response.json()
}

export async function getAllIntents(apiKey) {
  const response = await fetch(`${API_BASE_URL}/v1/variants`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch all variants')
  }

  const variantsByIntent = await response.json()
  
  // Transform the response from object to array format
  const intents = Object.entries(variantsByIntent).map(([intentId, variants]) => ({
    intentId,
    variants
  }))

  return intents
}
