import React, { useEffect, useRef, useState, useCallback } from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Node } from 'prosemirror-model';
import { documentSchema } from '../editor/schema';
import { buildPlugins } from '../editor/editorSetup';
import { SectionToolbar } from './SectionToolbar';
import { SectionActionType, SectionData } from '../types';
import { processSectionAction } from '../server/sectionAction';
import { buildSectionNode } from '../editor/documentBuilder';

interface EditorProps {
  initialDoc: Node | null;
}

export const Editor: React.FC<EditorProps> = ({ initialDoc }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [activeSection, setActiveSection] = useState<{ 
    pos: number; 
    node: Node; 
    domRect: DOMRect 
  } | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  // Initialize Editor
  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      schema: documentSchema,
      doc: initialDoc || undefined,
      plugins: buildPlugins(),
    });

    const view = new EditorView(editorRef.current, {
      state,
      dispatchTransaction: (tr) => {
        const newState = view.state.apply(tr);
        view.updateState(newState);
        handleSelectionChange(view);
      },
    });

    viewRef.current = view;

    return () => {
      view.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle external doc updates (e.g. after fresh generation)
  useEffect(() => {
    if (viewRef.current && initialDoc) {
      const state = EditorState.create({
        schema: documentSchema,
        doc: initialDoc,
        plugins: buildPlugins(),
      });
      viewRef.current.updateState(state);
    }
  }, [initialDoc]);

  // Detect active section for toolbar
  const handleSelectionChange = useCallback((view: EditorView) => {
    const { state } = view;
    const { selection } = state;
    const $from = selection.$from;

    // We want to find the parent 'section' node
    let sectionNode: Node | null = null;
    let sectionPos = -1;

    // Walk up the tree to find the section
    for (let d = $from.depth; d > 0; d--) {
      const node = $from.node(d);
      if (node.type.name === 'section') {
        sectionNode = node;
        sectionPos = $from.before(d);
        break;
      }
    }

    if (sectionNode && sectionPos !== -1) {
      // Find DOM element to position toolbar
      const dom = view.nodeDOM(sectionPos) as HTMLElement;
      if (dom && dom.getBoundingClientRect) {
        const rect = dom.getBoundingClientRect();
        // Adjust for editor relative position if needed, here treating as fixed/absolute relative to viewport or container
        // Simplified for this demo: use rect
        setActiveSection({ 
          pos: sectionPos, 
          node: sectionNode, 
          domRect: rect 
        });
        return;
      }
    }

    setActiveSection(null);
  }, []);

  const handleAction = async (action: SectionActionType) => {
    if (!activeSection || !viewRef.current) return;

    setIsProcessingAction(true);
    const { node, pos } = activeSection;

    // Extract data from current node to send to AI
    const titleNode = node.child(0);
    const title = titleNode.textContent;
    const content: string[] = [];
    node.forEach((child, offset) => {
      if (child.type.name === 'paragraph') {
        content.push(child.textContent);
      }
    });

    const currentData: SectionData = { title, content };

    // Call "Backend"
    const response = await processSectionAction(currentData, action);

    if (response.success && response.data) {
      // Replace the section in the document
      const view = viewRef.current;
      const tr = view.state.tr;
      
      const newSectionNode = buildSectionNode(response.data, documentSchema);
      
      // Calculate range of the old section
      const from = pos;
      const to = pos + node.nodeSize;
      
      tr.replaceWith(from, to, newSectionNode);
      view.dispatch(tr);
    } else {
      alert("Failed to update section: " + response.error);
    }

    setIsProcessingAction(false);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Editor Container */}
      <div 
        ref={editorRef} 
        className="min-h-[60vh] bg-white p-12 rounded-xl shadow-sm border border-gray-100"
      />

      {/* Floating Toolbar */}
      {activeSection && (
        <SectionToolbar 
          position={{ 
            top: activeSection.domRect.top + window.scrollY, 
            left: activeSection.domRect.left + window.scrollX
          }}
          sectionTitle={activeSection.node.child(0).textContent}
          onAction={handleAction}
          isProcessing={isProcessingAction}
        />
      )}
    </div>
  );
};
