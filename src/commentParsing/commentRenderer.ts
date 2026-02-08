import { ParsedTag, ParsedComment } from './types';
import { TextFormatter } from './textFormatter';

/**
 * Renderer para comentarios parseados
 * Convierte comentarios con tags en texto formateado
 */
export class CommentRenderer {
    /**
     * Renderiza un comentario parseado con formato
     * @param parsed Comentario parseado
     * @returns Texto formateado listo para mostrar
     */
    public static render(parsed: ParsedComment): string {
        if (parsed.tags.length === 0) {
            // Fallback: mostrar contenido raw limpio
            return parsed.rawText
                .split('\n')
                .map(line => line.trim().replace(/^\*\s*/, '').trim())
                .filter(line => line.length > 0)
                .join('\n');
        }

        const sections: string[] = [];

        for (const tag of parsed.tags) {
            const title = TextFormatter.toBold(TextFormatter.getTagTitle(tag.tagName, tag.attributes));
            const content = tag.content;

            sections.push(`${title}\n${content}`);
        }

        return sections.join('\n\n');
    }

    /**
     * Renderiza múltiples comentarios parseados
     * @param parsedComments Array de comentarios parseados
     * @returns Array de textos formateados
     */
    public static renderMultiple(parsedComments: ParsedComment[]): string[] {
        return parsedComments.map(parsed => CommentRenderer.render(parsed));
    }
}
