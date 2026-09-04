export class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data: any) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(endpoint, config);
    let data;

    // Handle empty responses
    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = text;
      }
    }

    if (!response.ok) {
      throw new ApiError(data?.error || 'An error occurred', response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error('Network error or unexpected response');
  }
}
