import * as vscode from 'vscode';
import { DetectedComment, CommentType } from '../types';
import { ConfigManager } from '../configManager';
import { DecorationTypeFactory } from './decorationTypeFactory';
import { InlineDecorationApplier } from './inlineDecorationApplier';
import { BlockDecorationApplier } from './blockDecorationApplier';

/**
 * Gestor principal de decoraciones visuales para comentarios
 * Transforma comentarios en cajas visuales estilizadas con CSS puro
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
     * @param editor Editor de texto
     * @param comments Comentarios detectados
     * @param selection Selección actual del editor (opcional)
     */
    public applyDecorations(
        editor: vscode.TextEditor,
        comments: DetectedComment[],
        selection?: vscode.Selection
    ): void {
        // Limpiar decoraciones anteriores PRIMERO
        const documentUri = editor.document.uri.toString();
        this.clearDecorations(documentUri);

        if (comments.length === 0) {
            return;
        }

        // Filtrar comentarios donde NO está el cursor ni hay selección
        const commentsToDecorate = selection 
            ? comments.filter(comment => !comment.range.intersection(selection))
            : comments;

        // Agrupar comentarios por tipo
        const singleLineComments = commentsToDecorate.filter(c => c.type === CommentType.SingleLine && !c.isAfterCode);
        const multiLineComments = commentsToDecorate.filter(c => c.type === CommentType.MultiLine || c.type === CommentType.Documentation);
        const inlineComments = commentsToDecorate.filter(c => c.type === CommentType.Inline || c.isAfterCode);

        const decorations: vscode.TextEditorDecorationType[] = [];
        const style = this.configManager.getConfig().decorationStyle;

        // Aplicar decoraciones para comentarios inline
        if (inlineComments.length > 0) {
            const decoration = InlineDecorationApplier.apply(editor, inlineComments, style, this.decorationFactory);
            if (decoration) {
                decorations.push(decoration);
            }
        }

        // Aplicar decoraciones para comentarios de línea
        if (singleLineComments.length > 0) {
            const decoration = InlineDecorationApplier.apply(editor, singleLineComments, style, this.decorationFactory);
            if (decoration) {
                decorations.push(decoration);
            }
        }

        // Aplicar decoraciones para bloques (incluye Documentation)
        if (multiLineComments.length > 0) {
            const blockDecorations = BlockDecorationApplier.apply(editor, multiLineComments, style, this.decorationFactory);
            decorations.push(...blockDecorations);
        }

        this.activeDecorations.set(editor.document.uri.toString(), decorations);
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
