import { ParsedTag } from './types';
import { TextFormatter } from './textFormatter';

/**
 * Parser de tags XML en comentarios de documentación
 * Soporta tags como <summary>, <param>, <returns>, etc.
 */
export class XmlTagParser {
    /**
     * Extrae tags XML del contenido
     * @param content Contenido del comentario
     * @param startLine Línea de inicio del comentario
     * @returns Array de tags parseados
     */
    public extractTags(content: string, startLine: number): ParsedTag[] {
        const tags: ParsedTag[] = [];

        // <summary>...</summary>
        const summaryMatch = /<summary>\s*([\s\S]*?)\s*<\/summary>/i.exec(content);
        if (summaryMatch) {
            tags.push({
                tagName: 'summary',
                content: TextFormatter.cleanContent(summaryMatch[1]),
                lineStart: startLine
            });
        }

        // <remarks>...</remarks>
        const remarksMatch = /<remarks>\s*([\s\S]*?)\s*<\/remarks>/i.exec(content);
        if (remarksMatch) {
            tags.push({
                tagName: 'remarks',
                content: TextFormatter.cleanContent(remarksMatch[1]),
                lineStart: startLine
            });
        }

        // <param name="x">...</param>
        const paramRegex = /<param\s+name="([^"]+)"\s*>\s*([\s\S]*?)\s*<\/param>/gi;
        let match;
        while ((match = paramRegex.exec(content)) !== null) {
            tags.push({
                tagName: 'param',
                attributes: { name: match[1] },
                content: TextFormatter.cleanContent(match[2]),
                lineStart: startLine
            });
        }

        // <returns>...</returns> o <return>...</return>
        const returnsMatch = /<returns?>\s*([\s\S]*?)\s*<\/returns?>/i.exec(content);
        if (returnsMatch) {
            tags.push({
                tagName: 'return',
                content: TextFormatter.cleanContent(returnsMatch[1]),
                lineStart: startLine
            });
        }

        // <example>...</example>
        const exampleMatch = /<example>\s*([\s\S]*?)\s*<\/example>/i.exec(content);
        if (exampleMatch) {
            tags.push({
                tagName: 'example',
                content: TextFormatter.cleanContent(exampleMatch[1]),
                lineStart: startLine
            });
        }

        return tags;
    }
}
