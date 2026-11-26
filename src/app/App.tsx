import { useEffect } from 'react';
import { Canvas } from '../features/builder/components/Canvas';
import { TopBar } from '../features/builder/components/TopBar';
import { CoverSettingsPanel } from '../features/builder/blocks/cover/CoverSettingsPanel';
import { Sidebar } from '../features/builder/sidebar/Sidebar';
import { useBuilderStore } from '../features/builder/store/builderStore';
import styles from './App.module.css';

export default function App() {
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
      <TopBar />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.stage}>
          <Canvas />
        </main>
        <CoverSettingsPanel />
      </div>
    </div>
  );
}
