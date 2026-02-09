/**
 * Módulo de gestión de decoraciones visuales
 * 
 * Organiza la funcionalidad de decoraciones en módulos especializados:
 * - textCleaner: Limpieza y formateo de texto de comentarios
 * - colorManager: Gestión de colores según custom tags y documentación
 * - decorationTypeFactory: Factory para crear y cachear tipos de decoración
 * - iconManager: Gestión de iconos SVG con cache por color
 * - inlineDecorationApplier: Aplicador de decoraciones inline
 * - blockDecorationApplier: Aplicador de decoraciones para bloques
 * - manager: Gestor principal que coordina todos los módulos
 */

export { TextCleaner }                                  from './textCleaner';
export { ColorManager }                                 from './colorManager';
export { DecorationTypeFactory }                        from './decorationTypeFactory';
export { getIconUri, clearIconCache, getIconCacheSize } from './iconManager';
export { InlineDecorationApplier }                      from './inlineDecorationApplier';
export { BlockDecorationApplier }                       from './blockDecorationApplier';
export { DecorationManager }                            from './manager';
