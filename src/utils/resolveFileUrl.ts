const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function resolveFileUrl(path: string) {
  if (!path) {
    return apiBaseUrl;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalizedPath, apiBaseUrl).toString();
}
