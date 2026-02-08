import { ParsedTag } from './types';

/**
 * Parser robusto de tags JSDoc en comentarios de documentación
 * Soporta tags estándar y no rompe con tags desconocidas
 * 
 * Basado en especificación JSDoc oficial:
 * https://jsdoc.app/tags
 */
export class JSDocTagParser {
    // Tags estándar reconocidas (para clasificación y procesamiento especial)
    private static readonly KNOWN_TAGS = new Set([
        // Tags esenciales
        'param', 'returns', 'return', 'type', 'typedef', 'property', 'prop',
        'callback', 'example', 'throws', 'exception', 'deprecated', 'see',
        'since', 'version', 'author', 'license', 'description', 'summary',
        'default', 'readonly', 'async',
        // Tags de tipo
        'template', 'this', 'enum', 'implements', 'extends', 'augments',
        'overrides', 'mixes', 'interface', 'class', 'constructor', 'abstract',
        'virtual',
        // Tags estructurales
        'file', 'fileoverview', 'module', 'namespace', 'classdesc', 'member',
        'memberof', 'static', 'instance', 'global', 'inner', 'external',
        // Tags de visibilidad
        'public', 'protected', 'private', 'package', 'access',
        // Tags legacy pero válidas
        'constant', 'const', 'function', 'func', 'method', 'var', 'borrows',
        'lends', 'fires', 'listens', 'event', 'alias',
        // Tags específicas de herramientas
        'export', 'define', 'noinline', 'nocollapse', 'ignore', 'internal',
        'satisfies', 'import'
    ]);

    /**
     * Extrae tags JSDoc del contenido
     * @param content Contenido del comentario
     * @param startLine Línea de inicio del comentario
     * @returns Array de tags parseados
     */
    public extractTags(content: string, startLine: number): ParsedTag[] {
        const tags: ParsedTag[] = [];
        const lines = content.split('\n');
        let currentLineIndex = 0;
        let descriptionLines: string[] = [];

        for (const line of lines) {
            const trimmedLine = line.trim().replace(/^\*\s*/, '');

            // Detectar cualquier @tag (sistema robusto)
            const tagMatch = /^@(\w+)(?:\s+(.*))?$/i.exec(trimmedLine);
            
            if (tagMatch) {
                const tagName = tagMatch[1].toLowerCase();
                const tagContent = tagMatch[2] || '';

                // Guardar descripción acumulada como summary antes de procesar la tag
                if (descriptionLines.length > 0) {
                    tags.push({
                        tagName: 'summary',
                        content: descriptionLines.join(' ').trim(),
                        lineStart: startLine + currentLineIndex - descriptionLines.length,
                        isKnown: true
                    });
                    descriptionLines = [];
                }

                // Procesar según tipo de tag
                const parsedTag = this.parseTag(tagName, tagContent, startLine + currentLineIndex);
                tags.push(parsedTag);

                currentLineIndex++;
                continue;
            }

            // Línea sin tag específico (acumular como descripción)
            if (trimmedLine && !trimmedLine.startsWith('@')) {
                descriptionLines.push(trimmedLine);
            }

            currentLineIndex++;
        }

        // Si quedó descripción sin procesar, agregarla como summary
        if (descriptionLines.length > 0 && tags.length === 0) {
            tags.push({
                tagName: 'summary',
                content: descriptionLines.join(' ').trim(),
                lineStart: startLine,
                isKnown: true
            });
        }

        return tags;
    }

    /**
     * Parsea una tag individual según su tipo
     */
    private parseTag(tagName: string, content: string, lineStart: number): ParsedTag {
        const isKnown = JSDocTagParser.KNOWN_TAGS.has(tagName);
        const raw = `@${tagName} ${content}`.trim();

        // Tags con estructura especial: @param
        if (tagName === 'param') {
            return this.parseParamTag(content, lineStart, raw);
        }

        // Tags con estructura especial: @returns/@return
        if (tagName === 'returns' || tagName === 'return') {
            return this.parseReturnTag(content, lineStart, raw);
        }

        // Tags con estructura especial: @property/@prop
        if (tagName === 'property' || tagName === 'prop') {
            return this.parsePropertyTag(content, lineStart, raw);
        }

        // Tags con estructura especial: @type, @typedef, @callback
        if (tagName === 'type' || tagName === 'typedef' || tagName === 'callback') {
            return this.parseTypeTag(tagName, content, lineStart, raw);
        }

        // Tags con estructura especial: @throws/@exception
        if (tagName === 'throws' || tagName === 'exception') {
            return this.parseThrowsTag(content, lineStart, raw);
        }

        // Tags simples: @description, @summary, @example, @deprecated, etc.
        return {
            tagName: this.normalizeTagName(tagName),
            content: content.trim(),
            lineStart,
            raw,
            isKnown
        };
    }

