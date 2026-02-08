import * as vscode from 'vscode';

/**
 * Factory para crear tipos de decoraciones
 */
export class DecorationTypeFactory {
    private cache: Map<string, vscode.TextEditorDecorationType> = new Map();

    /**
     * Crea una decoración para comentarios inline (después de código)
     * NO cachea porque los estilos pueden cambiar
     * @returns Tipo de decoración para inline
     */
    public createInlineDecoration(): vscode.TextEditorDecorationType {
        return vscode.window.createTextEditorDecorationType({
            textDecoration: 'none; display: none;',
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });
    }

    /**
     * Crea decoración para bloques multilínea (texto)
     * NO cachea porque los estilos pueden cambiar
     * @returns Tipo de decoración para bloques
     */
    public createBlockDecoration(): vscode.TextEditorDecorationType {
        return vscode.window.createTextEditorDecorationType({
            textDecoration: 'none; display: none;',
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });
    }

    /**
     * Crea decoración para el fondo de bloques multilínea
     * NO cachea porque los estilos pueden cambiar
     * @returns Tipo de decoración para fondo de bloques
     */
    public createBlockBackgroundDecoration(): vscode.TextEditorDecorationType {
        return vscode.window.createTextEditorDecorationType({
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
            isWholeLine: false
        });
    }

    /**
     * Limpia todos los tipos de decoración del cache
     */
    public clear(): void {
        this.cache.forEach(type => {
            try {
                type.dispose();
            } catch (e) {
                console.warn('[KaiEditor] Warning disposing decoration type:', e);
            }
        });
        this.cache.clear();
    }

    /**
     * Obtiene el cache de tipos de decoración
     */
    public getCache(): Map<string, vscode.TextEditorDecorationType> {
        return this.cache;
    }
}
