import StarterKit from '@tiptap/starter-kit';
import { TextStyle, Color, FontSize } from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';

export const extensions = [
  StarterKit.configure({
    heading: false,
    blockquote: false,
    bulletList: false,
    orderedList: false,
    listItem: false,
    codeBlock: false,
    code: false,
    horizontalRule: false,
    strike: false,
    link: false,
  }),
  TextStyle,
  Color,
  FontSize,
  TextAlign.configure({ types: ['paragraph'] }),
];
