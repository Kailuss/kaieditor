import * as vscode from 'vscode';
import { InlineStyleConfig }                            from './styles/inlineStyles';
import { BlockStyleConfig }                             from './styles/blockStyles';
import { BaseStyleConfig, TagColorMap, DocColorConfig } from './styles/baseStyles';
import { CustomTag }                                    from '../types';

/**
 * Color result for a decoration
 */
type ColorResult = {
    backgroundColor : string;
    textColor       : string;
    borderColor?    : string;
};

/**
 * StyleManager - Centralizes all visual styling configuration
 * Manages both inline and block decoration styles with CSS caching
 */
export class StyleManager {
    private inlineStyles : InlineStyleConfig;
    private blockStyles  : BlockStyleConfig;

    // CSS cache to avoid rebuilding strings repeatedly
    private cssCache : Map<string, string> = new Map();

    constructor(config: vscode.WorkspaceConfiguration) {
        // Load base configuration
        const baseConfig = this.loadBaseConfig(config);

        // Build inline and block specific configs
        this.inlineStyles = this.buildInlineConfig(config, baseConfig);
        this.blockStyles = this.buildBlockConfig(config, baseConfig);
    }

    /**
     * Loads base configuration shared between inline and block styles
     */
    private loadBaseConfig(config: vscode.WorkspaceConfiguration): BaseStyleConfig {
        return {
            backgroundColor : config.get<string>('decorationStyle.backgroundColor', '#4c566a'),
            textColor       : config.get<string>('decorationStyle.textColor',       '#ffffffdd'),
            borderColor     : config.get<string>('decorationStyle.borderColor',     '#4c566a00'),
            accentColor     : config.get<string>('decorationStyle.accentColor',     '#3399ffdd'),
            fontStyle       : config.get<string>('decorationStyle.fontStyle',       'normal'),
            fontWeight      : config.get<string>('decorationStyle.fontWeight',      '500'),
            opacity         : config.get<number>('decorationStyle.opacity',         1),
            tagColors       : this.loadTagColors(config),
            docColors       : this.loadDocColors(config)
        };
    }

    /**
     * Loads tag colors configuration
     */
    private loadTagColors(config: vscode.WorkspaceConfiguration): TagColorMap {
        return {
            important  : config.get<string>('decorationStyle.tagColors.important',  '#ff6b6bcc'),
            completed  : config.get<string>('decorationStyle.tagColors.completed',  '#49c78acc'),
            warning    : config.get<string>('decorationStyle.tagColors.warning',    '#ffb86bcc'),
            info       : config.get<string>('decorationStyle.tagColors.info',       '#74b3ffcc'),
            debug      : config.get<string>('decorationStyle.tagColors.debug',      '#b084ffcc'),
            pending    : config.get<string>('decorationStyle.tagColors.pending',    '#ffde6bcc'),
            active     : config.get<string>('decorationStyle.tagColors.active',     '#61c7facc'),
            conflict   : config.get<string>('decorationStyle.tagColors.conflict',   '#ff6b6bcc'),
            review     : config.get<string>('decorationStyle.tagColors.review',     '#8be9fd99'),
            deprecated : config.get<string>('decorationStyle.tagColors.deprecated', '#6c757d99'),
            error      : config.get<string>('decorationStyle.tagColors.error',      '#ff5555cc'),
            note       : config.get<string>('decorationStyle.tagColors.note',       '#f1fa8c99'),
            question   : config.get<string>('decorationStyle.tagColors.question',   '#bd93f999')
        };
    }

    /**
     * Loads documentation colors configuration
     */
    private loadDocColors(config: vscode.WorkspaceConfiguration): DocColorConfig {
        return {
            backgroundColor : config.get<string>('decorationStyle.docColors.backgroundColor', '#061425'),
            borderColor     : config.get<string>('decorationStyle.docColors.borderColor',     '#1b2b3a'),
            textColor       : config.get<string>('decorationStyle.docColors.textColor',       '#bcd6ee')
        };
    }

