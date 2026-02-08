import { SupportedLanguage, CommentPatterns } from '../types';

/**
 * Gestor de patrones de comentarios para cada lenguaje soportado
 */
export class CommentPatternsManager {
    private patterns: Map<SupportedLanguage, CommentPatterns>;

    constructor() {
        this.patterns = this.initializePatterns();
    }

    /**
     * Inicializa los patrones de comentarios para cada lenguaje soportado
     */
    private initializePatterns(): Map<SupportedLanguage, CommentPatterns> {
        const patterns = new Map<SupportedLanguage, CommentPatterns>();

        // JavaScript y TypeScript
        patterns.set(SupportedLanguage.JavaScript, {
            singleLine: '//',
            multiLineStart: '/**',
            multiLineEnd: '*/'
        });
        patterns.set(SupportedLanguage.TypeScript, {
            singleLine: '//',
            multiLineStart: '/**',
            multiLineEnd: '*/'
        });

        // Python
        patterns.set(SupportedLanguage.Python, {
            singleLine: '#',
            multiLineStart: '"""',
            multiLineEnd: '"""'
        });

        // Rust
        patterns.set(SupportedLanguage.Rust, {
            singleLine: '//',
            multiLineStart: '/*',
            multiLineEnd: '*/'
        });

        // Go
        patterns.set(SupportedLanguage.Go, {
            singleLine: '//',
            multiLineStart: '/*',
            multiLineEnd: '*/'
        });

        return patterns;
    }

    /**
     * Obtiene el patrón de comentarios para un lenguaje específico
     */
    public getPattern(language: SupportedLanguage): CommentPatterns | undefined {
        return this.patterns.get(language);
    }

    /**
     * Verifica si un lenguaje tiene patrones definidos
     */
    public hasPattern(language: SupportedLanguage): boolean {
        return this.patterns.has(language);
    }
}
