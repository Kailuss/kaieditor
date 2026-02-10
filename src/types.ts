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
    None       = 'none',
    Important  = '!',  // //!
    Completed  = '✓',  // //✓
    Warning    = '?',  // //?
    Info       = '@',  // //@
    Debug      = '#',  // //#
    Pending    = '~',  // //~
    Active     = '·',  // //·
    Conflict   = '^',  // //^
    Review     = '»',  // //»
    Deprecated = '-',  // //-
    Error      = '×',  // //×
    Note       = '*',  // //*
    Question   = '¿'   // //¿
}

/**
 * Representa un comentario detectado en el código
 */
export interface DetectedComment {
    range                : vscode.Range;       // Rango del comentario en el documento
    content              : string;            // Contenido del comentario sin los delimitadores
    type                 : CommentType;       // Tipo de comentario
    language             : SupportedLanguage; // Lenguaje del documento
    isAfterCode          : boolean;           // Indica si el comentario está después de código (inline)
    customTag?           : CustomTag;         // Tag personalizado para comentarios de línea
    isDocumentation?     : boolean;           // Indica si es un comentario de documentación JSDoc/etc
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
    // Colores básicos
    backgroundColor         : string; // Color de fondo de la caja
    textColor               : string; // Color del texto
    borderColor             : string; // Color del borde
    accentColor             : string; // Color de acento (para borde lateral izquierdo en bloques)
    
    // Geometría
    borderRadius            : number; // Radio del borde en píxeles
    paddingVertical         : number; // Padding vertical en píxeles
    paddingHorizontal       : number; // Padding horizontal en píxeles
    
    // Tipografía
    fontStyle               : string; // Estilo de fuente (normal, italic)
    fontWeight              : string; // Peso de fuente (400, 500, 600)
    opacity                 : number; // Opacidad (0.0 - 1.0)
    
    // Tamaños específicos por tipo de comentario
    inlineFontSize          : string; // Tamaño de fuente para comentarios inline (ej: '0.64em')
    inlinePaddingTop        : string; // Padding top para comentarios inline
    inlinePaddingBottom     : string; // Padding bottom para comentarios inline
    blockFontSize           : string; // Tamaño de fuente para bloques multi-línea

    // Colores para custom tags
    tagColors: {
        important  : string;
        completed  : string;
        warning    : string;
        info       : string;
        debug      : string;
        pending    : string;
        active     : string;
        conflict   : string;
        review     : string;
        deprecated : string;
        error      : string;
        note       : string;
        question   : string;
    };

    // Colores específicos para comentarios de documentación
    docColors: {
        backgroundColor : string;
        borderColor     : string;
        textColor       : string;
    };
}

/**
 * Configuración completa de la extensión
 */
export interface KaiEditorConfig {
    enabled          : boolean;             // Indica si la extensión está habilitada
    enabledLanguages : SupportedLanguage[]; // Lenguajes habilitados para transformación
    decorationStyle  : DecorationStyle;     // Estilo de decoración unificado para todos los comentarios
    showIcons        : boolean;             // Mostrar iconos antes de comentarios con tags
    iconSize         : number;              // Tamaño de los iconos en píxeles (fijo: 16px)
}