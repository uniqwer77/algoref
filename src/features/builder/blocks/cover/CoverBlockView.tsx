import { useState } from 'react';
import type { ReactNode } from 'react';
import { useBuilderStore } from '../../store/builderStore';
import { ResizableElement } from '../../components/ResizableElement';
import { BlockToolbar } from '../../components/BlockToolbar';
import { RichText } from '../../editor/RichText';
import { CoverSection } from '../../../../../core/CoverSection';
import type { CoverBlock, ElementId, Size, TextId } from '../../../../../core/types';
import '../../../../../core/cover.css';

const TEXT_SIZES: Record<TextId, number> = {
  eyebrow: 13, title: 56, subtitle: 20, primaryButton: 16, secondaryButton: 16,
};

/** Ниже этих размеров элементы теряют читаемость */
const MIN_SIZE: Record<ElementId, Size> = {
  eyebrow: { width: 96, height: 20 },
  title: { width: 140, height: 32 },
  subtitle: { width: 140, height: 24 },
  primaryButton: { width: 110, height: 36 },
  secondaryButton: { width: 110, height: 36 },
  badges: { width: 120, height: 24 },
  image: { width: 120, height: 90 },
};

interface Props { block: CoverBlock; index: number; total: number }

export function CoverBlockView({ block, index, total }: Props) {
  const selected = useBuilderStore((s) => s.selectedBlockId === block.id);
  const preview = useBuilderStore((s) => s.preview);
  const selectBlock = useBuilderStore((s) => s.selectBlock);
  const updateContent = useBuilderStore((s) => s.updateContent);
  const setElementBox = useBuilderStore((s) => s.setElementBox);

  const [editingId, setEditingId] = useState<TextId | null>(null);
  const interactive = !preview;

  const boundsSelector = `[data-block-id="${CSS.escape(block.id)}"]`;

  const renderElement = (
    id: ElementId,
    node: ReactNode,
    extra?: { fullWidth?: boolean; lockAspectRatio?: boolean },
  ) => (
    <ResizableElement
      bounds={boundsSelector}
      offset={block.offsets[id]}
      size={block.sizes[id]}
      minWidth={MIN_SIZE[id].width}
      minHeight={MIN_SIZE[id].height}
      align={block.layout === 'center' ? 'center' : 'start'}
      disabled={!interactive || editingId === id}
      raised={editingId === id}
      onChange={(box) => setElementBox(block.id, id, box)}
      {...extra}
    >
      {node}
    </ResizableElement>
  );

  const renderText = (id: TextId, className: string) => (
    <RichText
      value={block.content[id]}
      onChange={(html) => updateContent(block.id, id, html)}
      editable={interactive}
      editing={interactive && editingId === id}
      onEditingChange={(e) => setEditingId(e ? id : null)}
      baseSize={TEXT_SIZES[id]}
      className={className}
    />
  );

  return (
    <div data-selected={selected && interactive} onPointerDown={() => selectBlock(block.id)}>
      <CoverSection
        block={block}
        toolbar={selected && interactive && <BlockToolbar block={block} index={index} total={total} />}
        renderElement={renderElement}
        renderText={renderText}
      />
    </div>
  );
}
