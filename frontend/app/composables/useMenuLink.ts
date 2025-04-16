import type { MenuItem } from '~/types/api';

export function useMenuLink() {
  const localePath = useLocalePath();

  return (item: Pick<MenuItem, 'url' | 'isExternal'>) => {
    if (!item.url) return { to: undefined, external: false };
    if (item.isExternal || /^https?:\/\//.test(item.url)) {
      return { to: item.url, external: true };
    }
    return { to: localePath(item.url), external: false };
  };
}
