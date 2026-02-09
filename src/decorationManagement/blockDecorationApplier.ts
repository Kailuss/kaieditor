import * as vscode from 'vscode';
import { DetectedComment, DecorationStyle, CustomTag } from '../types';
import { TextCleaner } from './textCleaner';
import { ColorManager } from './colorManager';
import { DecorationTypeFactory } from './decorationTypeFactory';
import { getIconUri } from './iconManager';
import { ConfigManager } from '../configManager';

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
     * @param configManager Gestor de configuración
     * @returns Array de tipos de decoración aplicados
     */
    public static apply(
        editor   : vscode.TextEditor,
        comments : DetectedComment[],
        style    : DecorationStyle,
        factory  : DecorationTypeFactory,
        configManager: ConfigManager
    ): vscode.TextEditorDecorationType[] {
        const backgroundDecorations : vscode.DecorationOptions[] = [];
        const textDecorations       : vscode.DecorationOptions[] = [];
        const hideDecorations       : vscode.DecorationOptions[] = [];
        const iconDecorations       : vscode.DecorationOptions[] = [];

        comments.forEach(comment => {
            // Obtener colores según si es documentación
            const isDocumentation = comment.isDocumentation || false;
            const colors = ColorManager.getColors(style, isDocumentation, comment.customTag);

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

            // Calcular padding izquierdo si hay icono
            const hasIcon = configManager.showIcons() && comment.customTag && comment.customTag !== CustomTag.None;
            const iconSize = configManager.getIconSize();
            const leftPadding = hasIcon ? iconSize + 8 : style.paddingHorizontal;

            // Crear decoración de fondo en la PRIMERA línea (para que se dibuje desde arriba)
            const firstLineEnd = new vscode.Position(
                comment.range.start.line,
                editor.document.lineAt(comment.range.start.line).text.length
            );

            // Añadir icono en la primera línea si está habilitado
            if (hasIcon) {
                const iconUri = getIconUri(comment.customTag!, colors.textColor, iconSize);
                if (iconUri) {
                    const iconMargin = configManager.getCalculatedIconMargin(true);
                    iconDecorations.push({
                        range: new vscode.Range(comment.range.start, firstLineEnd),
                        renderOptions: {
                            before: {
                                contentIconPath: iconUri,
                                width: `${iconSize}px`,
                                height: `${iconSize}px`,
                                margin: iconMargin,
                                textDecoration: `none; display: inline-flex; align-items: center; vertical-align: middle; position: absolute; z-index: 1; padding-left: 0.2em; padding-top: 0.2em;`
                            }
                        }
                    });
                }
            }

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

        // Aplicar decoraciones de iconos (si existen)
        if (iconDecorations.length > 0) {
            const iconDecorationType = vscode.window.createTextEditorDecorationType({
                rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
            });
            editor.setDecorations(iconDecorationType, iconDecorations);
            decorationTypes.push(iconDecorationType);
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
