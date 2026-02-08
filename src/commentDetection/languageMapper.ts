import { SupportedLanguage } from '../types';

/**
 * Gestor de mapeo entre IDs de lenguaje de VS Code y lenguajes soportados
 */
export class LanguageMapper {
    private languageMapping: Record<string, SupportedLanguage>;

    constructor() {
        this.languageMapping = {
            'javascript': SupportedLanguage.JavaScript,
            'javascriptreact': SupportedLanguage.JavaScript,
            'typescript': SupportedLanguage.TypeScript,
            'typescriptreact': SupportedLanguage.TypeScript,
            'python': SupportedLanguage.Python,
            'rust': SupportedLanguage.Rust,
            'go': SupportedLanguage.Go
        };
    }

    /**
     * Mapea el ID del lenguaje de VS Code a nuestro enum
     */
    public mapLanguageId(languageId: string): SupportedLanguage | null {
        return this.languageMapping[languageId] || null;
    }

    /**
     * Verifica si un lenguaje está soportado
     */
    public isLanguageSupported(languageId: string): boolean {
        return this.mapLanguageId(languageId) !== null;
    }

    /**
     * Obtiene todos los IDs de lenguaje soportados
     */
    public getSupportedLanguageIds(): string[] {
        return Object.keys(this.languageMapping);
    }
}
