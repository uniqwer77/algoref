export type TextId = 'eyebrow' | 'title' | 'subtitle' | 'primaryButton' | 'secondaryButton';
export type ElementId = TextId | 'badges' | 'image';

export interface Offset { x: number; y: number }

export interface Size { width: number; height: number }
export interface ElementBox {
  offset?: Offset;
  size?: Size;
}

export type Layout = 'split' | 'center';
export type Theme = 'dark' | 'light';
export type Spacing = 'compact' | 'normal' | 'spacious';

export interface ImageData {
  src?: string;
  width?: number | string;
  height?: number | string;
}

export interface CoverBlock {
  id: string;
  type: 'cover';
  layout: Layout;
  theme: Theme;
  spacing: Spacing;
  showImage: boolean;
  content: Record<TextId, string>;
  badges: string[];
  offsets: Partial<Record<ElementId, Offset>>;
  sizes: Partial<Record<ElementId, Size>>;
  image: ImageData;
  hidden: boolean;
}
