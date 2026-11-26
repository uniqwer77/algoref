import { useMemo, useState } from 'react';
import { ChevronDown, Search, Star } from 'lucide-react';
import { CATALOG } from './catalog';
import { startDrag, endDrag } from '../dnd/dnd';
import { useBuilderStore } from '../store/builderStore';
import styles from './Sidebar.module.css';

export function BlocksTab() {
  const addBlock = useBuilderStore((s) => s.addBlock);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const map = new Map<string, typeof CATALOG>();
    for (const item of CATALOG) {
      if (q && !`${item.title} ${item.hint}`.toLowerCase().includes(q)) continue;
      map.set(item.category, [...(map.get(item.category) ?? []), item]);
    }
    return [...map.entries()];
  }, [query]);

  return (
    <>
      <label className={styles.search}>
        <Search size={15} />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Найти блок..." />
      </label>

      {groups.length === 0 && <p className={styles.empty}>Ничего не найдено</p>}

      {groups.map(([category, items]) => (
        <section key={category} className={styles.group}>
          <button
            className={styles.groupHead}
            onClick={() => setCollapsed((c) => ({ ...c, [category]: !c[category] }))}
          >
            {category}
            <ChevronDown size={14} data-collapsed={collapsed[category] ? 'true' : undefined} />
          </button>

          {!collapsed[category] && (
            <div className={styles.grid}>
              {items.map(({ type, title, hint, icon: Icon, isNew }) => (
                <div
                  key={type}
                  className={styles.card}
                  draggable
                  tabIndex={0}
                  onDragStart={(e) => startDrag(e, { kind: 'new', type })}
                  onDragEnd={endDrag}
                  onClick={() => addBlock(type)}
                  onKeyDown={(e) => e.key === 'Enter' && addBlock(type)}
                >
                  {isNew && <Star size={10} className={styles.star} fill="currentColor" />}
                  <div className={styles.preview}><Icon size={20} /></div>
                  <b>{title}</b>
                  <span>{hint}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </>
  );
}