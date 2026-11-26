import { create } from 'zustand';
import type { CoverBlock, ElementBox, ElementId, Offset, Size, TextId } from '../../../../core/types';
import type { BlockType } from '../sidebar/catalog';
import { createBlock } from '../../../../core/coverDefaults';
import { pushHistory, redoHistory, resetCoalescing, undoHistory } from './history';

type BlockPatch = Partial<Omit<CoverBlock, 'id' | 'type'>>;

interface BuilderState {
  blocks: CoverBlock[];
  selectedBlockId: string | null;
  preview: boolean;
  past: CoverBlock[][];
  future: CoverBlock[][];

  selectBlock: (id: string | null) => void;
  setPreview: (v: boolean) => void;
  loadLanding: (blocks: CoverBlock[]) => void;
  undo: () => void;
  redo: () => void;
  addBlock: (type: BlockType, index?: number) => void;
  updateBlock: (id: string, patch: BlockPatch, coalesceKey?: string) => void;
  updateContent: (id: string, key: TextId, html: string) => void;
  setElementBox: (id: string, el: ElementId, box: ElementBox) => void;
  moveBlock: (id: string, dir: -1 | 1) => void;
  moveBlockTo: (id: string, to: number) => void;
  moveElement: (id: string, el: ElementId, delta: Offset) => void;
  duplicateBlock: (id: string) => void;
  removeBlock: (id: string) => void;
  toggleBlockHidden: (id: string) => void;
}

const patchBlock = (blocks: CoverBlock[], id: string, fn: (b: CoverBlock) => CoverBlock) =>
  blocks.map((b) => (b.id === id ? fn(b) : b));

const sameOffset = (a?: Offset, b?: Offset) => (a?.x ?? 0) === (b?.x ?? 0) && (a?.y ?? 0) === (b?.y ?? 0);
const sameSize = (a?: Size, b?: Size) => a?.width === b?.width && a?.height === b?.height;

function commit(
  s: BuilderState,
  blocks: CoverBlock[],
  extra: Partial<BuilderState> = {},
  coalesceKey?: string,
): Partial<BuilderState> {
  return { blocks, ...pushHistory(s, s.blocks, coalesceKey), ...extra };
}

const validSelection = (blocks: CoverBlock[], id: string | null) =>
  id && blocks.some((b) => b.id === id) ? id : (blocks[0]?.id ?? null);

const initial = createBlock('cover');

export const useBuilderStore = create<BuilderState>()((set) => ({
  blocks: [initial],
  selectedBlockId: initial.id,
  preview: false,
  past: [],
  future: [],

  selectBlock: (id) => set({ selectedBlockId: id }),
  setPreview: (preview) => set({ preview }),

  loadLanding: (blocks) => {
    resetCoalescing(); // первая правка нового лендинга не должна слиться со старой
    set({ blocks, selectedBlockId: blocks[0]?.id ?? null, preview: false, past: [], future: [] });
  },

  undo: () =>
    set((s) => {
      const r = undoHistory(s, s.blocks);
      if (!r) return s;
      return {
        blocks: r.present,
        ...r.history,
        selectedBlockId: validSelection(r.present, s.selectedBlockId),
      };
    }),

  redo: () =>
    set((s) => {
      const r = redoHistory(s, s.blocks);
      if (!r) return s;
      return {
        blocks: r.present,
        ...r.history,
        selectedBlockId: validSelection(r.present, s.selectedBlockId),
      };
    }),

    addBlock: (type, index) =>
      set((s) => {
        const block = createBlock(type);
        const at = Math.min(index ?? s.blocks.length, s.blocks.length);
        const next = [...s.blocks.slice(0, at), block, ...s.blocks.slice(at)];
        return { ...commit(s, next), selectedBlockId: block.id };
      }),

  updateBlock: (id, patch, coalesceKey) =>
    set((s) => commit(s, patchBlock(s.blocks, id, (b) => ({ ...b, ...patch })), {}, coalesceKey)),

  updateContent: (id, key, html) =>
    set((s) => {
      if (s.blocks.find((b) => b.id === id)?.content[key] === html) return s;
      return commit(
        s,
        patchBlock(s.blocks, id, (b) => ({ ...b, content: { ...b.content, [key]: html } })),
        {},
        `content:${id}:${key}`,
      );
    }),

  setElementBox: (id, el, box) =>
    set((s) => {
      const block = s.blocks.find((b) => b.id === id);
      if (!block) return s;
      const offset = box.offset ?? block.offsets[el];
      const size = box.size ?? block.sizes[el];
      // Жест без реальных изменений не должен попадать в историю
      if (sameOffset(block.offsets[el], offset) && sameSize(block.sizes[el], size)) return s;
      return commit(
        s,
        patchBlock(s.blocks, id, (b) => ({
          ...b,
          offsets: offset ? { ...b.offsets, [el]: offset } : b.offsets,
          sizes: size ? { ...b.sizes, [el]: size } : b.sizes,
        })),
      );
    }),

  moveBlock: (id, dir) =>
    set((s) => {
      const i = s.blocks.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= s.blocks.length) return s;
      const next = [...s.blocks];
      [next[i], next[j]] = [next[j], next[i]];
      return commit(s, next);
    }),

    moveBlockTo: (id, to) =>
      set((s) => {
        const from = s.blocks.findIndex((b) => b.id === id);
        if (from < 0) return s;
        const target = to > from ? to - 1 : to;
        if (target === from) return s;
        const next = [...s.blocks];
        const [item] = next.splice(from, 1);
        next.splice(target, 0, item);
        return commit(s, next);
      }),

    moveElement: (id, el, delta) =>
    set((s) =>
      commit(
        s,
        patchBlock(s.blocks, id, (b) => {
          const cur = b.offsets[el] ?? { x: 0, y: 0 };
          return { ...b, offsets: { ...b.offsets, [el]: { x: cur.x + delta.x, y: cur.y + delta.y } } };
        }),
      ),
    ),

  duplicateBlock: (id) =>
    set((s) => {
      const i = s.blocks.findIndex((b) => b.id === id);
      if (i < 0) return s;
      const copy: CoverBlock = { ...structuredClone(s.blocks[i]), id: crypto.randomUUID() };
      const next = [...s.blocks];
      next.splice(i + 1, 0, copy);
      return commit(s, next, { selectedBlockId: copy.id });
    }),

  removeBlock: (id) =>
    set((s) => {
      const blocks = s.blocks.filter((b) => b.id !== id);
      const selectedBlockId = s.selectedBlockId === id ? (blocks[0]?.id ?? null) : s.selectedBlockId;
      return commit(s, blocks, { selectedBlockId });
    }),

  toggleBlockHidden: (id) =>
    set((s) => {
      if (!s.blocks.some((b) => b.id === id)) return s;
      return commit(s, patchBlock(s.blocks, id, (b) => ({ ...b, hidden: !b.hidden })));
    }),
}));
