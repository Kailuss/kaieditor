import * as vscode                    from 'vscode'                 ;
import { DetectedComment, CustomTag } from '../types'               ;
import { TextCleaner                } from './textCleaner'          ;
import { DecorationTypeFactory      } from './decorationTypeFactory';
import { getIconUri                 } from './iconManager'          ;
import { ConfigManager              } from '../configManager'       ;

/**
 * Aplicador de decoraciones inline
 */
export class InlineDecorationApplier {
    /**
     * Aplica decoraciones inline (comentarios después de código o de línea)
     * @param editor Editor de texto
     * @param comments Comentarios a decorar
     * @param factory Factory de tipos de decoración
     * @param configManager Gestor de configuración
     * @returns Tipo de decoración aplicado o null
     */
    public static apply(
        editor        : vscode.TextEditor,
        comments      : DetectedComment[],
        factory       : DecorationTypeFactory,
        configManager : ConfigManager
    ): vscode.TextEditorDecorationType | null {
        const decorations: vscode.DecorationOptions[] = [];
        const styleManager = configManager.getStyleManager();
        const inlineStyles = styleManager.getInlineStyles();

        comments.forEach(comment => {

            const cleanText       = TextCleaner.cleanCommentText(comment.content);
            const formattedText   = TextCleaner.formatLongText(cleanText);
            // Obtiene colores según tipo y custom tag
            const isDocumentation = comment.isDocumentation || false;
            const colors          = styleManager.getColors(isDocumentation, comment.customTag);
            // Prepara opciones de renderizado base
            const hasIcon         = !!(configManager.showIcons() && comment.customTag && comment.customTag !== CustomTag.None);
            const iconSize        = configManager.getIconSize();
            // Construye CSS usando StyleManager
            const inlineCSS       = styleManager.buildInlineCSS(hasIcon, colors.backgroundColor);

            const renderOptions: any = {
                after: {
                    contentText    : formattedText,
                    color          : colors.textColor,
                    fontStyle      : inlineStyles.fontStyle,
                    fontWeight     : inlineStyles.fontWeight,
                    textDecoration : inlineCSS
                }
            };

            // Añade icono si está habilitado y el comentario tiene custom tag
            if (hasIcon) {
                const iconUri = getIconUri(comment.customTag!, colors.textColor, iconSize);
                if (iconUri) {
                    const iconMargin = styleManager.getIconMargin(false);
                    const iconCSS = styleManager.buildIconCSS(false);
                    renderOptions.before = {
                        contentIconPath : iconUri,
                        width           : `${iconSize}px`,
                        height          : `${iconSize}px`,
                        margin          : iconMargin,
                        textDecoration  : iconCSS
                    };
                }
            }

            decorations.push({
                range: comment.range,
                renderOptions
            });
        });

        if (decorations.length === 0) { return null; }

        const decorationType = factory.createInlineDecoration();
        editor.setDecorations(decorationType, decorations);
        return decorationType;
    }
}
