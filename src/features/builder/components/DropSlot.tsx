import { useState } from 'react';
import { applyDrop, getDrag } from '../dnd/dnd';
import styles from '../sidebar/SideBar.module.css';

export function DropSlot({ index }: { index: number }) {
  const [over, setOver] = useState(false);

  return (
    <div
      className={styles.slot}
      data-over={over ? 'true' : undefined}
      onDragOver={(e) => {
        if (!getDrag()) return;
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        applyDrop(index);
      }}
    />
  );
}