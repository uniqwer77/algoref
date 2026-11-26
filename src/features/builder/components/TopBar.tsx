import { Plus, Redo2, Undo2 } from 'lucide-react';
import { useBuilderStore } from '../store/builderStore';
import styles from './TopBar.module.css';

export function TopBar() {
  const canUndo = useBuilderStore((s) => s.past.length > 0);
  const canRedo = useBuilderStore((s) => s.future.length > 0);
  const { undo, redo, addBlock } = useBuilderStore.getState();

  return (
    <header
      className={styles.bar}
      onMouseDown={(e) => e.preventDefault()}
    >
      <span className={styles.brand}>Конструктор лендинга</span>

      <div className={styles.group}>
        <button title="Назад (Ctrl+Z)" disabled={!canUndo} onClick={undo}>
          <Undo2 size={16} /> Назад
        </button>
        <button title="Вперёд (Ctrl+Shift+Z)" disabled={!canRedo} onClick={redo}>
          <Redo2 size={16} /> Вперёд
        </button>
      </div>

      <div className={styles.group}>
        <button onClick={() => addBlock('cover')}>
          <Plus size={16} /> Добавить блок «Обложка»
        </button>
      </div>

      <div className={styles.spacer} />
    </header>
  );
}
