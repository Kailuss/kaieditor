/**
 * Utilidades para formateo de texto
 */
export class TextFormatter {
    // Mapeo de caracteres a Unicode Bold
    private static readonly BOLD_CHARS: Record<string, string> = {
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
        'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
        'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
        'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
        'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
        'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
        'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
        '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲',
        '7': '𝟳', '8': '𝟴', '9': '𝟵'
    };

    /**
     * Convierte texto a Unicode Bold
     * @param text Texto a convertir
     * @returns Texto en formato Unicode Bold
     */
    public static toBold(text: string): string {
        return text.split('').map(c => TextFormatter.BOLD_CHARS[c] || c).join('');
    }

    /**
     * Limpia el contenido de un tag (quita asteriscos, espacios extra, etc)
     * @param content Contenido a limpiar
     * @returns Contenido limpio
     */
    public static cleanContent(content: string): string {
        return content
            .split('\n')
            .map(line => line.trim().replace(/^\*\s*/, '').trim())
            .filter(line => line.length > 0)
            .join(' ')
            .trim();
    }

    /**
     * Obtiene el título formateado para un tag
     * @param tagName Nombre del tag
     * @param attributes Atributos del tag
     * @returns Título formateado
     */
    public static getTagTitle(tagName: string, attributes?: Record<string, string>): string {
        switch (tagName.toLowerCase()) {
            case 'summary':
                return 'Summary';
            case 'param':
                return attributes?.name ? `Parameter ${attributes.name}` : 'Parameter';
            case 'return':
            case 'returns':
                return 'Returns';
            case 'remarks':
                return 'Remarks';
            case 'example':
                return 'Example';
            default:
                return tagName.charAt(0).toUpperCase() + tagName.slice(1);
        }
    }
}
