import * as vscode from 'vscode';
import { DetectedComment, DecorationStyle } from '../types';
import { TextCleaner } from './textCleaner';
import { ColorManager } from './colorManager';
import { DecorationTypeFactory } from './decorationTypeFactory';

/**
 * Aplicador de decoraciones para bloques multilínea
 */
export class BlockDecorationApplier {
    /**
     * Aplica decoraciones para bloques multilínea
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
            // Limpiar texto del bloque (maneja múltiples líneas)
            const cleanText = TextCleaner.cleanBlockText(comment.content);
            const formattedText = TextCleaner.formatLongText(cleanText, 120);
            
            // Obtener colores según si es documentación
            const isDocumentation = comment.isDocumentation || false;
            const colors = ColorManager.getColors(style, isDocumentation);
            
            // Decorar TODO el bloque (todas las líneas) con la caja en la primera línea
            decorations.push({
                range: comment.range,
                hoverMessage: '**Block Comment**\n```\n' + editor.document.getText(comment.range) + '\n```',
                renderOptions: {
                    after: {
                        contentText: formattedText,
                        backgroundColor: colors.backgroundColor,
                        color: colors.textColor,
                        fontStyle: style.fontStyle,
                        fontWeight: style.fontWeight,
                        textDecoration: `none; display: inline-block; border-radius: ${style.borderRadius}px; padding: ${style.inlinePaddingTop || '1px'} ${style.paddingHorizontal}px ${style.inlinePaddingBottom || '0.5px'} ${style.paddingHorizontal}px; opacity: ${style.opacity}; font-size: ${style.blockFontSize || '0.9em'}; transition: opacity 0.3s; vertical-align: top; margin: 0px 0px 0px 8px; line-height: normal;`
                    }
                }
            });
        });

        if (decorations.length === 0) {
            return null;
        }

        const blockDecorationType = factory.createBlockDecoration();
        editor.setDecorations(blockDecorationType, decorations);
        return blockDecorationType;
    }
}
