import { DetectedComment } from '../types';
import { ParsedComment } from './types';
import { XmlTagParser } from './xmlTagParser';
import { JSDocTagParser } from './jsDocTagParser';

/**
 * Parser principal de comentarios de documentación
 * Combina XML Doc Comments y JSDoc
 */
export class CommentParser {
    private xmlParser: XmlTagParser;
    private jsDocParser: JSDocTagParser;

    constructor() {
        this.xmlParser = new XmlTagParser();
        this.jsDocParser = new JSDocTagParser();
    }

    /**
     * Parsea un comentario de documentación
     * @param comment Comentario detectado
     * @returns Comentario parseado con tags
     */
    public parseComment(comment: DetectedComment): ParsedComment {
        if (!comment.isDocumentation) {
            return {
                rawComment: comment,
                tags: [],
                rawText: comment.content
            };
        }

        const tags = [];
        const content = comment.content;

        // Intentar parsear tags XML primero
        const xmlTags = this.xmlParser.extractTags(content, comment.range.start.line);
        if (xmlTags.length > 0) {
            tags.push(...xmlTags);
        }

        // Intentar parsear tags JSDoc
        const jsdocTags = this.jsDocParser.extractTags(content, comment.range.start.line);
        if (jsdocTags.length > 0) {
            tags.push(...jsdocTags);
        }

        return {
            rawComment: comment,
            tags: tags.length > 0 ? tags : [],
            rawText: content
        };
    }

    /**
     * Parsea múltiples comentarios
     * @param comments Array de comentarios detectados
     * @returns Array de comentarios parseados
     */
    public parseComments(comments: DetectedComment[]): ParsedComment[] {
        return comments.map(comment => this.parseComment(comment));
    }
}
