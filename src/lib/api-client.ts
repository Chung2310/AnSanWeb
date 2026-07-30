const API_BASE_URL = typeof window === 'undefined'
  ? (process.env.INTERNAL_API_URL || 'http://127.0.0.1:3006/api/v1')
  : (process.env.NEXT_PUBLIC_API_URL || '/api/v1');

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
  const headers = new Headers(options.headers || {});
  
  // Attach Access Token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const finalUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const response = await fetch(finalUrl, { ...options, headers });

  if (response.status === 401 && typeof window !== 'undefined') {
    // Attempt token refresh
    try {
      console.log('⏳ Access Token expired. Attempting token refresh...');
      const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        const newAccessToken = refreshData.accessToken;
        
        localStorage.setItem('accessToken', newAccessToken);
        
        // Retry original request
        headers.set('Authorization', `Bearer ${newAccessToken}`);
        const retryResponse = await fetch(finalUrl, { ...options, headers });
        return handleResponse(retryResponse);
      } else {
        // Refresh token failed/expired
        console.warn('❌ Session expired. Clearing local storage.');
        localStorage.removeItem('accessToken');
        // Optionally redirect to login in browser env
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } catch (refreshError) {
      console.error('❌ Token refresh failed:', refreshError);
    }
  }

  return handleResponse(response);
}

async function handleResponse(response: Response) {
  if (!response.ok) {
    let errMsg = 'Có lỗi xảy ra khi gọi API.';
    try {
      const errData = await response.json();
      errMsg = errData.message || errMsg;
    } catch (e) {
      // ignore
    }
    const error = new Error(errMsg) as Error & { status?: number };
    error.status = response.status;
    throw error;
  }
  
  if (response.status === 204) return null;
  return response.json();
}

export const apiClient = {
  get: (url: string, options?: RequestInit) => fetchWithAuth(url, { ...options, method: 'GET' }),
  post: (url: string, body?: any, options?: RequestInit) =>
    fetchWithAuth(url, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  put: (url: string, body?: any, options?: RequestInit) =>
    fetchWithAuth(url, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  delete: (url: string, options?: RequestInit) => fetchWithAuth(url, { ...options, method: 'DELETE' }),
};
