/**
 * Módulo de detección de comentarios
 * 
 * Organiza la funcionalidad de detección de comentarios en módulos especializados:
 * - patterns: Gestión de patrones de comentarios por lenguaje
 * - languageMapper: Mapeo de IDs de lenguaje de VS Code
 * - tagDetector: Detección de custom tags (//!, //·, etc.)
 * - stringParser: Parsing para ignorar strings al buscar comentarios
 * - detector: Clase principal de detección
 */

export { CommentDetector } from './detector';
export { CommentPatternsManager } from './patterns';
export { LanguageMapper } from './languageMapper';
export { TagDetector } from './tagDetector';
export { StringParser } from './stringParser';
