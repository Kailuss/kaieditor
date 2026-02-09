import * as vscode   from 'vscode';
import { CustomTag } from '../types';

/**
 * Paths SVG para cada tipo de tag personalizado (solo el contenido, sin wrapper)
 * Los SVGs son de Lucide Icons
 */
const SVG_PATHS: Record<CustomTag, string> = {
    [CustomTag.Important] : `<path d="M12 23C7.85786 23 4.5 19.6421 4.5 15.5C4.5 13.3462 5.40786 11.4045 6.86179 10.0366C8.20403 8.77375 11.5 6.49951 11 1.5C17 5.5 20 9.5 14 15.5C15 15.5 16.5 15.5 19 13.0296C19.2697 13.8032 19.5 14.6345 19.5 15.5C19.5 19.6421 16.1421 23 12 23Z"></path>`,
    [CustomTag.Completed] : `<path d="M12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598L12 1ZM16.4524 8.22183L11.5019 13.1709L8.67421 10.3431L7.25999 11.7574L11.5026 16L17.8666 9.63604L16.4524 8.22183Z"></path>`,
    [CustomTag.Warning]   : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 15V17H13V15H11ZM11 7V13H13V7H11Z"></path>`,
    [CustomTag.Info]      : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 9.5C12.8284 9.5 13.5 8.82843 13.5 8C13.5 7.17157 12.8284 6.5 12 6.5C11.1716 6.5 10.5 7.17157 10.5 8C10.5 8.82843 11.1716 9.5 12 9.5ZM14 15H13V10.5H10V12.5H11V15H10V17H14V15Z"></path>`,
    [CustomTag.Debug]     : `<path d="M6.05636 8.30049C6.11995 8.19854 6.18609 8.09835 6.25469 8H17.7453C17.8139 8.09835 17.88 8.19854 17.9436 8.30049L19.9641 7.13397L20.9641 8.86602L18.7512 10.1436C18.9134 10.7348 19 11.3573 19 12V13H22V15H19C19 15.9534 18.8094 16.8623 18.4642 17.6907L20.9641 19.134L19.9641 20.866L17.4383 19.4077C16.3533 20.7447 14.7853 21.6737 13 21.9291V14H11V21.9291C9.21467 21.6737 7.64665 20.7447 6.56171 19.4077L4.0359 20.866L3.0359 19.134L5.5358 17.6907C5.19061 16.8623 5 15.9534 5 15H2V13H5V12C5 11.3573 5.08661 10.7348 5.2488 10.1436L3.0359 8.86602L4.0359 7.13397L6.05636 8.30049ZM8 6C8 3.79086 9.79086 2 12 2C14.2091 2 16 3.79086 16 6H8Z"></path>`,
    [CustomTag.Pending]   : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 7V13H13V7H11ZM11 15V17H13V15H11Z"></path>`,
    [CustomTag.Active]    : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 7V13H13V7H11ZM11 15V17H13V15H11Z"></path>`,
    [CustomTag.Conflict]  : `<path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11 7V13H13V7H11ZM11 15V17H13V15H11Z"></path>`,
    [CustomTag.None]      : '' // Sin icono para comentarios sin tag
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
