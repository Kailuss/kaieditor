import * as vscode from 'vscode';

// Lenguajes soportados para detección de comentarios
export enum SupportedLanguage {
    JavaScript = 'javascript',
    TypeScript = 'typescript',
    Python     = 'python'    ,
    Rust       = 'rust'      ,
    Go         = 'go'        ,
    CSharp     = 'csharp'    ,
    Java       = 'java'      ,
    PHP        = 'php'       ,
}

// Tipo de comentario detectado
export enum CommentType {
    SingleLine    = 'single-line',
    MultiLine     = 'multi-line' ,
    Inline        = 'inline'     ,
    Documentation = 'documentation'
}

// Tag personalizado para comentarios de línea.
// El valor de cada tag es el carácter que lo activa al inicio del comentario (ej: //! → Important)
export enum CustomTag {
    None       = 'none',
    Important  = '!',
    Completed  = '✓',
    Warning    = '?',
    Info       = '@',
    Debug      = '#',
    Pending    = '~',
    Active     = '·',
    Conflict   = '^',
    Review     = '»',
    Deprecated = '-',
    Error      = '×',
    Note       = '*',
    Question   = '¿'
}

// Representa un comentario detectado en el código
export type DetectedComment = {

    range                : vscode.Range;      // Rango del comentario en el documento
    content              : string;            // Contenido del comentario sin los delimitadores
    type                 : CommentType;       // Tipo de comentario
    language             : SupportedLanguage; // Lenguaje del documento
    isAfterCode          : boolean;           // Indica si el comentario está después de código (inline)
    customTag?           : CustomTag;         // Tag personalizado para comentarios de línea
    isDocumentation?     : boolean;           // Indica si es un comentario de documentación JSDoc/etc

};

// Patrones de comentarios por lenguaje
export type CommentPatterns = {

    singleLine            : string; // Patrón para comentarios de una línea (ej: //, #)
    multiLineStart        : string; // Patrón para inicio de comentario multilínea (ej: slash-star, """)
    multiLineEnd          : string; // Patrón para fin de comentario multilínea (ej: star-slash, """)

};

// Configuración completa de la extensión
export type KaiEditorConfig = {

    enabled          : boolean;             // Indica si la extensión está habilitada
    enabledLanguages : SupportedLanguage[]; // Lenguajes habilitados para transformación
    showIcons        : boolean;             // Mostrar iconos antes de comentarios con tags
    iconSize         : number;              // Tamaño de los iconos en píxeles (fijo: 16px)

};
