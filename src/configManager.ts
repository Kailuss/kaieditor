
import * as vscode from 'vscode';
import { KaiEditorConfig, SupportedLanguage } from './types';
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
        this.styleManager = this.createStyleManager();
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
            showIcons: config.get<boolean>('showIcons', true),
            iconSize: 16 // Tamaño fijo optimizado
        };
    }

    private createStyleManager(): StyleManager {
        const vsConfig = vscode.workspace.getConfiguration(ConfigManager.CONFIG_SECTION);
        return new StyleManager(vsConfig);
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
        this.styleManager = this.createStyleManager();
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
