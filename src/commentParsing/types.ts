/**
 * Tag parseado de un comentario de documentación
 */
export type ParsedTag = {
    tagName: string;                          // 'summary', 'param', 'return', 'remarks', etc.
    attributes?: Record<string, string>;      // Para <param name="x">
    content: string;                          // Contenido del tag
    lineStart: number;                        // Línea donde comienza el tag
    type?: string;                            // Type hint extraído (ej: {string}, {Promise<T>})
    name?: string;                            // Nombre del parámetro/propiedad
    isOptional?: boolean;                     // Si es parámetro opcional [name]
    defaultValue?: string;                    // Valor por defecto [name=value]
    isRest?: boolean;                         // Si es rest param ...name
    raw?: string;                             // Contenido raw completo de la tag
    isKnown?: boolean;                        // Si es una tag estándar conocida
};

/**
 * Comentario parseado con estructura de tags
 */
export type ParsedComment = {
    rawComment: any;                          // DetectedComment original (usa any para evitar dependencia circular)
    tags: ParsedTag[];                        // Tags parseados
    rawText: string;                          // Texto sin parsear (fallback)
};
