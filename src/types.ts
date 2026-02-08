import * as vscode from 'vscode';

/**
 * Lenguajes soportados para detección de comentarios
 */
export enum SupportedLanguage {
    JavaScript = 'javascript',
    TypeScript = 'typescript',
    Python     = 'python',
    Rust       = 'rust',
    Go         = 'go',
    CSharp     = 'csharp',
    Java       = 'java',
    PHP        = 'php'
}

/**
 * Tipo de comentario detectado
 */
export enum CommentType {
    SingleLine    = 'single-line',
    MultiLine     = 'multi-line',
    Inline        = 'inline',
    Documentation = 'documentation'
}

/**
 * Tag personalizado para comentarios de línea
 */
export enum CustomTag {
    None      = 'none',
    Important = '!', //! Rojo
    Success   = '·', //· Verde
    Warning   = '?', //? Amarillo
    Info      = '@', //@ Azul
    Debug     = '#'  //# Morado
}

/**
 * Representa un comentario detectado en el código
 */
export interface DetectedComment {
    range                : vscode.Range;         // Rango del comentario en el documento
    content              : string;              // Contenido del comentario sin los delimitadores
    type                 : CommentType;         // Tipo de comentario
    language             : SupportedLanguage;   // Lenguaje del documento
    isAfterCode          : boolean;             // Indica si el comentario está después de código (inline)
    customTag?           : CustomTag;           // Tag personalizado para comentarios de línea
    isDocumentation?     : boolean;             // Indica si es un comentario de documentación JSDoc/etc
}

/**
 * Patrones de comentarios por lenguaje
 */
export interface CommentPatterns {
    singleLine            : string; // Patrón para comentarios de una línea (ej: //, #)
    multiLineStart        : string; // Patrón para inicio de comentario multilínea (ej: slash-star, """)
    multiLineEnd          : string; // Patrón para fin de comentario multilínea (ej: star-slash, """)
}

/**
 * Configuración de estilos para las cajas de comentarios con CSS puro
 */
export interface DecorationStyle {
    backgroundColor         : string; // Color de fondo de la caja
    textColor               : string; // Color del texto
    borderColor             : string; // Color del borde
    accentColor             : string; // Color de acento (para borde lateral en bloques)
    borderRadius            : number; // Radio del borde en píxeles
    paddingVertical         : number; // Padding vertical en píxeles
    paddingHorizontal       : number; // Padding horizontal en píxeles
    fontStyle               : string; // Estilo de fuente (normal, italic)
    fontWeight              : string; // Peso de fuente (400, 500, 600)
    opacity                 : number; // Opacidad (0.0 - 1.0)
    inlineFontSize?         : string; // Tamaño de fuente para comentarios inline (ej: '0.8em')
    inlinePaddingTop?       : string; // Padding top para comentarios inline
    inlinePaddingBottom?    : string; // Padding bottom para comentarios inline
    blockFontSize?          : string; // Tamaño de fuente para bloques de documentación
    blockPaddingMultiplier? : number; // Multiplicador para padding vertical en bloques de documentación (ej: 2 para el doble del padding normal)
    // Colores para custom tags
    tagColors?: {
        important?: string;    // //! - Rojo
        success?: string;      // //· - Verde
        warning?: string;      // //? - Amarillo
        info?: string;         // //@ - Azul
        debug?: string;        // //# - Morado
    };
    // Colores para comentarios de documentación
    docColors?: {
        backgroundColor?: string;
        borderColor?: string;
        textColor?: string;
    };
}

/**
 * Configuración de estilos para las cajas de comentarios (legacy)
 * @deprecated Use DecorationStyle instead
 */
export interface CommentBoxStyle {
    backgroundColor       : string; // Color de fondo de la caja
    textColor             : string; // Color del texto
    borderColor           : string; // Color del borde
    borderWidth           : string; // Ancho del borde
    borderRadius          : string; // Radio del borde (esquinas redondeadas)
    padding               : string; // Padding interno
    fontFamily            : string; // Fuente del texto
    fontSize              : string; // Tamaño de fuente
    fontWeight            : string; // Peso de fuente
}

/**
 * Configuración completa de la extensión
 */
export interface KaiEditorConfig {
    enabled               : boolean;             // Indica si la extensión está habilitada
    enabledLanguages      : SupportedLanguage[]; // Lenguajes habilitados para transformación
    decorationStyle       : DecorationStyle;     // Estilo de decoración para cajas de comentarios
    singleLineStyle       : DecorationStyle;     // Estilos para comentarios de una línea
    multiLineStyle        : DecorationStyle;     // Estilos para comentarios multilínea
    inlineStyle           : DecorationStyle;     // Estilos para comentarios inline
}

/**
 * Rango de comentario con información de tipo
 */
export interface CommentRange {
    range: vscode.Range;
    type: 'line' | 'block' | 'inline';
    text: string;
    language: string;
}

/**
 * Opciones de decoración procesadas para VS Code
 */
export interface DecorationOptions {
    decorationType        : vscode.TextEditorDecorationType; // Tipo de decoración de VS Code
    rangeOptions          : vscode.DecorationOptions[];      // Opciones de rango de decoración
}