    /**
     * Parsea @param con soporte completo:
     * @param {Type} name description
     * @param {Type} [name] optional
     * @param {Type} [name=default] with default
     * @param {...Type} name rest param
     * @param {Type} name.property nested
     */
    private parseParamTag(content: string, lineStart: number, raw: string): ParsedTag {
        // Regex completo: {tipo} opcional, nombre con modifiers, descripción
        const match = /^(?:\{([^}]+)\}\s+)?(\.\.\.)?\[?(\w+(?:\.\w+)*)(?:=([^\]]+))?\]?\s*(.*)$/i.exec(content);
        
        if (match) {
            const [, type, rest, name, defaultValue, description] = match;
            
            return {
                tagName: 'param',
                type: type?.trim(),
                name: name.trim(),
                content: description.trim(),
                isOptional: content.includes('[') && content.includes(']'),
                defaultValue: defaultValue?.trim(),
                isRest: !!rest,
                lineStart,
                raw,
                isKnown: true,
                attributes: { name: name.trim() }
            };
        }

        // Fallback: solo nombre
        const simpleMath = /(\w+)\s*(.*)/.exec(content);
        if (simpleMath) {
            return {
                tagName: 'param',
                name: simpleMath[1],
                content: simpleMath[2].trim(),
                lineStart,
                raw,
                isKnown: true,
                attributes: { name: simpleMath[1] }
            };
        }

        return {
            tagName: 'param',
            content: content.trim(),
            lineStart,
            raw,
            isKnown: true
        };
    }

    /**
     * Parsea @returns/@return {Type} description
     */
    private parseReturnTag(content: string, lineStart: number, raw: string): ParsedTag {
        const match = /^(?:\{([^}]+)\}\s+)?(.*)$/i.exec(content);
        
        if (match) {
            const [, type, description] = match;
            return {
                tagName: 'return',
                type: type?.trim(),
                content: description.trim(),
                lineStart,
                raw,
                isKnown: true
            };
        }

        return {
            tagName: 'return',
            content: content.trim(),
            lineStart,
            raw,
            isKnown: true
        };
    }

    /**
     * Parsea @property/@prop {Type} name description
     */
    private parsePropertyTag(content: string, lineStart: number, raw: string): ParsedTag {
        const match = /^(?:\{([^}]+)\}\s+)?(\w+)\s*(.*)$/i.exec(content);
        
        if (match) {
            const [, type, name, description] = match;
            return {
                tagName: 'property',
                type: type?.trim(),
                name: name.trim(),
                content: description.trim(),
                lineStart,
                raw,
                isKnown: true,
                attributes: { name: name.trim() }
            };
        }

        return {
            tagName: 'property',
            content: content.trim(),
            lineStart,
            raw,
            isKnown: true
        };
    }

    /**
     * Parsea @type {Type}, @typedef {Type} Name, @callback Name
     */
    private parseTypeTag(tagName: string, content: string, lineStart: number, raw: string): ParsedTag {
        const match = /^(?:\{([^}]+)\}\s+)?(\w+)?\s*(.*)$/i.exec(content);
        
        if (match) {
            const [, type, name, description] = match;
            return {
                tagName,
                type: type?.trim(),
                name: name?.trim(),
                content: description?.trim() || '',
                lineStart,
                raw,
                isKnown: true,
                attributes: name ? { name: name.trim() } : undefined
            };
        }

        return {
            tagName,
            content: content.trim(),
            lineStart,
            raw,
            isKnown: true
        };
    }

    /**
     * Parsea @throws/@exception {Type} description
     */
    private parseThrowsTag(content: string, lineStart: number, raw: string): ParsedTag {
        const match = /^(?:\{([^}]+)\}\s+)?(.*)$/i.exec(content);
        
        if (match) {
            const [, type, description] = match;
            return {
                tagName: 'throws',
                type: type?.trim(),
                content: description.trim(),
                lineStart,
                raw,
                isKnown: true
            };
        }

        return {
            tagName: 'throws',
            content: content.trim(),
            lineStart,
            raw,
            isKnown: true
        };
    }

    /**
     * Normaliza nombres de tags (returns -> return, etc.)
     */
    private normalizeTagName(tagName: string): string {
        const aliases: Record<string, string> = {
            'returns': 'return',
            'exception': 'throws',
            'prop': 'property',
            'const': 'constant',
            'func': 'function',
            'augments': 'extends'
        };

        return aliases[tagName] || tagName;
    }
}
