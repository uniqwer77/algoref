import { useState } from 'react';
import { Plus, Rows3 } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import { BlocksTab } from './BlocksTab';
import { StructureTab } from './StructureTab';
import styles from './Sidebar.module.css';

export function Sidebar() {
  const [tab, setTab] = useState<'blocks' | 'structure'>('blocks');
  const count = useBuilderStore((s) => s.blocks.length);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.tabs} role="tablist">
        <button role="tab" aria-selected={tab === 'blocks'} data-active={tab === 'blocks'} onClick={() => setTab('blocks')}>
          <Plus size={14} /> Блоки
        </button>
        <button role="tab" aria-selected={tab === 'structure'} data-active={tab === 'structure'} onClick={() => setTab('structure')}>
          <Rows3 size={14} /> Структура
          <span className={styles.count}>{count}</span>
        </button>
      </div>

      <div className={styles.body}>{tab === 'blocks' ? <BlocksTab /> : <StructureTab />}</div>
    </aside>
  );
}