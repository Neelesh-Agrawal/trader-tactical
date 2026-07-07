/** App subpath prefix, e.g. `/easyoptionlearning` in production. */
export const getAppBasePath = (): string => {
  const base = import.meta.env.BASE_URL || '/';
  if (base === '/') return '';
  return base.endsWith('/') ? base.slice(0, -1) : base;
};

/** Build a browser URL path that includes the Vite base prefix. */
export const toAppPath = (path: string): string => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const base = getAppBasePath();
  return `${base}${normalized}`;
};
