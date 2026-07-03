const DEFAULT_API_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname.endsWith('.vercel.app')
    ? 'https://backend-livid-kappa-26.vercel.app'
    : 'http://localhost:5004';

export const API_BASE_URL = process.env.REACT_APP_API_URL || DEFAULT_API_BASE_URL;
