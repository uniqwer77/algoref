import type { DragEvent } from 'react';
import type { BlockType } from '../sidebar/catalog';
import { useBuilderStore } from '../store/builderStore';

export type DragPayload =
  | { kind: 'new'; type: BlockType }
  | { kind: 'move'; id: string };

let current: DragPayload | null = null;

export const getDrag = () => current;

export function startDrag(e: DragEvent, payload: DragPayload) {
  current = payload;
  e.dataTransfer.effectAllowed = payload.kind === 'new' ? 'copy' : 'move';
  e.dataTransfer.setData('text/plain', payload.kind); // Firefox не начнёт drag без setData
  document.body.dataset.cvDrag = 'true'; // CSS показывает зоны вставки в редакторе
}

export function endDrag() {
  current = null;
  delete document.body.dataset.cvDrag;
}

/** Выполнить drop: index — позиция вставки в текущем массиве блоков */
export function applyDrop(index: number) {
  const p = current;
  endDrag();
  if (!p) return;
  const { addBlock, moveBlockTo } = useBuilderStore.getState();
  if (p.kind === 'new') addBlock(p.type, index);
  else moveBlockTo(p.id, index);
}