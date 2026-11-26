import type { CoverBlock, Layout, Theme } from '../../../../../core/types';

export interface CoverPreset { id: string; label: string; layout: Layout; theme: Theme }

export const COVER_PRESETS: CoverPreset[] = [
  { id: 'dark-split', label: 'Тёмная + обложка', layout: 'split', theme: 'dark' },
  { id: 'light-split', label: 'Светлая + обложка', layout: 'split', theme: 'light' },
  { id: 'dark-center', label: 'Тёмная по центру', layout: 'center', theme: 'dark' },
  { id: 'light-center', label: 'Светлая по центру', layout: 'center', theme: 'light' },
];

export const findPreset = (b: Pick<CoverBlock, 'layout' | 'theme'>) =>
  COVER_PRESETS.find((p) => p.layout === b.layout && p.theme === b.theme) ?? COVER_PRESETS[0];
