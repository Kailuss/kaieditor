import * as vscode from 'vscode';
import { DetectedComment, DecorationStyle, CustomTag } from '../types';
import { TextCleaner } from './textCleaner';
import { ColorManager } from './colorManager';
import { DecorationTypeFactory } from './decorationTypeFactory';
import { getIconUri } from './iconManager';
import { ConfigManager } from '../configManager';

/**
 * Aplicador de decoraciones inline
 */
export class InlineDecorationApplier {
    /**
     * Aplica decoraciones inline (comentarios después de código o de línea)
     * @param editor Editor de texto
     * @param comments Comentarios a decorar
     * @param style Estilo de decoración
     * @param factory Factory de tipos de decoración
     * @param configManager Gestor de configuración
     * @returns Tipo de decoración aplicado o null
     */
    public static apply(
        editor: vscode.TextEditor,
        comments: DetectedComment[],
        style: DecorationStyle,
        factory: DecorationTypeFactory,
        configManager: ConfigManager
    ): vscode.TextEditorDecorationType | null {
        const decorations: vscode.DecorationOptions[] = [];

        comments.forEach(comment => {
            const cleanText = TextCleaner.cleanCommentText(comment.content);
            const formattedText = TextCleaner.formatLongText(cleanText);

            // Obtener colores según tipo y custom tag
            const isDocumentation = comment.isDocumentation || false;
            const colors = ColorManager.getColors(style, isDocumentation, comment.customTag);

            // Preparar opciones de renderizado base
            const hasIcon = configManager.showIcons() && comment.customTag && comment.customTag !== CustomTag.None;
            const iconSize = configManager.getIconSize();
            const leftPadding = hasIcon ? iconSize + 8 : style.paddingHorizontal; // Espacio para icono + margen

            const renderOptions: any = {
                after: {
                    contentText: formattedText,
                    backgroundColor: colors.backgroundColor,
                    color: colors.textColor,
                    fontStyle: style.fontStyle,
                    fontWeight: style.fontWeight,
                    textDecoration: `none; display: inline-block; border-radius: ${style.borderRadius}px; padding: ${style.inlinePaddingTop} ${style.paddingHorizontal}px ${style.inlinePaddingBottom} ${leftPadding}px; opacity: ${style.opacity}; font-size: ${style.inlineFontSize}; transition: opacity 0.3s; vertical-align: middle; margin: 0px; line-height: normal;`
                }
            };

            // Añadir icono si está habilitado y el comentario tiene custom tag
            if (hasIcon) {
                const iconUri = getIconUri(comment.customTag!, colors.textColor, iconSize);
                if (iconUri) {
                    const iconMargin = configManager.getCalculatedIconMargin(false);
                    renderOptions.before = {
                        contentIconPath : iconUri,
                        width           : `${iconSize}px`,
                        height          : `${iconSize}px`,
                        margin          : iconMargin,
                        textDecoration  : `none; display: inline-flex; align-items: center; vertical-align: middle; position: absolute; z-index: 1; padding-left: 4px;`
                    };
                }
            }

            decorations.push({
                range: comment.range,
                hoverMessage: '**Original Comment**\n```\n' + editor.document.getText(comment.range) + '\n```',
                renderOptions
            });
        });

        if (decorations.length === 0) {
            return null;
        }

        const decorationType = factory.createInlineDecoration();
        editor.setDecorations(decorationType, decorations);
        return decorationType;
    }
}
