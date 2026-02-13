export const API_BASE_URL = 'http://127.0.0.1:8000'

export async function submitReport(formData) {
  const response = await fetch(`${API_BASE_URL}/report`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    let message = 'Failed to submit report. Please try again.'
    try {
      const data = await response.json()
      if (data?.detail) {
        message = Array.isArray(data.detail)
          ? data.detail.map((d) => d.msg || d).join(', ')
          : data.detail
      } else if (data?.message) {
        message = data.message
      }
    } catch {
      // ignore parse errors and fall back to default message
    }
    throw new Error(message)
  }

  return response.json()
}

