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

        // Si no hay tag o es None, usar el color de fondo general
        if (!tag || tag === CustomTag.None) { return style.backgroundColor; }

        // Obtener colores específicos para tags personalizados
        const tagColors = style.tagColors || {};

        // Si no hay configuración de colores por tag, usar el color de fondo general
        if (!style.tagColors) { return style.backgroundColor; }

        // Mapeo de tags a colores, con fallback al color de fondo general
        const colorMap: Record<CustomTag, string | undefined> = {
            [CustomTag.None]      : undefined,
            [CustomTag.Important] : tagColors.important,
            [CustomTag.Success]   : tagColors.success,
            [CustomTag.Warning]   : tagColors.warning,
            [CustomTag.Info]      : tagColors.info,
            [CustomTag.Debug]     : tagColors.debug
        };

        return colorMap[tag] || style.backgroundColor;
    }

    /**
     * Obtiene los colores finales según si es documentación
     * @param style Estilo de decoración configurado
     * @param isDocumentation Si el comentario es de documentación
     * @param customTag Tag personalizado (opcional)
     * @returns Objeto con backgroundColor, textColor y borderColor
     */
    public static getColors(
        style           : DecorationStyle, 
        isDocumentation : boolean, 
        customTag?      : CustomTag
    ): {
        backgroundColor : string;
        textColor       : string;
        borderColor     : string
    } {
        const baseColor = ColorManager.getTagColor(style, customTag);

        if (isDocumentation && style.docColors) {
            return {
                backgroundColor : style.docColors.backgroundColor || baseColor,
                textColor       : style.docColors.textColor       || style.textColor,
                borderColor     : style.docColors.borderColor     || style.borderColor
            };
        }

        return {
            backgroundColor : baseColor,
            textColor       : style.textColor,
            borderColor     : style.borderColor
        };
    }
}
