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
     * @returns Array de tipos de decoración aplicados
     */
    public static apply(
        editor: vscode.TextEditor,
        comments: DetectedComment[],
        style: DecorationStyle,
        factory: DecorationTypeFactory
    ): vscode.TextEditorDecorationType[] {
        const backgroundDecorations: vscode.DecorationOptions[] = [];
        const textDecorations: vscode.DecorationOptions[] = [];
        const hideDecorations: vscode.DecorationOptions[] = [];

        comments.forEach(comment => {
            // Obtener colores según si es documentación
            const isDocumentation = comment.isDocumentation || false;
            const colors = ColorManager.getColors(style, isDocumentation);

            // Obtener el texto del comentario del editor
            const fullText = editor.document.getText(comment.range);
            const lines = fullText.split('\n');

            // Calcular el ancho máximo del bloque en caracteres
            let maxWidth = 0;
            lines.forEach(line => {
                const cleanedLine = TextCleaner.cleanCommentText(line);
                if (cleanedLine.length > maxWidth) {
                    maxWidth = cleanedLine.length;
                }
            });

            // Calcular el ancho en píxeles aproximado (usando tamaño de fuente monospace)
            // fontSize promedio: ~0.6em por caracter en fuentes monospace
            const estimatedWidthCh = maxWidth + 4; // +4 para padding visual
            
            // Crear decoración de fondo en la PRIMERA línea (para que se dibuje desde arriba)
            const firstLineEnd = new vscode.Position(
                comment.range.start.line,
                editor.document.lineAt(comment.range.start.line).text.length
            );

            backgroundDecorations.push({
                range: new vscode.Range(comment.range.start, firstLineEnd),
                hoverMessage: '**Block Comment**\n```\n' + fullText + '\n```',
                renderOptions: {
                    after: {
                        contentText: '',
                        backgroundColor: colors.backgroundColor,
                        textDecoration: `none; display: inline-block; border-radius: ${style.borderRadius}px; border-left: 3px solid ${colors.textColor}; padding: ${style.inlinePaddingTop} ${style.paddingHorizontal}px ${style.inlinePaddingBottom} ${style.paddingHorizontal}px; opacity: ${style.opacity}; margin: 0px 0px 0px 8px; width: ${estimatedWidthCh}ch; min-height: ${lines.length * 1.3}em;`
                    }
                }
            });

            // Ocultar todo el comentario original (todas las líneas)
            hideDecorations.push({
                range: comment.range,
                renderOptions: {}
            });

            // Procesar cada línea del bloque para crear decoraciones de texto
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const lineNumber = comment.range.start.line + i;
                const lineText = editor.document.lineAt(lineNumber).text;
                
                // Encontrar dónde empieza y termina el comentario en esta línea
                const commentStart = i === 0 ? comment.range.start.character : 0;
                const commentEnd = i === lines.length - 1 
                    ? comment.range.end.character 
                    : lineText.length;

                // Limpiar el contenido de la línea (quitar /**, */, *, etc)
                const cleanedLine = TextCleaner.cleanCommentText(line);
                
                // Skip líneas completamente vacías
                if (cleanedLine.trim().length === 0) {
                    continue;
                }

                // Crear decoración de texto sin bordes ni fondo
                textDecorations.push({
                    range: new vscode.Range(
                        new vscode.Position(lineNumber, commentStart),
                        new vscode.Position(lineNumber, commentEnd)
                    ),
                    renderOptions: {
                        after: {
                            contentText: cleanedLine,
                            color: colors.textColor,
                            fontStyle: style.fontStyle,
                            fontWeight: style.fontWeight,
                            textDecoration: `none; display: block; opacity: ${style.opacity}; font-size: ${style.blockFontSize}; margin: 0px 0px 0px ${style.paddingHorizontal + 11}px; line-height: 1.3; position: relative; top: ${i === 0 ? '0.2em' : '0'};`
                        }
                    }
                });
            }
        });

        if (backgroundDecorations.length === 0 && textDecorations.length === 0) {
            return [];
        }

        const decorationTypes: vscode.TextEditorDecorationType[] = [];

        // Aplicar decoraciones para ocultar el texto original
        if (hideDecorations.length > 0) {
            const hideDecorationType = factory.createBlockDecoration();
            editor.setDecorations(hideDecorationType, hideDecorations);
            decorationTypes.push(hideDecorationType);
        }

        // Aplicar decoraciones de fondo
        if (backgroundDecorations.length > 0) {
            const bgDecorationType = factory.createBlockBackgroundDecoration();
            editor.setDecorations(bgDecorationType, backgroundDecorations);
            decorationTypes.push(bgDecorationType);
        }

        // Aplicar decoraciones de texto
        if (textDecorations.length > 0) {
            const textDecorationType = vscode.window.createTextEditorDecorationType({
                rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
            });
            editor.setDecorations(textDecorationType, textDecorations);
            decorationTypes.push(textDecorationType);
        }

        return decorationTypes;
    }
}
