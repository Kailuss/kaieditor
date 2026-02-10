import * as vscode   from 'vscode';
import { CustomTag } from '../types';

/**
 * Paths SVG para cada tipo de tag personalizado (solo el contenido, sin wrapper)
 * Los SVGs son de Lucide Icons
 */
const SVG_PATHS: Record<CustomTag, string> = {
    [CustomTag.Important]  : `<path d="M12 23C7.85786 23 4.5 19.6421 4.5 15.5C4.5 13.3462 5.40786 11.4045 6.86179 10.0366C8.20403 8.77375 11.5 6.49951 11 1.5C17 5.5 20 9.5 14 15.5C15 15.5 16.5 15.5 19 13.0296C19.2697 13.8032 19.5 14.6345 19.5 15.5C19.5 19.6421 16.1421 23 12 23Z"></path>`,
    [CustomTag.Completed]  : `<path d="M4 3H20C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"></path>`,
    [CustomTag.Warning]    : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path>`,
    [CustomTag.Info]       : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path>`,
    [CustomTag.Debug]      : `<path d="M6.05636 8.30049C6.11995 8.19854 6.18609 8.09835 6.25469 8H17.7453C17.8139 8.09835 17.88 8.19854 17.9436 8.30049L19.9641 7.13397L20.9641 8.86602L18.7512 10.1436C18.9134 10.7348 19 11.3573 19 12V13H22V15H19C19 15.9534 18.8094 16.8623 18.4642 17.6907L20.9641 19.134L19.9641 20.866L17.4383 19.4077C16.3533 20.7447 14.7853 21.6737 13 21.9291V14H11V21.9291C9.21467 21.6737 7.64665 20.7447 6.56171 19.4077L4.0359 20.866L3.0359 19.134L5.5358 17.6907C5.19061 16.8623 5 15.9534 5 15H2V13H5V12C5 11.3573 5.08661 10.7348 5.2488 10.1436L3.0359 8.86602L4.0359 7.13397L6.05636 8.30049ZM8 6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6H8Z"></path>`,
    [CustomTag.Pending]    : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM13 12V7H11V14H17V12H13Z"></path>`,
    [CustomTag.Active]     : `<path d="M21 15.2426V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5511 3 20.9925V9H9C9.55228 9 10 8.55228 10 8V2H20.0017C20.5531 2 21 2.45531 21 2.9918V6.75736L12.0012 15.7562L11.995 19.995L16.2414 20.0012L21 15.2426ZM21.7782 8.80761L23.1924 10.2218L15.4142 18L13.9979 17.9979L14 16.5858L21.7782 8.80761ZM3 7L8 2.00318V7H3Z"></path>`,
    [CustomTag.Conflict]   : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 7V13H13V7H11ZM11 15V17H13V15H11Z"></path>`,
    [CustomTag.Review]     : `<path d="M1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12ZM12.0003 17C14.7617 17 17.0003 14.7614 17.0003 12C17.0003 9.23858 14.7617 7 12.0003 7C9.23884 7 7.00026 9.23858 7.00026 12C7.00026 14.7614 9.23884 17 12.0003 17ZM12.0003 15C10.3434 15 9.00026 13.6569 9.00026 12C9.00026 10.3431 10.3434 9 12.0003 9C13.6571 9 15.0003 10.3431 15.0003 12C15.0003 13.6569 13.6571 15 12.0003 15Z"></path>`,
    [CustomTag.Deprecated] : `<path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>`,
    [CustomTag.Error]      : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path>`,
    [CustomTag.Note]       : `<path d="M21 8V20.9932C21 21.5501 20.5552 22 20.0066 22H3.9934C3.44495 22 3 21.556 3 21.0082V2.9918C3 2.45531 3.44694 2 3.99826 2H14V8H21ZM21 6H16V1.00001L21 6ZM8 7V9H11V7H8ZM8 11V13H16V11H8ZM8 15V17H16V15H8Z"></path>`,
    [CustomTag.Question]   : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 17V19H13V17H11ZM11 7V15H13V7H11Z"></path>`,
    [CustomTag.None]       : '' // Sin icono para comentarios sin tag
};

/**
 * Caché de data URIs generados por combinación de tag + color + size
 * Clave: `${tag}-${color}-${size}` (ej: "!-#ff6b6b-12")
 * Valor: Data URI del SVG coloreado
 */
const iconCache = new Map<string, vscode.Uri>();

/**
 * Genera un SVG completo con tamaño y color dinámicos
 * @param path Contenido path del SVG
 * @param size Tamaño del icono en píxeles
 * @param color Color del stroke
 * @returns SVG completo como string
 */
function generateSVG(path: string, size: number, color: string): string {

    // Calcula stroke-width proporcional al tamaño (base: 2.5 para 8px)
    const strokeWidth = (size / 8) * 2.5;
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" stroke="none" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${path}</svg>`;
}

/**
 * Genera un data URI de SVG con el color y tamaño especificados
 * Usa caché para evitar regenerar el mismo SVG+color+size múltiples veces
 */
export function getIconUri(tag: CustomTag, color: string, size: number): vscode.Uri | undefined {
    // Sin icono para tags vacíos
    if (tag === CustomTag.None) { return undefined; }

    const cacheKey = `${tag}-${color}-${size}`;

    // Retornar desde caché si existe
    if (iconCache.has(cacheKey)) {
        return iconCache.get(cacheKey);
    }

    // Obtener path SVG
    const path = SVG_PATHS[tag];
    if (!path) { return undefined; }

    // Generar SVG completo con tamaño y color dinámicos
    const completeSvg = generateSVG(path, size, color);

    // Codificar a base64
    const base64Svg = Buffer.from(completeSvg).toString('base64');

    // Crear data URI
    const dataUri = vscode.Uri.parse(`data:image/svg+xml;base64,${base64Svg}`);

    // Guardar en caché
    iconCache.set(cacheKey, dataUri);

    return dataUri;
}

/**
 * Limpia la caché de iconos
 * Útil si se cambian colores dinámicamente
 */
export function clearIconCache(): void {
    iconCache.clear();
}

/**
 * Obtiene el tamaño de la caché actual (útil para debugging)
 */
export function getIconCacheSize(): number {
    return iconCache.size;
}
