import { useEditorState } from '@tiptap/react';
import type { Editor } from '@tiptap/react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Check, Italic, Minus, Plus, Underline, Undo2 } from 'lucide-react';
import { cx } from '../../../../core/cx';
import styles from './RichTextToolbar.module.css';

type Chain = ReturnType<Editor['chain']>;

const SWATCHES = ['#0f0f12', '#55536a', '#9b99aa', '#ffffff', '#8d4dff'];

interface Props { editor: Editor; baseSize: number; onDone: () => void }

export function RichTextToolbar({ editor, baseSize, onDone }: Props) {
  const st = useEditorState({
    editor,
    selector: ({ editor }) => {
      const ts = editor.getAttributes('textStyle');
      return {
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        underline: editor.isActive('underline'),
        align: (['center', 'right'] as const).find((a) => editor.isActive({ textAlign: a })) ?? 'left',
        size: parseInt(ts.fontSize ?? '', 10) || baseSize,
        color: (ts.color as string | undefined) ?? null,
      };
    },
  });

  // Если выделения нет — форматирование применяется ко всему тексту элемента
  const apply = (fn: (c: Chain) => Chain) => {
    const chain = editor.chain().focus();
    if (editor.state.selection.empty) chain.selectAll();
    fn(chain).run();
  };
  const setSize = (n: number) => apply((c) => c.setFontSize(`${Math.min(120, Math.max(10, n))}px`));

  return (
    <div
      className={styles.toolbar}
      // не даём редактору потерять фокус при клике по кнопкам (кроме нативного color picker)
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).tagName !== 'INPUT') e.preventDefault();
      }}
      onDoubleClick={(e) => e.stopPropagation()}
    >
      <button title="Меньше" onClick={() => setSize(st.size - 2)}><Minus size={14} /></button>
      <span className={styles.size}>{st.size}</span>
      <button title="Больше" onClick={() => setSize(st.size + 2)}><Plus size={14} /></button>
      <i className={styles.sep} />
      <button className={cx(st.bold && styles.on)} title="Жирный" onClick={() => apply((c) => c.toggleBold())}><Bold size={14} /></button>
      <button className={cx(st.italic && styles.on)} title="Курсив" onClick={() => apply((c) => c.toggleItalic())}><Italic size={14} /></button>
      <button className={cx(st.underline && styles.on)} title="Подчёркнутый" onClick={() => apply((c) => c.toggleUnderline())}><Underline size={14} /></button>
      <i className={styles.sep} />
      <button className={cx(st.align === 'left' && styles.on)} title="По левому краю" onClick={() => apply((c) => c.setTextAlign('left'))}><AlignLeft size={14} /></button>
      <button className={cx(st.align === 'center' && styles.on)} title="По центру" onClick={() => apply((c) => c.setTextAlign('center'))}><AlignCenter size={14} /></button>
      <button className={cx(st.align === 'right' && styles.on)} title="По правому краю" onClick={() => apply((c) => c.setTextAlign('right'))}><AlignRight size={14} /></button>
      <i className={styles.sep} />
      {SWATCHES.map((hex) => (
        <button
          key={hex}
          title={hex}
          className={cx(styles.swatch, st.color === hex && styles.on)}
          style={{ background: hex }}
          onClick={() => apply((c) => c.setColor(hex))}
        />
      ))}
      <input
        type="color"
        className={styles.picker}
        title="Свой цвет"
        value={st.color ?? '#ffffff'}
        onChange={(e) => apply((c) => c.setColor(e.target.value))}
      />
      <i className={styles.sep} />
      <button title="Отменить" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={14} /></button>
      <button title="Готово" onClick={onDone}><Check size={14} /></button>
    </div>
  );
}
