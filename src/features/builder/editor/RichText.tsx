import { useEffect, useRef } from 'react';
import { EditorContent } from '@tiptap/react';
import { cx } from '../../../../core/cx';
import { useRichEditor } from './useRichEditor';
import { RichTextToolbar } from './RichTextToolbar';
import styles from './RichText.module.css';

interface Props {
  value: string;
  onChange: (html: string) => void;
  editable: boolean;
  editing: boolean;
  onEditingChange: (editing: boolean) => void;
  baseSize: number;
  className?: string;
}

export function RichText({ value, onChange, editable, editing, onEditingChange, baseSize, className }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const editor = useRichEditor(value, onChange, false);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(editing, false);
    if (editing) editor.commands.focus('end');
  }, [editor, editing]);

  return (
    <div
      ref={wrapRef}
      className={cx(styles.root, editing && styles.editing, className)}
      onDoubleClick={() => editable && !editing && onEditingChange(true)}
      onBlur={(e) => {
        if (editing && !wrapRef.current?.contains(e.relatedTarget as Node | null)) {
          onEditingChange(false);
        }
      }}
    >
      <EditorContent editor={editor} />
      {editing && editor && (
        <RichTextToolbar editor={editor} baseSize={baseSize} onDone={() => onEditingChange(false)} />
      )}
    </div>
  );
}
