import { CustomTag, DecorationStyle } from '../types';

/**
 * Gestor de colores para decoraciones según custom tags
 */
export class ColorManager {
    /**
     * Obtiene el color de fondo según el custom tag
     * @param style Estilo de decoración configurado
     * @param tag Tag personalizado del comentario
     * @returns Color de fondo para el tag
     */
    public static getTagColor(style: DecorationStyle, tag?: CustomTag): string {
        if (!tag || tag === CustomTag.None) {
            return style.backgroundColor;
        }

        const tagColors = style.tagColors || {};
        
        switch (tag) {
            case CustomTag.Important:
                return tagColors.important || '#8b1e1e';  // Rojo oscuro
            case CustomTag.Success:
                return tagColors.success || '#1e5e1e';    // Verde oscuro
            case CustomTag.Warning:
                return tagColors.warning || '#7a5e1e';    // Amarillo/Naranja oscuro
            case CustomTag.Info:
                return tagColors.info || '#1e4e7a';       // Azul oscuro
            case CustomTag.Debug:
                return tagColors.debug || '#5e1e7a';      // Morado oscuro
            default:
                return style.backgroundColor;
        }
    }

    /**
     * Obtiene los colores finales según si es documentación
     * @param style Estilo de decoración configurado
     * @param isDocumentation Si el comentario es de documentación
     * @param customTag Tag personalizado (opcional)
     * @returns Objeto con backgroundColor, textColor y borderColor
     */
    public static getColors(
        style: DecorationStyle, 
        isDocumentation: boolean, 
        customTag?: CustomTag
    ): { backgroundColor: string; textColor: string; borderColor: string } {
        const baseColor = ColorManager.getTagColor(style, customTag);
        
        if (isDocumentation) {
            return {
                backgroundColor: style.docColors?.backgroundColor || baseColor,
                textColor: style.docColors?.textColor || style.textColor,
                borderColor: style.docColors?.borderColor || style.borderColor
            };
        }

        return {
            backgroundColor: baseColor,
            textColor: style.textColor,
            borderColor: style.borderColor
        };
    }
}
