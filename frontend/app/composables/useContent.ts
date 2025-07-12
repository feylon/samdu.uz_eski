import type {
  AnnouncementItem,
  AnnouncementType,
  FacultyItem,
  FacultyStats,
  NewsItem,
  Paginated,
  SlideItem,
} from '~/types/api';

interface NewsQuery {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;
}

interface AnnouncementQuery {
  page?: number;
  limit?: number;
  type?: AnnouncementType;
  upcoming?: boolean;
  search?: string;
}

const clean = <T extends object>(value: T) =>
  Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined && item !== '' && item !== null));

export function useNewsList(query: MaybeRefOrGetter<NewsQuery> = {}) {
  const { locale } = useI18n();
  return useApiFetch<Paginated<NewsItem>>('/news', {
    query: computed(() => clean({ lang: locale.value, ...toValue(query) })),
  });
}

export function useNewsItem(slug: MaybeRefOrGetter<string>) {
  const { locale } = useI18n();
  return useApiFetch<NewsItem>(() => `/news/${encodeURIComponent(toValue(slug))}`, {
    query: computed(() => ({ lang: locale.value })),
  });
}

export function useAnnouncementsList(query: MaybeRefOrGetter<AnnouncementQuery> = {}) {
  const { locale } = useI18n();
  return useApiFetch<Paginated<AnnouncementItem>>('/announcements', {
    query: computed(() => clean({ lang: locale.value, ...toValue(query) })),
  });
}

export function useAnnouncementItem(slug: MaybeRefOrGetter<string>) {
  const { locale } = useI18n();
  return useApiFetch<AnnouncementItem>(() => `/announcements/${encodeURIComponent(toValue(slug))}`, {
    query: computed(() => ({ lang: locale.value })),
  });
}

export function useFaculties() {
  const { locale } = useI18n();
  return useApiFetch<FacultyItem[]>('/faculties', {
    query: computed(() => ({ lang: locale.value })),
  });
}

export function useFacultyItem(slug: MaybeRefOrGetter<string>) {
  const { locale } = useI18n();
  return useApiFetch<FacultyItem>(() => `/faculties/${encodeURIComponent(toValue(slug))}`, {
    query: computed(() => ({ lang: locale.value })),
  });
}

export function useFacultyStats() {
  return useApiFetch<FacultyStats>('/faculties/stats');
}

export function useSlides() {
  const { locale } = useI18n();
  return useApiFetch<SlideItem[]>('/sliders', {
    query: computed(() => ({ lang: locale.value })),
  });
}
