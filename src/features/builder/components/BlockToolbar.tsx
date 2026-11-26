import { ArrowDown, ArrowLeftRight, ArrowUp, Copy,  GraduationCap, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { COVER_PRESETS, findPreset } from '../blocks/cover/presets';
import type { CoverBlock } from '../../../../core/types';
import styles from './BlockToolbar.module.css';

interface Props { block: CoverBlock; index: number; total: number }

export function BlockToolbar({ block, index, total }: Props) {
  const { updateBlock, moveBlock, duplicateBlock, removeBlock } =
    useBuilderStore.getState();

  const preset = findPreset(block);
  const nextPreset = COVER_PRESETS[(COVER_PRESETS.indexOf(preset) + 1) % COVER_PRESETS.length];

  return (
    <div
      className={styles.toolbar}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className={styles.title}><GraduationCap size={14} /> Обложка</span>
      <i className={styles.sep} />
      <button title="Выше" disabled={index === 0} onClick={() => moveBlock(block.id, -1)}><ArrowUp size={15} /></button>
      <button title="Ниже" disabled={index === total - 1} onClick={() => moveBlock(block.id, 1)}><ArrowDown size={15} /></button>
      <button
        className={styles.variant}
        title="Следующая вариация"
        onClick={() => updateBlock(block.id, { layout: nextPreset.layout, theme: nextPreset.theme })}
      >
        <ArrowLeftRight size={15} /> {preset.label}
      </button>
      <button title="Дублировать" onClick={() => duplicateBlock(block.id)}><Copy size={15} /></button>
      <button title="Удалить" onClick={() => removeBlock(block.id)}><Trash2 size={15} /></button>
    </div>
  );
}
