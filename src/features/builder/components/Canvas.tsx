import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { useBuilderStore } from '../store/builderStore';
import { CoverBlockView } from '../blocks/cover/CoverBlockView';
import type { ElementId } from '../../../../core/types';
import styles from './Canvas.module.css';

export function Canvas() {
  const blocks = useBuilderStore((s) => s.blocks);
  const moveElement = useBuilderStore((s) => s.moveElement);
  const addCover = useBuilderStore((s) => s.addCover);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragEnd = ({ active, delta }: DragEndEvent) => {
    const [blockId, el] = String(active.id).split(':');
    moveElement(blockId, el as ElementId, { x: delta.x, y: delta.y });
  };

  if (blocks.length === 0) {
    return (
      <div className={styles.empty}>
        <button onClick={addCover}>Добавить блок «Обложка»</button>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} onDragEnd={onDragEnd}>
      {blocks.map((block, i) => (
        <CoverBlockView key={block.id} block={block} index={i} total={blocks.length} />
      ))}
    </DndContext>
  );
}
