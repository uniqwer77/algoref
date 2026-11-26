import type { ReactNode } from 'react';
import { cx } from '../../../../core/cx';
import styles from './controls.module.css';

export const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className={styles.section}>
    <h3 className={styles.sectionTitle}>{title}</h3>
    {children}
  </section>
);

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
  <div className={styles.field}>
    <span className={styles.label}>{label}</span>
    {children}
  </div>
);

interface SegmentedProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className={styles.segmented}>
      {options.map((o) => (
        <button key={o.value} className={cx(o.value === value && styles.active)} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

interface SwitchProps { checked: boolean; label: string; onChange: (v: boolean) => void }

export const Switch = ({ checked, label, onChange }: SwitchProps) => (
  <label className={styles.switchRow}>
    <span className={styles.label}>{label}</span>
    <button
      role="switch"
      aria-checked={checked}
      className={cx(styles.switch, checked && styles.switchOn)}
      onClick={() => onChange(!checked)}
    >
      <i />
    </button>
  </label>
);
