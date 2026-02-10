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
            backgroundColor        : config.get<string>('backgroundColor'       , '#16161d99'),
            textColor              : config.get<string>('textColor'             , '#eceff4'),
            borderColor            : config.get<string>('borderColor'           , '#4c566a'),
            accentColor            : config.get<string>('accentColor'           , '#3399ffdd'),
            borderRadius           : config.get<number>('borderRadius'          , 4),
            paddingVertical        : config.get<number>('paddingVertical'       , 3),
            paddingHorizontal      : config.get<number>('paddingHorizontal'     , 10),
            fontStyle              : config.get<string>('fontStyle'             , 'normal'),
            fontWeight             : config.get<string>('fontWeight'            , '500'),
            opacity                : config.get<number>('opacity'               , 1),
            inlineFontSize         : config.get<string>('inlineFontSize'        , '0.75em'),
            inlinePaddingTop       : config.get<string>('inlinePaddingTop'      , '1.5px'),
            inlinePaddingBottom    : config.get<string>('inlinePaddingBottom'   , '0.75px'),
            blockFontSize          : config.get<string>('blockFontSize'         , '0.75em'),
            tagColors              : {
                important  : config.get<string>('tagColors.important' , '#ff6b6b99'),
                completed  : config.get<string>('tagColors.completed' , '#49c78a99'),
                warning    : config.get<string>('tagColors.warning'   , '#ffb86b99'),
                info       : config.get<string>('tagColors.info'      , '#74b3ff99'),
                debug      : config.get<string>('tagColors.debug'     , '#b084ff99'),
                pending    : config.get<string>('tagColors.pending'   , '#ffde6b99'),
                active     : config.get<string>('tagColors.active'    , '#61c7fa99'),
                conflict   : config.get<string>('tagColors.conflict'  , '#ff6b6b99'),
                review     : config.get<string>('tagColors.review'    , '#8be9fd99'),
                deprecated : config.get<string>('tagColors.deprecated', '#6c757d99'),
                error      : config.get<string>('tagColors.error'     , '#ff5555cc'),
                note       : config.get<string>('tagColors.note'      , '#f1fa8c99'),
                question   : config.get<string>('tagColors.question'  , '#bd93f999')
            },
            docColors              : {
            backgroundColor : config.get<string>('docColors.backgroundColor', '#061425'),
            borderColor     : config.get<string>('docColors.borderColor'    , '#1b2b3a'),
            textColor       : config.get<string>('docColors.textColor'      , '#bcd6ee')
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
    public reloadConfig(): void { this.config = this.loadConfig();
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
     */
    public getDecorationStyle(): DecorationStyle { return this.config.decorationStyle; }

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
        const rightMargin = isBlock ? iconSize + 4 : iconSize;
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
