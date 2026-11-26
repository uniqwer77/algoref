import { useState } from 'react';
import { Copy, Eye, EyeOff, GripVertical, Trash2 } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { CATALOG_BY_TYPE } from './catalog';
import { applyDrop, endDrag, getDrag, startDrag } from '../dnd/dnd';
import styles from './Sidebar.module.css';

export function StructureTab() {
  const blocks = useBuilderStore((s) => s.blocks);
  const selectedId = useBuilderStore((s) => s.selectedBlockId);
  const { selectBlock, toggleBlockHidden, duplicateBlock, removeBlock } = useBuilderStore.getState();

  // индекс, перед которым будет вставлен блок (0..blocks.length)
  const [overIndex, setOverIndex] = useState<number | null>(null);

  return (
    <ul
      className={styles.list}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOverIndex(null);
      }}
      onDragOver={(e) => {
        // курсор в пустой области под списком — вставка в конец
        if (getDrag() && e.target === e.currentTarget) {
          e.preventDefault();
          setOverIndex(blocks.length);
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        if (overIndex !== null) applyDrop(overIndex);
        setOverIndex(null);
      }}
    >
      {blocks.map((block, i) => {
        const meta = CATALOG_BY_TYPE[block.type];
        const Icon = meta.icon;
        return (
          <li
            key={block.id}
            className={styles.row}
            data-selected={block.id === selectedId ? 'true' : undefined}
            data-hidden={block.hidden ? 'true' : undefined}
            data-drop={
              overIndex === i ? 'before' : i === blocks.length - 1 && overIndex === blocks.length ? 'after' : undefined
            }
            draggable
            tabIndex={0}
            onClick={() => selectBlock(block.id)}
            onKeyDown={(e) => e.key === 'Enter' && selectBlock(block.id)}
            onDragStart={(e) => startDrag(e, { kind: 'move', id: block.id })}
            onDragEnd={() => {
              endDrag();
              setOverIndex(null);
            }}
            onDragOver={(e) => {
              if (!getDrag()) return;
              e.preventDefault();
              const r = e.currentTarget.getBoundingClientRect();
              setOverIndex(i + (e.clientY > r.top + r.height / 2 ? 1 : 0));
            }}
          >
            <GripVertical size={14} className={styles.grip} />
            <Icon size={15} className={styles.rowIcon} />
            <span className={styles.rowTitle}>{meta.title}</span>

            <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
              <button
                title={block.hidden ? 'Показать' : 'Скрыть'}
                onClick={() => toggleBlockHidden(block.id)}
              >
                {block.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button title="Дублировать" onClick={() => duplicateBlock(block.id)}>
                <Copy size={14} />
              </button>
              <button title="Удалить" onClick={() => removeBlock(block.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}