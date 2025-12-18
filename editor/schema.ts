import { Schema, NodeSpec, MarkSpec, DOMOutputSpec } from 'prosemirror-model';

// Strict schema: doc -> section+ -> (heading, paragraph+)

const nodes: { [name: string]: NodeSpec } = {
  doc: {
    content: "section+"
  },
  section: {
    content: "heading paragraph+",
    isolating: true, // Helps PM treat this as a block unit
    group: "block",
    parseDOM: [{ tag: "section" }],
    toDOM(): DOMOutputSpec {
      return ["section", { class: "mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-200 transition-colors group relative" }, 0];
    }
  },
  heading: {
    content: "text*",
    group: "block",
    marks: "", // No bold/italic in headings for this strict schema
    parseDOM: [{ tag: "h2" }],
    toDOM(): DOMOutputSpec {
      return ["h2", { class: "text-xl font-bold text-gray-900 mb-3 border-b pb-2 border-gray-100" }, 0];
    }
  },
  paragraph: {
    content: "text*",
    group: "block",
    marks: "strong em",
    parseDOM: [{ tag: "p" }],
    toDOM(): DOMOutputSpec {
      return ["p", { class: "mb-3 text-gray-700 leading-relaxed" }, 0];
    }
  },
  text: {
    group: "inline"
  }
};

const marks: { [name: string]: MarkSpec } = {
  strong: {
    parseDOM: [{ tag: "strong" }, { tag: "b" }, { style: "font-weight=bold" }],
    toDOM(): DOMOutputSpec { return ["strong", { class: "font-semibold text-gray-900" }, 0]; }
  },
  em: {
    parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }],
    toDOM(): DOMOutputSpec { return ["em", { class: "italic" }, 0]; }
  }
};

export const documentSchema = new Schema({
  nodes,
  marks
});
