import { GraduationCap, RotateCcw } from 'lucide-react';
import { useBuilderStore } from '../../store/builderStore';
import { RichField } from '../../editor/RichField';
import { Field, Section, Segmented, Switch } from '../../ui/controls';
import { COVER_PRESETS, findPreset } from './presets';
import type { Spacing, Theme } from '../../../../../core/types';
import styles from './settings.module.css';

export function CoverSettingsPanel() {
  const block = useBuilderStore((s) => s.blocks.find((b) => b.id === s.selectedBlockId));
  const updateBlock = useBuilderStore((s) => s.updateBlock);
  const updateContent = useBuilderStore((s) => s.updateContent);

  if (!block) {
    return (
      <aside className={styles.panel}>
        <p className={styles.empty}>Выберите блок на холсте, чтобы изменить его настройки.</p>
      </aside>
    );
  }

  const active = findPreset(block);
  const field = (key: Parameters<typeof updateContent>[1]) => (
    <RichField key={`${block.id}:${key}`} value={block.content[key]} onChange={(html) => updateContent(block.id, key, html)} />
  );

  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <span className={styles.icon}><GraduationCap size={18} /></span>
        <div>
          <h2>Обложка</h2>
          <p>Двойной клик по тексту — правка, перетаскивание — положение</p>
        </div>
      </header>

      <Section title={`Вариации блока · ${COVER_PRESETS.length}`}>
        <div className={styles.presets}>
          {COVER_PRESETS.map((p, i) => (
            <button
              key={p.id}
              className={p.id === active.id ? styles.presetOn : undefined}
              onClick={() => updateBlock(block.id, { layout: p.layout, theme: p.theme })}
            >
              <b>{i + 1}</b> {p.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Содержание">
        <Field label="Надзаголовок">{field('eyebrow')}</Field>
        <Field label="Заголовок">{field('title')}</Field>
        <Field label="Подзаголовок">{field('subtitle')}</Field>
      </Section>

      <Section title="Кнопки">
        <Field label="Основная кнопка">{field('primaryButton')}</Field>
        <Field label="Вторая кнопка">{field('secondaryButton')}</Field>
      </Section>

      <Section title="Внешний вид">
        <Field label="Тема">
          <Segmented<Theme>
            value={block.theme}
            options={[{ value: 'dark', label: 'Тёмная' }, { value: 'light', label: 'Светлая' }]}
            onChange={(theme) => updateBlock(block.id, { theme })}
          />
        </Field>
        <Switch label="Изображение справа" checked={block.showImage} onChange={(showImage) => updateBlock(block.id, { showImage })} />
      </Section>

      <Section title="Размер и отступы">
        <Field label="Вертикальные отступы">
          <Segmented<Spacing>
            value={block.spacing}
            options={[
              { value: 'compact', label: 'Плотно' },
              { value: 'normal', label: 'Обычно' },
              { value: 'spacious', label: 'Просторно' },
            ]}
            onChange={(spacing) => updateBlock(block.id, { spacing })}
          />
        </Field>
        <button className={styles.reset} onClick={() => updateBlock(block.id, { offsets: {}, sizes: {} })}>
          <RotateCcw size={14} /> Сбросить положение и размер элементов
        </button>
      </Section>
    </aside>
  );
}
