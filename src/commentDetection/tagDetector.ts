import { CustomTag } from '../types';

/**
 * Detector de custom tags en comentarios de línea
 * 
 * Tags soportados:
 * - //! - Important (Rojo)
 * - //✓ - Completed (Verde)
 * - //? - Warning (Amarillo)
 * - //@ - Info (Azul)
 * - //# - Debug (Morado)
 * - //~ - Pending (Amarillo)
 * - //· - Active (Cyan)
 * - //^ - Conflict (Rojo)
 * - //» - Review (Cyan)
 * - //- - Deprecated (Gris)
 * - //× - Error (Rojo)
 * - //* - Note (Amarillo)
 * - //¿ - Question (Morado)
 */
export class TagDetector {
    /**
     * Detecta custom tags en el contenido de un comentario
     * @param content Contenido del comentario
     * @returns El tag detectado o CustomTag.None
     */
    public detectCustomTag(content: string): CustomTag {
        if (content.length === 0) {
            return CustomTag.None;
        }

        const firstChar = content[0];

        const tagMap: Record<string, CustomTag> = {
            '!': CustomTag.Important,
            '✓': CustomTag.Completed,
            '?': CustomTag.Warning,
            '@': CustomTag.Info,
            '#': CustomTag.Debug,
            '~': CustomTag.Pending,
            '·': CustomTag.Active,
            '^': CustomTag.Conflict,
            '»': CustomTag.Review,
            '-': CustomTag.Deprecated,
            '×': CustomTag.Error,
            '*': CustomTag.Note,
            '¿': CustomTag.Question
        };

        return tagMap[firstChar] ?? CustomTag.None;
    }

    /**
     * Limpia el contenido del comentario eliminando el tag si existe
     * @param content Contenido del comentario
     * @param tag Tag detectado
     * @returns Contenido limpio sin el tag
     */
    public cleanContent(content: string, tag: CustomTag): string {
        if (tag !== CustomTag.None && content.length > 0) {
            return content.substring(1).trim();
        }
        return content.trim();
    }
}
