export function useMediaUrl() {
  const config = useRuntimeConfig();
  return (path?: string | null, fallback = '/images/placeholder.svg') => {
    if (!path) return fallback;
    if (/^https?:\/\//.test(path)) return path;
    if (path.startsWith('/uploads/')) return `${config.public.mediaBase}${path}`;
    return path;
  };
}