    /**
     * Builds inline-specific configuration
     */
    private buildInlineConfig(config: vscode.WorkspaceConfiguration, base: BaseStyleConfig): InlineStyleConfig {
        const paddingHorizontal = config.get<number>('decorationStyle.paddingHorizontal', 10);
        const borderRadius      = config.get<number>('decorationStyle.borderRadius',      16);
        const iconSize          = 16; // Fixed icon size
        const iconMargin        = this.calculateIconMargin(iconSize, false);

        return {
            ...base,
            fontSize          : config.get<string>('decorationStyle.inlineFontSize',      '0.75em'),
            paddingTop        : config.get<string>('decorationStyle.inlinePaddingTop',    '1.75px'),
            paddingBottom     : config.get<string>('decorationStyle.inlinePaddingBottom', '2px'),
            paddingHorizontal : paddingHorizontal,
            borderRadius      : borderRadius,
            iconMargin        : iconMargin
        };
    }

    /**
     * Builds block-specific configuration
     */
    private buildBlockConfig(config: vscode.WorkspaceConfiguration, base: BaseStyleConfig): BlockStyleConfig {
        const paddingHorizontal = config.get<number>('decorationStyle.paddingHorizontal', 10);
        const borderRadius      = config.get<number>('decorationStyle.borderRadius',      16);
        const iconSize          = 16; // Fixed icon size
        const iconMargin        = this.calculateIconMargin(iconSize, true);

        return {
            ...base,
            fontSize          : config.get<string>('decorationStyle.blockFontSize',   '0.75em'),
            paddingVertical   : config.get<number>('decorationStyle.paddingVertical', 4),
            paddingHorizontal : paddingHorizontal,
            borderRadius      : borderRadius,
            borderWidth       : '1px',
            borderStyle       : 'solid',
            iconMargin        : iconMargin
        };
    }

    /**
     * Calculates optimal icon margin for 16px icons
     */
    private calculateIconMargin(iconSize: number, isBlock: boolean): string {
        // Negative right margin so icon overlaps with decoration background
        // Block needs +4px extra to compensate for container padding
        const rightMargin = !isBlock ? iconSize + 14 : iconSize;
        return `0.14em -${rightMargin}px 0 0`;
    }

    /**
     * Gets inline style configuration
     */
    public getInlineStyles(): InlineStyleConfig { return this.inlineStyles; }

    /**
     * Gets block style configuration
     */
    public getBlockStyles(): BlockStyleConfig { return this.blockStyles; }

    /**
     * Builds inline CSS string with caching
     * @param hasIcon Whether the decoration has an icon
     * @param tagColor Optional tag color override
     */
    public buildInlineCSS(hasIcon: boolean, tagColor?: string): string {
        const cacheKey = `inline-${hasIcon}-${tagColor || 'default'}`;

        if (this.cssCache.has(cacheKey)) { return this.cssCache.get(cacheKey)!; }

        const style       = this.inlineStyles;
        const leftPadding = hasIcon ? 16 + 16 : style.paddingHorizontal; // Icon size + margin
        const bgColor     = tagColor || style.backgroundColor;

        const css = `none;
            display          : inline-block;
            border-radius    : ${style.borderRadius}px;
            padding          : ${style.paddingTop} ${style.paddingHorizontal}px ${style.paddingBottom} ${leftPadding}px;
            opacity          : ${style.opacity};
            font-size        : ${style.fontSize};
            transition       : opacity 0.3s;
            vertical-align   : middle;
            margin           : 0px;
            line-height      : normal;
            background-color : ${bgColor};`;

        this.cssCache.set(cacheKey, css);
        return css;
    }

