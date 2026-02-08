/**
 * Utilidades para limpieza y formateo de texto de comentarios
 */
export class TextCleaner {
    /**
     * Limpia el texto del comentario (quita los delimitadores)
     * @param text Texto del comentario
     * @returns Texto limpio sin delimitadores
     */
    public static cleanCommentText(text: string): string {
        return text
            .replace(/^\/\/\s?/, '')       // Comentarios de línea
            .replace(/^\/\*\*?\s?/, '')    // Inicio de bloque (/* o /**)
            .replace(/\s?\*+\/$/, '')      // Fin de bloque (*/ o **/)
            .replace(/^\s*\*\s?/, '')      // Líneas dentro de bloque (* )
            .replace(/^#\s?/, '')           // Comentarios de línea con #
            .trim();
    }

    /**
     * Limpia el texto de un bloque multilínea completo
     * @param text Texto del bloque multilínea
     * @returns Texto limpio en una sola línea
     */
    public static cleanBlockText(text: string): string {
        return text
            .split  ('\n')                                             // Divide en líneas para limpiar cada una
            .map    (line => line.trim().replace(/^\*\s?/, '').trim()) // Limpia cada línea (quita asteriscos y espacios)
            .filter (line => line.length > 0)                          // Elimina líneas vacías
            .join   (' ')                                              // Une en una sola línea para mostrar en la caja, con espacios entre ellas
            .trim   ();                                                // Elimina espacios al inicio y final del bloque completo
    }

    /**
     * Formatea texto largo con elipsis
     * @param text Texto a formatear
     * @param maxLength Longitud máxima (default: 80)
     * @returns Texto formateado con elipsis si excede maxLength
     */
    public static formatLongText(text: string, maxLength: number = 80): string {
        if (text.length <= maxLength) { 
            return text; 
        }
        return text.substring(0, maxLength - 3) + '...';
    }
}
