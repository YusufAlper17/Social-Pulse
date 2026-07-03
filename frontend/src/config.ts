function getDefaultApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost:5004';
  }

  const { hostname } = window.location;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5004';
  }

  return '';
}

export const API_BASE_URL = process.env.REACT_APP_API_URL || getDefaultApiBaseUrl();
