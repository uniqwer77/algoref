import type { LucideIcon } from 'lucide-react';
import { AppWindow, Zap, GraduationCap, FileText, MousePointer2, Image, LayoutGrid, Monitor, Play, GalleryHorizontal } from 'lucide-react';

export type BlockType =
  | 'leadForm' | 'pricing' | 'freeCanvas' | 'fullImage' | 'cover'
  | 'cta' | 'carousel' | 'grid' | 'platform' | 'media';

export interface CatalogItem {
  type: BlockType;
  title: string;
  hint: string;
  icon: LucideIcon;
  category: string;
  isNew?: boolean;
}

export const CATALOG: CatalogItem[] = [
  { type: 'leadForm',   title: 'Лид-форма',        hint: 'Сбор заявок · ядро воронки',        icon: FileText,          category: 'Главное', isNew: true },
  { type: 'pricing',    title: 'Пакеты цен',       hint: 'Тарифы со скидками',                icon: AppWindow,         category: 'Главное' },
  { type: 'freeCanvas', title: 'Свободный холст',  hint: 'Объекты · drag · размер · шрифт',   icon: MousePointer2,     category: 'Первый экран', isNew: true },
  { type: 'fullImage',  title: 'Фото на всю ширину', hint: 'Полноэкранный баннер · загрузка фото', icon: Image,        category: 'Первый экран' },
  { type: 'cover',      title: 'Обложка',          hint: 'Заголовок, оффер, кнопки',          icon: GraduationCap,     category: 'Первый экран' },
  { type: 'cta',        title: 'Кнопка / CTA',     hint: 'Призыв к действию',                 icon: Zap,               category: 'Первый экран' },
  { type: 'carousel',   title: 'Карусель курсов',  hint: 'Карточки с тарифами · клик → детали', icon: GalleryHorizontal, category: 'Контент' },
  { type: 'grid',       title: 'Шахматка курсов',  hint: 'Сетка карточек · бейджи · цена',    icon: LayoutGrid,        category: 'Контент' },
  { type: 'platform',   title: 'О платформе',      hint: 'Экран платформы + выгоды',          icon: Monitor,           category: 'Контент' },
  { type: 'media',      title: 'Видео и фото',     hint: 'Ролик + галерея с занятий',         icon: Play,              category: 'Контент' },
];

export const CATALOG_BY_TYPE = Object.fromEntries(CATALOG.map((c) => [c.type, c])) as Record<BlockType, CatalogItem>;