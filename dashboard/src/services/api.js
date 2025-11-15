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
  // Since we don't have a dedicated endpoint, we'll fetch common intents
  // In production, you'd want a backend endpoint that returns all unique intent_ids
  const commonIntents = ['cart_abandon', 'price_drop', 'order_shipped', 'back_in_stock']
  
  const results = await Promise.allSettled(
    commonIntents.map(intentId => getVariants(intentId, apiKey))
  )

  const intents = []
  results.forEach((result, index) => {
    if (result.status === 'fulfilled' && result.value.length > 0) {
      intents.push({
        intentId: commonIntents[index],
        variants: result.value
      })
    }
  })

  return intents
}
