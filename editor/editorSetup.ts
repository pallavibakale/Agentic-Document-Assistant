import { keymap } from 'prosemirror-keymap';
import { history, undo, redo } from 'prosemirror-history';
import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { Plugin } from 'prosemirror-state';
import { documentSchema } from './schema';

export const buildPlugins = (): Plugin[] => {
  const plugins = [
    history(),
    keymap({
      "Mod-z": undo,
      "Mod-y": redo,
      "Mod-Shift-z": redo,
      "Mod-b": toggleMark(documentSchema.marks.strong),
      "Mod-i": toggleMark(documentSchema.marks.em),
    }),
    keymap(baseKeymap),
  ];
  return plugins;
};
