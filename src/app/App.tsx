import { useEffect } from 'react';
import { Canvas } from '../features/builder/components/Canvas';
import { useBuilderStore } from '../features/builder/store/builderStore';
import styles from './App.module.css';

export default function App() {
  const preview = useBuilderStore((s) => s.preview);

  // Ctrl/Cmd+Z — назад, Ctrl/Cmd+Shift+Z или Ctrl+Y — вперёд.
  // e.code, а не e.key — чтобы работало и в русской раскладке.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
      const { undo, redo } = useBuilderStore.getState();
      if (e.code === 'KeyZ' && !e.shiftKey) undo();
      else if ((e.code === 'KeyZ' && e.shiftKey) || e.code === 'KeyY') redo();
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.body} data-preview={preview}>
        <main className={styles.stage}>
          <Canvas />
        </main>
      </div>
    </div>
  );
}
