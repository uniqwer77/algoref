import { useEffect, useRef } from 'react';
import { useEditor } from '@tiptap/react';
import { extensions } from './extensions';

/** Общий хук: Tiptap-редактор, синхронизированный со значением из стора (HTML). */
export function useRichEditor(value: string, onChange: (html: string) => void, editable: boolean) {
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const editor = useEditor({
    extensions,
    content: value,
    editable,
    onUpdate: ({ editor }) => onChangeRef.current(editor.getHTML()),
  });

  // Внешнее изменение (например, из правой панели) -> обновляем редактор,
  // но только если пользователь сейчас не печатает именно в нём.
  useEffect(() => {
    if (editor && !editor.isFocused && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return editor;
}
