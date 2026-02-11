
import * as vscode from 'vscode';
import { KaiEditorConfig, SupportedLanguage, DecorationStyle } from './types';
import { StyleManager } from './decorationManagement/styleManager';

/**
 * Gestor de configuración de la extensión
 * Lee y gestiona la configuración desde workspace settings
 */
export class ConfigManager {
    private static readonly CONFIG_SECTION = 'kaieditor';
    private config: KaiEditorConfig;
    private styleManager: StyleManager;

    constructor() {
        this.config = this.loadConfig();
        const vsConfig = vscode.workspace.getConfiguration(ConfigManager.CONFIG_SECTION);
        this.styleManager = new StyleManager(vsConfig);
    }

    /**
     * Carga la configuración desde VS Code settings
     */
    private loadConfig(): KaiEditorConfig {
        const config = vscode.workspace.getConfiguration(ConfigManager.CONFIG_SECTION);

        return {
            enabled: config.get<boolean>('enabled', true),
            enabledLanguages: config.get<SupportedLanguage[]>('enabledLanguages', [
                SupportedLanguage.JavaScript,
                SupportedLanguage.TypeScript,
                SupportedLanguage.Python,
                SupportedLanguage.Rust,
                SupportedLanguage.Go,
                SupportedLanguage.CSharp,
                SupportedLanguage.Java,
                SupportedLanguage.PHP
            ]),
            decorationStyle: this.loadDecorationStyle(config),
            showIcons: config.get<boolean>('showIcons', true),
            iconSize: 16 // Tamaño fijo optimizado
        };
    }

    /**
     * Carga el nuevo estilo de decoración con CSS puro
     */
    private loadDecorationStyle(config: vscode.WorkspaceConfiguration): DecorationStyle {
        return {
            backgroundColor        : '#4c566a',
            textColor              : '#ffffffdd',
            borderColor            : '#4c566a00',
            accentColor            : '#3399ffdd',
            borderRadius           : 16,
            paddingVertical        : 4,
            paddingHorizontal      : 10,
            fontStyle              : 'normal',
            fontWeight             : '500',
            opacity                : 1,
            inlineFontSize         : '0.75em',
            inlinePaddingTop       : '1.75px',
            inlinePaddingBottom    : '2px',
            blockFontSize          : '0.75em',
            tagColors              : {
                important  : '#ff6b6bcc',
                completed  : '#49c78acc',
                warning    : '#ffb86bcc',
                info       : '#74b3ffcc',
                debug      : '#b084ffcc',
                pending    : '#ffde6bcc',
                active     : '#61c7facc',
                conflict   : '#ff6b6bcc',
                review     : '#8be9fd99',
                deprecated : '#6c757d99',
                error      : '#ff5555cc',
                note       : '#f1fa8c99',
                question   : '#bd93f999'
            },
            docColors              : {
            backgroundColor : '#061425',
            borderColor     : '#1b2b3a',
            textColor       : '#bcd6ee'
            }
        };
    }

    /**
     * Obtiene la configuración actual
     */
    public getConfig(): KaiEditorConfig {
        return this.config;
    }

    /**
     * Recarga la configuración (útil cuando el usuario cambia settings)
     */
    public reloadConfig(): void { 
        this.config = this.loadConfig();
        const vsConfig = vscode.workspace.getConfiguration(ConfigManager.CONFIG_SECTION);
        this.styleManager = new StyleManager(vsConfig);
        this.styleManager.clearCache();
    }

    /**
     * Verifica si la extensión está habilitada
     */
    public isEnabled(): boolean {
        return this.config.enabled;
    }

    /**
     * Verifica si un lenguaje está habilitado
     */
    public isLanguageEnabled(language: SupportedLanguage): boolean {
        return this.config.enabledLanguages.includes(language);
    }

    /**
     * Obtiene el estilo de decoración actual
     * @deprecated Use getStyleManager() instead for better separation of concerns
     */
    public getDecorationStyle(): DecorationStyle { return this.config.decorationStyle; }

    /**
     * Obtiene el StyleManager que centraliza toda la configuración visual
     */
    public getStyleManager(): StyleManager {
        return this.styleManager;
    }

    /**
     * Verifica si los iconos están habilitados
     */
    public showIcons(): boolean { return this.config.showIcons; }

    /**
     * Obtiene el tamaño de los iconos en píxeles (siempre 16px)
     */
    public getIconSize(): number { return this.config.iconSize; }

    /**
     * Calcula el margen óptimo para iconos de 16px
     * @param isBlock Si es decoración de bloque (necesita más espacio)
     * @returns Margen CSS en formato 'top right bottom left'
     */
    public getCalculatedIconMargin(isBlock: boolean = false): string {
        const iconSize = this.config.iconSize;
        // Margen negativo a la derecha para que el icono se solape con el fondo de la decoración
        // Block necesita +4px extra para compensar el padding del contenedor
        const rightMargin = !isBlock ? iconSize + 14 : iconSize;
        return `0.14em -${rightMargin}px 0 0`;
    }

    /**
     * Registra un listener para cambios de configuración
     */
    public onConfigChange(callback: () => void): vscode.Disposable {
        return vscode.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration(ConfigManager.CONFIG_SECTION)) {
                this.reloadConfig();
                callback();
            }
        });
    }
}
