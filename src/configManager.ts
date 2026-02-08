import * as vscode from 'vscode';
import { KaiEditorConfig, SupportedLanguage, DecorationStyle } from './types';

/**
 * Gestor de configuración de la extensión
 * Lee y gestiona la configuración desde workspace settings
 */
export class ConfigManager {
    private static readonly CONFIG_SECTION = 'kaieditor';
    private config: KaiEditorConfig;

    constructor() {
        this.config = this.loadConfig();
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
                SupportedLanguage.Go
            ]),
            decorationStyle: this.loadDecorationStyle(config),
            singleLineStyle: this.loadDecorationStyle(config),
            multiLineStyle: this.loadDecorationStyle(config),
            inlineStyle: this.loadDecorationStyle(config)
        };
    }

    /**
     * Carga el nuevo estilo de decoración con CSS puro
     */
    private loadDecorationStyle(config: vscode.WorkspaceConfiguration): DecorationStyle {
        return {
            backgroundColor        : config.get<string>('backgroundColor', '#2e3440'),
            textColor              : config.get<string>('textColor', '#eceff4'),
            borderColor            : config.get<string>('borderColor', '#4c566a'),
            accentColor            : config.get<string>('accentColor', '#88c0d0'),
            borderRadius           : config.get<number>('borderRadius', 2),
            paddingVertical        : config.get<number>('paddingVertical', 1),
            paddingHorizontal      : config.get<number>('paddingHorizontal', 8),
            fontStyle              : config.get<string>('fontStyle', 'normal'),
            fontWeight             : config.get<string>('fontWeight', '400'),
            opacity                : config.get<number>('opacity', 0.95),
            inlineFontSize         : config.get<string>('inlineFontSize', '0.64em'),
            inlinePaddingTop       : config.get<string>('inlinePaddingTop', '1px'),
            inlinePaddingBottom    : config.get<string>('inlinePaddingBottom', '0.5px'),
            blockFontSize          : config.get<string>('blockFontSize', '0.9em'),
            blockPaddingMultiplier : config.get<number>('blockPaddingMultiplier', 2),
            tagColors              : {
                important : config.get<string>('tagColors.important', '#8b1e1e99'),
                success   : config.get<string>('tagColors.success'  , '#1e5e1e99'),
                warning   : config.get<string>('tagColors.warning'  , '#7a5e1e99'),
                info      : config.get<string>('tagColors.info'     , '#1e4e7a99'),
                debug     : config.get<string>('tagColors.debug'    , '#5e1a7a99')
            },
            docColors              : {
                backgroundColor : config.get<string>('docColors.backgroundColor', '#1a2332'),
                borderColor     : config.get<string>('docColors.borderColor', '#3a4a5a'),
                textColor       : config.get<string>('docColors.textColor', '#a0b0c0')
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
