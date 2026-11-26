import { EditorContent } from '@tiptap/react';
import { useRichEditor } from './useRichEditor';
import styles from './RichField.module.css';

interface Props { value: string; onChange: (html: string) => void }

/** Мини-Tiptap без тулбара для полей правой панели (хранит тот же HTML, что и холст). */
export function RichField({ value, onChange }: Props) {
  const editor = useRichEditor(value, onChange, true);
  return (
    <div className={styles.field}>
      <EditorContent editor={editor} />
    </div>
  );
}
