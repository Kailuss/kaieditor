import { SupportedLanguage } from '../types';

/**
 * Parser para identificar comentarios ignorando strings
 */
export class StringParser {
    /**
     * Encuentra el inicio real de un comentario en una línea, ignorando strings
     * @param line Línea de código
     * @param commentMarker Marcador de comentario a buscar
     * @param language Lenguaje del documento
     * @returns Índice del inicio del comentario o -1 si no se encuentra
     */
    public findCommentStart(line: string, commentMarker: string, language: SupportedLanguage): number {
        let inString = false;
        let stringChar = '';
        let escaped = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            // Manejar caracteres escapados
            if (escaped) {
                escaped = false;
                continue;
            }

            if (char === '\\') {
                escaped = true;
                continue;
            }

            // Manejar strings
            if (!inString && (char === '"' || char === "'" || char === '`')) {
                inString = true;
                stringChar = char;
                continue;
            }

            if (inString && char === stringChar) {
                inString = false;
                stringChar = '';
                continue;
            }

            // Buscar marcador de comentario fuera de strings
            if (!inString && line.substring(i, i + commentMarker.length) === commentMarker) {
                return i;
            }
        }

        return -1;
    }
}
