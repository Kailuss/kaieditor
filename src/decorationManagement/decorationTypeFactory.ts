import * as vscode from 'vscode';

/**
 * Factory para crear tipos de decoraciones
 */
export class DecorationTypeFactory {
    private cache: Map<string, vscode.TextEditorDecorationType> = new Map();

    /**
     * Crea una decoración para comentarios inline (después de código)
     * @returns Tipo de decoración para inline
     */
    public createInlineDecoration(): vscode.TextEditorDecorationType {
        const key = 'inline';

        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        const decorationType = vscode.window.createTextEditorDecorationType({
            textDecoration: 'none; display: none;',
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });

        this.cache.set(key, decorationType);
        return decorationType;
    }

    /**
     * Crea decoración para bloques multilínea (texto)
     * @returns Tipo de decoración para bloques
     */
    public createBlockDecoration(): vscode.TextEditorDecorationType {
        const key = 'block';

        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        const decorationType = vscode.window.createTextEditorDecorationType({
            textDecoration: 'none; display: none;',
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed
        });

        this.cache.set(key, decorationType);
        return decorationType;
    }

    /**
     * Crea decoración para el fondo de bloques multilínea
     * @returns Tipo de decoración para fondo de bloques
     */
    public createBlockBackgroundDecoration(): vscode.TextEditorDecorationType {
        const key = 'block-background';

        if (this.cache.has(key)) {
            return this.cache.get(key)!;
        }

        const decorationType = vscode.window.createTextEditorDecorationType({
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
            isWholeLine: false
        });

        this.cache.set(key, decorationType);
        return decorationType;
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
