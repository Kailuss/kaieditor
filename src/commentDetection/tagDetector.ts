import { CustomTag } from '../types';

/**
 * Detector de custom tags en comentarios de línea
 * 
 * Tags soportados:
 * - //! - Important (Rojo)
 * - //· - Success (Verde)
 * - //? - Warning (Amarillo)
 * - //@ - Info (Azul)
 * - //# - Debug (Morado)
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
        
        switch (firstChar) {
            case '!':
                return CustomTag.Important;
            case '·':
                return CustomTag.Success;
            case '?':
                return CustomTag.Warning;
            case '@':
                return CustomTag.Info;
            case '#':
                return CustomTag.Debug;
            default:
                return CustomTag.None;
        }
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
