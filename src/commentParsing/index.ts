/**
 * Módulo de parsing de comentarios de documentación
 * 
 * Organiza la funcionalidad de parsing en módulos especializados:
 * - types: Interfaces y tipos para tags y comentarios parseados
 * - textFormatter: Utilidades de formateo de texto (bold, limpieza)
 * - xmlTagParser: Parser de tags XML (<summary>, <param>, etc.)
 * - jsDocTagParser: Parser de tags JSDoc (@param, @returns, etc.)
 * - commentRenderer: Renderer para convertir comentarios parseados a texto formateado
 * - parser: Parser principal que combina XML y JSDoc
 */

export { ParsedTag, ParsedComment } from './types';
export { TextFormatter } from './textFormatter';
export { XmlTagParser } from './xmlTagParser';
export { JSDocTagParser } from './jsDocTagParser';
export { CommentRenderer } from './commentRenderer';
export { CommentParser } from './parser';

// Re-export del parser principal para compatibilidad
export { CommentParser as default } from './parser';
