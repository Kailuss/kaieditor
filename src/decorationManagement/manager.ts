import * as vscode                      from 'vscode';
import { DetectedComment, CommentType } from '../types';
import { ConfigManager }                from '../configManager';
import { DecorationTypeFactory }        from './decorationTypeFactory';
import { InlineDecorationApplier }      from './inlineDecorationApplier';
import { BlockDecorationApplier }       from './blockDecorationApplier';

/**
 * Gestor principal de decoraciones visuales para comentarios
 * Transforma comentarios en cajas visuales estilizadas con CSS
 */
export class DecorationManager {
    private configManager: ConfigManager;
    private decorationFactory: DecorationTypeFactory;
    private activeDecorations: Map<string, vscode.TextEditorDecorationType[]>;

    constructor(configManager: ConfigManager) {
        this.configManager = configManager;
        this.decorationFactory = new DecorationTypeFactory();
        this.activeDecorations = new Map();
    }

    /**
     * Aplica decoraciones a todos los comentarios detectados
     * Los comentarios están siempre decorados/ocultos EXCEPTO en la línea donde está el cursor
     * @param editor Editor de texto
     * @param comments Comentarios detectados
     */
    public applyDecorations(
        editor: vscode.TextEditor,
        comments: DetectedComment[]
    ): void {
        const documentUri = editor.document.uri.toString();
        
        // Guardar decoraciones antiguas para mantenerlas visibles durante la transición
        const oldDecorations = this.activeDecorations.get(documentUri);

        if (comments.length === 0) {
            this.clearDecorations(documentUri);
            return;
        }

        // Filtrar comentarios donde NO está el cursor
        // Si el cursor está en cualquier línea que contiene el comentario, mostrar el original (no decorar)
        // Esto hace que los comentarios estén siempre decorados/ocultos EXCEPTO en la línea actual
        const cursorLine = editor.selection.active.line;
        const commentsToDecorate = comments.filter(comment => {
            const commentStartLine = comment.range.start.line;
            const commentEndLine = comment.range.end.line;
            // No decorar si el cursor está en alguna línea del comentario
            return cursorLine < commentStartLine || cursorLine > commentEndLine;
        });

        // Agrupar comentarios por tipo
        const singleLineComments = commentsToDecorate.filter(c => c.type === CommentType.SingleLine && !c.isAfterCode);
        const multiLineComments = commentsToDecorate.filter(c => c.type === CommentType.MultiLine || c.type === CommentType.Documentation);
        const inlineComments = commentsToDecorate.filter(c => c.type === CommentType.Inline || c.isAfterCode);

        const decorations: vscode.TextEditorDecorationType[] = [];

        // Aplicar decoraciones para comentarios inline
        if (inlineComments.length > 0) {
            const decoration = InlineDecorationApplier.apply(editor, inlineComments, this.decorationFactory, this.configManager);
            if (decoration) {
                decorations.push(decoration);
            }
        }

        // Aplicar decoraciones para comentarios de línea
        if (singleLineComments.length > 0) {
            const decoration = InlineDecorationApplier.apply(editor, singleLineComments, this.decorationFactory, this.configManager);
            if (decoration) {
                decorations.push(decoration);
            }
        }

        // Aplicar decoraciones para bloques (incluye Documentation)
        if (multiLineComments.length > 0) {
            const blockDecorations = BlockDecorationApplier.apply(editor, multiLineComments, this.decorationFactory, this.configManager);
            decorations.push(...blockDecorations);
        }

        // Guardar nuevas decoraciones
        this.activeDecorations.set(documentUri, decorations);

        // Limpiar decoraciones antiguas de forma sincrónica
        // Primero clearear del editor (sincrónico), luego dispose (async-safe)
        if (oldDecorations) {
            oldDecorations.forEach(decoration => {
                try {
                    // Clear sincrónico previene duplicación visual en 1 frame
                    editor.setDecorations(decoration, []);
                    decoration.dispose();
                } catch (e) {
                    console.warn('[KaiEditor] Warning disposing old decoration:', e);
                }
            });
        }
    }

    /**
     * Limpia todas las decoraciones de un documento
     * @param documentUri URI del documento
     */
    public clearDecorations(documentUri: string): void {
        const decorations = this.activeDecorations.get(documentUri);
        if (decorations) {
            decorations.forEach(decoration => {
                try {
                    decoration.dispose();
                } catch (e) {
                    console.warn('[KaiEditor] Warning disposing decoration:', e);
                }
            });
            this.activeDecorations.delete(documentUri);
        }

        // Limpiar cache de tipos de decoración para forzar recreación
        this.decorationFactory.clear();
    }

    /**
     * Limpia todas las decoraciones de todos los documentos
     */
    public clearAllDecorations(): void {
        this.activeDecorations.forEach(decorations => { 
            decorations.forEach(decoration => decoration.dispose()); 
        });
        this.activeDecorations.clear();
        this.decorationFactory.clear();
    }

    /**
     * Actualiza decoraciones cuando cambia la configuración
     * @param editor Editor de texto
     * @param comments Comentarios detectados
     */
    public refreshDecorations(editor: vscode.TextEditor, comments: DetectedComment[]): void {
        this.clearAllDecorations();
        this.applyDecorations(editor, comments);
    }

    /**
     * Libera recursos
     */
    public dispose(): void {
        this.clearAllDecorations();
    }
}
