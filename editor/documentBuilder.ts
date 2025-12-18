import { Schema, Node } from 'prosemirror-model';
import { DocumentData, SectionData } from '../types';
import { documentSchema } from './schema';

/**
 * Converts the AI structured JSON into a ProseMirror Document Node
 */
export const buildDocumentFromData = (data: DocumentData, schema: Schema = documentSchema): Node => {
  const sectionNodes: Node[] = [];

  for (const section of data.sections) {
    const headingNode = schema.nodes.heading.create(null, section.title ? schema.text(section.title) : null);
    
    const paragraphNodes = section.content.map(text => 
      schema.nodes.paragraph.create(null, text ? schema.text(text) : null)
    );

    // Ensure at least one paragraph exists if content is empty, to satisfy schema
    if (paragraphNodes.length === 0) {
      paragraphNodes.push(schema.nodes.paragraph.create());
    }

    const sectionNode = schema.nodes.section.create(null, [headingNode, ...paragraphNodes]);
    sectionNodes.push(sectionNode);
  }

  // Ensure at least one section exists
  if (sectionNodes.length === 0) {
     const defaultHeading = schema.nodes.heading.create(null, schema.text("Untitled"));
     const defaultPara = schema.nodes.paragraph.create(null, schema.text("Start typing..."));
     sectionNodes.push(schema.nodes.section.create(null, [defaultHeading, defaultPara]));
  }

  return schema.nodes.doc.create(null, sectionNodes);
};

/**
 * Converts a specific section data block into a ProseMirror Section Node
 * Used for replacing just one section after an AI action
 */
export const buildSectionNode = (sectionData: SectionData, schema: Schema = documentSchema): Node => {
    const headingNode = schema.nodes.heading.create(null, sectionData.title ? schema.text(sectionData.title) : null);
    
    const paragraphNodes = sectionData.content.map(text => 
      schema.nodes.paragraph.create(null, text ? schema.text(text) : null)
    );

    if (paragraphNodes.length === 0) {
        paragraphNodes.push(schema.nodes.paragraph.create());
    }

    return schema.nodes.section.create(null, [headingNode, ...paragraphNodes]);
};