    /**
     * Builds block CSS string with caching
     * @param isFirstLine Whether this is the first line of the block
     */
    public buildBlockCSS(isFirstLine: boolean): string {
        const cacheKey = `block-${isFirstLine}`;

        if (this.cssCache.has(cacheKey)) { return this.cssCache.get(cacheKey)!; }

        const style     = this.blockStyles;
        const topOffset = isFirstLine ? '0.2em' : '0';
        const css       = `none; 
            display        : block;
            opacity        : ${style.opacity};
            font-size      : ${style.fontSize};
            margin         : 0px 0px 0px ${style.paddingHorizontal + 11}px;
            line-height    : 1.3;
            position       : relative;
            top            : ${topOffset};`;

        this.cssCache.set(cacheKey, css);
        return css;
    }

    /**
     * Builds icon CSS string with caching
     * @param isBlock Whether this is for a block decoration
     */
    public buildIconCSS(isBlock: boolean): string {
        const cacheKey = `icon-${isBlock}`;

        if (this.cssCache.has(cacheKey)) { return this.cssCache.get(cacheKey)!; }

        const paddingLeft = isBlock ? '0.2em' : '10px';
        const paddingTop  = isBlock ? '0.2em' : '0';

        const css = `none;
            display        : inline-flex;
            align-items    : center;
            vertical-align : middle;
            position       : absolute;
            z-index        : 1;
            padding-left   : ${paddingLeft};
            padding-top    : ${paddingTop};`;

        this.cssCache.set(cacheKey, css);
        return css;
    }

    /**
     * Gets colors for a decoration based on context
     * @param isDocumentation Whether this is a documentation comment
     * @param customTag Optional custom tag
     */
    public getColors(isDocumentation: boolean, customTag?: CustomTag): ColorResult {
        if (isDocumentation) {
            return {
                backgroundColor : this.inlineStyles.docColors.backgroundColor,
                textColor       : this.inlineStyles.docColors.textColor,
                borderColor     : this.inlineStyles.docColors.borderColor
            };
        }

        if (customTag && customTag !== CustomTag.None) {
            const tagColor = this.getTagColor(customTag);
            return {
                backgroundColor : tagColor,
                textColor       : this.inlineStyles.textColor
            };
        }

        return {
            backgroundColor : this.inlineStyles.backgroundColor,
            textColor       : this.inlineStyles.textColor
        };
    }

    /**
     * Gets the color for a specific tag
     */
    public getTagColor(tag: CustomTag): string {
        const tagMap: Record<CustomTag, keyof TagColorMap | null> = {
            [CustomTag.None]       : null,
            [CustomTag.Important]  : 'important',
            [CustomTag.Completed]  : 'completed',
            [CustomTag.Warning]    : 'warning',
            [CustomTag.Info]       : 'info',
            [CustomTag.Debug]      : 'debug',
            [CustomTag.Pending]    : 'pending',
            [CustomTag.Active]     : 'active',
            [CustomTag.Conflict]   : 'conflict',
            [CustomTag.Review]     : 'review',
            [CustomTag.Deprecated] : 'deprecated',
            [CustomTag.Error]      : 'error',
            [CustomTag.Note]       : 'note',
            [CustomTag.Question]   : 'question'
        };

        const colorKey = tagMap[tag];
        return colorKey ? this.inlineStyles.tagColors[colorKey]
                        : this.inlineStyles.backgroundColor;
    }

    /**
     * Gets icon margin for inline or block decorations
     */
    public getIconMargin(isBlock: boolean): string {
        return isBlock ? this.blockStyles.iconMargin : this.inlineStyles.iconMargin;
    }

    /**
     * Clears the CSS cache (useful when configuration changes)
     */
    public clearCache(): void {
        this.cssCache.clear();
    }

    // ============================================================================
    // FUTURE: Theme System
    // ============================================================================
    // TODO: Implement theme presets factory methods
    // - static nordTheme(): StyleConfig
    // - static githubTheme(): StyleConfig
    // - static draculaTheme(): StyleConfig
    // - static minimalistTheme(): StyleConfig
    // 
    // Theme system would allow users to quickly switch between predefined
    // color schemes and styling configurations without manually setting each property.
    // ============================================================================
}
