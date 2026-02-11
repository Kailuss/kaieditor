import { ParsedTag } from './types';
import { TextFormatter } from './textFormatter';

/**
 * Tag inline parseada de JSDoc (formato {@tag ...})
 */
export type InlineTag = {
    tag: string;           // Nombre de la tag sin @
    content: string;       // Contenido completo
    target?: string;       // Target/referencia (para link, tutorial, etc.)
    label?: string;        // Label personalizado (para link|label)
    raw: string;           // Texto raw completo incluyendo {...}
    start: number;         // Posición de inicio en el string
    end: number;           // Posición de fin en el string
};

/**
 * Parser de tags XML/inline en comentarios de documentación
 * 
 * Soporta dos formatos:
 * 1. Tags XML de bloque: <summary>, <param>, <returns>, etc.
 * 2. Tags inline de JSDoc: {@link}, {@code}, {@type}, etc.
 */
export class XmlTagParser {
    /**
     * Whitelist de inline tags conocidas de JSDoc
     * No falla con tags desconocidas, pero las marca como unknown
     */
    private static readonly KNOWN_INLINE_TAGS = new Set([
        // Core / imprescindibles
        'link', 'linkplain', 'linkcode', 'tutorial', 'inheritdoc',
        // Formato
        'code', 'literal',
        // Tipos
        'type', 'typeof', 'namepath',
        // Legacy/raros
        'docRoot', 'value', 'index'
    ]);

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

    /**
     * Parsea inline tags de JSDoc en formato {@tag content}
     * Soporta nesting y sintaxis pipe (|) para labels
     * 
     * @param content Contenido donde buscar inline tags
     * @returns Array de inline tags encontradas
     * 
     * @example
     * parseInlineTags('See {@link MyClass|the class}')
     * // => [{ tag: 'link', target: 'MyClass', label: 'the class', ... }]
     */
    public parseInlineTags(content: string): InlineTag[] {
        const inlineTags: InlineTag[] = [];
        
        // Regex para encontrar {@tag ...}
        // Soporte para nesting básico (un nivel)
        const inlineTagRegex = /\{@(\w+)\s+([^}]+)\}/g;
        
        let match;
        while ((match = inlineTagRegex.exec(content)) !== null) {
            const tag = match[1];
            const rawContent = match[2];
            const fullMatch = match[0];
            const start = match.index;
            const end = start + fullMatch.length;

            // Parsear target y label si hay pipe
            const { target, label } = this.parseTargetAndLabel(rawContent);

            inlineTags.push({
                tag,
                content: rawContent.trim(),
                target,
                label,
                raw: fullMatch,
                start,
                end
            });
        }

        return inlineTags;
    }

    /**
     * Parsea sintaxis de target|label en inline tags
     * @example "MyClass|the class" => { target: "MyClass", label: "the class" }
     */
    private parseTargetAndLabel(content: string): { target?: string; label?: string } {
        const pipeIndex = content.indexOf('|');
        
        if (pipeIndex === -1) {
            // No hay pipe, todo es target
            return { target: content.trim() };
        }

        const target = content.substring(0, pipeIndex).trim();
        const label = content.substring(pipeIndex + 1).trim();

        return { target, label };
    }

    /**
     * Verifica si una inline tag es conocida/estándar
     */
    public isKnownInlineTag(tagName: string): boolean {
        return XmlTagParser.KNOWN_INLINE_TAGS.has(tagName);
    }

    /**
     * Reemplaza inline tags en un string por su representación visual
     * 
     * @param content Contenido con inline tags
     * @returns Contenido con tags reemplazadas
     * 
     * @example
     * replaceInlineTags('See {@link MyClass}')
     * // => 'See MyClass'
     * 
     * replaceInlineTags('Use {@code myFunc()}')
     * // => 'Use `myFunc()`'
     */
    public replaceInlineTags(content: string): string {
        const tags = this.parseInlineTags(content);
        
        // Reemplazar de atrás hacia adelante para mantener índices válidos
        const sortedTags = tags.sort((a, b) => b.start - a.start);
        
        let result = content;
        
        for (const tag of sortedTags) {
            const replacement = this.formatInlineTag(tag);
            result = result.substring(0, tag.start) + replacement + result.substring(tag.end);
        }
        
        return result;
    }

    /**
     * Formatea una inline tag según su tipo
     */
    private formatInlineTag(tag: InlineTag): string {
        switch (tag.tag) {
            case 'link':
            case 'linkplain':
            case 'linkcode':
            case 'tutorial':
                // Preferir label si existe, sino target
                return tag.label || tag.target || tag.content;

            case 'code':
                // Monospace
                return `\`${tag.content}\``;

            case 'literal':
                // Texto literal sin formato
                return tag.content;

            case 'type':
            case 'typeof':
                // Mostrar tipo
                return tag.content;

            case 'inheritdoc':
                // No mostrar nada o placeholder
                return '(inherited)';

            case 'docRoot':
            case 'value':
            case 'index':
                // Tags raras, mostrar contenido sin más
                return tag.content;

            default:
                // Tag desconocida, mostrar contenido
                return tag.content;
        }
    }

    /**
     * Extrae y procesa todas las inline tags de un contenido,
     * devolviendo el texto limpio y las tags encontradas
     */
    public processInlineTags(content: string): { cleanText: string; tags: InlineTag[] } {
        const tags = this.parseInlineTags(content);
        const cleanText = this.replaceInlineTags(content);
        
        return { cleanText, tags };
    }
}
