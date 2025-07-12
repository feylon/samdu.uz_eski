export type LocaleCode = 'uz' | 'ru' | 'en';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface NewsItem {
  id: string;
  slug: string;
  locale: LocaleCode;
  title: string;
  summary: string | null;
  content?: string;
  coverImage: string | null;
  category: string;
  isFeatured: boolean;
  views: number;
  publishedAt: string;
  availableLocales: LocaleCode[];
}

export type AnnouncementType = 'notice' | 'event' | 'admission' | 'conference' | 'vacancy';

export interface AnnouncementItem {
  id: string;
  slug: string;
  locale: LocaleCode;
  type: AnnouncementType;
  title: string;
  summary: string | null;
  content?: string;
  location: string | null;
  coverImage: string | null;
  eventDate: string | null;
  deadline: string | null;
  isPinned: boolean;
  publishedAt: string;
}

export interface DepartmentItem {
  id: string;
  name: string;
  description: string | null;
  headName: string | null;
  phone: string | null;
  email: string | null;
}

export interface FacultyItem {
  id: string;
  slug: string;
  locale: LocaleCode;
  name: string;
  shortDescription: string | null;
  description?: string | null;
  deanName: string | null;
  address: string | null;
  image: string | null;
  icon: string | null;
  phone: string | null;
  email: string | null;
  studentsCount: number;
  departmentsCount: number;
  departments?: DepartmentItem[];
}

export interface FacultyStats {
  faculties: number;
  departments: number;
  students: number;
}

export interface MenuItem {
  id: string;
  title: string;
  url: string | null;
  icon: string | null;
  isExternal: boolean;
  children: MenuItem[];
}

export type MenuLocation = 'header' | 'topbar' | 'footer';

export interface SlideItem {
  id: string;
  locale: LocaleCode;
  image: string;
  link: string | null;
  title: string;
  subtitle: string | null;
  buttonText: string | null;
}
