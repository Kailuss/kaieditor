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
            backgroundColor        : config.get<string>('backgroundColor', '#071229'),
            textColor              : config.get<string>('textColor', '#000'),
            borderColor            : config.get<string>('borderColor', '#203040'),
            accentColor            : config.get<string>('accentColor', '#39a0c8'),
            borderRadius           : config.get<number>('borderRadius', 50),
            paddingVertical        : config.get<number>('paddingVertical', 1),
            paddingHorizontal      : config.get<number>('paddingHorizontal', 4),
            fontStyle              : config.get<string>('fontStyle', 'normal'),
            fontWeight             : config.get<string>('fontWeight', '400'),
            opacity                : config.get<number>('opacity', 0.92),
            inlineFontSize         : config.get<string>('inlineFontSize', '0.64em'),
            inlinePaddingTop       : config.get<string>('inlinePaddingTop', '1px'),
            inlinePaddingBottom    : config.get<string>('inlinePaddingBottom', '0.5px'),
            blockFontSize          : config.get<string>('blockFontSize', '0.9em'),
            blockPaddingMultiplier : config.get<number>('blockPaddingMultiplier', 2),
            tagColors              : {
            important : config.get<string>('tagColors.important', '#ff6b6b99'),
            success   : config.get<string>('tagColors.success'  , '#49c78a99'),
            warning   : config.get<string>('tagColors.warning'  , '#ffb86b99'),
            info      : config.get<string>('tagColors.info'     , '#74b3ff99'),
            debug     : config.get<string>('tagColors.debug'    , '#b084ff99')
            },
            docColors              : {
            backgroundColor : config.get<string>('docColors.backgroundColor', '#061425'),
            borderColor     : config.get<string>('docColors.borderColor', '#1b2b3a'),
            textColor       : config.get<string>('docColors.textColor', '#bcd6ee')
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
