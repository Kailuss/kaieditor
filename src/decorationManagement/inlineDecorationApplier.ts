import * as vscode from 'vscode';
import { DetectedComment, DecorationStyle } from '../types';
import { TextCleaner } from './textCleaner';
import { ColorManager } from './colorManager';
import { DecorationTypeFactory } from './decorationTypeFactory';

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
     * @returns Tipo de decoración aplicado o null
     */
    public static apply(
        editor: vscode.TextEditor,
        comments: DetectedComment[],
        style: DecorationStyle,
        factory: DecorationTypeFactory
    ): vscode.TextEditorDecorationType | null {
        const decorations: vscode.DecorationOptions[] = [];

        comments.forEach(comment => {
            const cleanText = TextCleaner.cleanCommentText(comment.content);
            const formattedText = TextCleaner.formatLongText(cleanText);

            // Obtener colores según tipo y custom tag
            const isDocumentation = comment.isDocumentation || false;
            const colors = ColorManager.getColors(style, isDocumentation, comment.customTag);
            
            decorations.push({
                range: comment.range,
                hoverMessage: '**Original Comment**\n```\n' + editor.document.getText(comment.range) + '\n```',
                renderOptions: {
                    after: {
                        contentText: formattedText,
                        backgroundColor: colors.backgroundColor,
                        color: colors.textColor,
                        fontStyle: style.fontStyle,
                        fontWeight: style.fontWeight,
                        textDecoration: `none; display: inline-block; border-radius: ${style.borderRadius}px; padding: ${style.inlinePaddingTop || '1px'} ${style.paddingHorizontal}px ${style.inlinePaddingBottom || '0.5px'} ${style.paddingHorizontal}px; opacity: ${style.opacity}; font-size: ${style.inlineFontSize || '0.64em'}; transition: opacity 0.3s; vertical-align: middle; margin: 0px; line-height: normal;`
                    }
                }
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
