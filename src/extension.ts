import * as vscode from 'vscode';
import { CommentDetector } from './commentDetection';
import { DecorationManager, clearIconCache } from './decorationManagement';
import { ConfigManager } from './configManager';

// Instancias globales
let commentDetector: CommentDetector;
let decorationManager: DecorationManager;
let configManager: ConfigManager;
let updateTimeout: NodeJS.Timeout | undefined;

// Última línea del cursor procesada, para evitar re-renderizar cuando el cursor
// se mueve dentro de la misma línea (las decoraciones solo dependen de la línea)
let lastCursorLine = -1;

export function activate(context: vscode.ExtensionContext) {
	console.log('[KaiEditor] Extension activating...');

	try {
		configManager = new ConfigManager();
		commentDetector = new CommentDetector();
		decorationManager = new DecorationManager(configManager);
	} catch (error) {
		console.error('[KaiEditor] Error during initialization:', error);
		vscode.window.showErrorMessage(`KaiEditor failed to initialize: ${error}`);
		return;
	}

	// Procesar el editor activo al iniciar
	if (vscode.window.activeTextEditor) {
		updateDecorations(vscode.window.activeTextEditor);
	}

	// Actualizar decoraciones cuando cambia el editor activo
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				lastCursorLine = editor.selection.active.line;
				updateDecorations(editor);
			}
		})
	);

	// Actualizar decoraciones cuando cambia el contenido del documento (con debounce)
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(event => {
			const editor = vscode.window.activeTextEditor;
			if (editor && event.document === editor.document) {
				if (updateTimeout) {
					clearTimeout(updateTimeout);
				}
				updateTimeout = setTimeout(() => updateDecorations(editor), 150);
			}
		})
	);

	// Actualizar decoraciones cuando el cursor cambia de línea (sin debounce,
	// para que el comentario bajo el cursor muestre su texto original al instante)
	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(event => {
			if (event.textEditor !== vscode.window.activeTextEditor) {
				return;
			}
			const cursorLine = event.textEditor.selection.active.line;
			if (cursorLine !== lastCursorLine) {
				lastCursorLine = cursorLine;
				updateDecorations(event.textEditor);
			}
		})
	);

	// Refrescar todo cuando cambia la configuración
	context.subscriptions.push(
		configManager.onConfigChange(() => {
			console.log('[KaiEditor] Configuration changed, refreshing all decorations');
			// Limpiar caché de iconos para que los cambios de estilo tengan efecto
			clearIconCache();
			decorationManager.clearAllDecorations();
			if (vscode.window.activeTextEditor) {
				updateDecorations(vscode.window.activeTextEditor);
			}
		})
	);

	// Comando para habilitar/deshabilitar la extensión
	context.subscriptions.push(
		vscode.commands.registerCommand('kaieditor.toggle', async () => {
			const config = vscode.workspace.getConfiguration('kaieditor');
			const currentState = config.get<boolean>('enabled', true);
			await config.update('enabled', !currentState, vscode.ConfigurationTarget.Workspace);
			vscode.window.showInformationMessage(!currentState ? 'KaiEditor enabled' : 'KaiEditor disabled');
		})
	);

	// Comando para refrescar decoraciones manualmente
	context.subscriptions.push(
		vscode.commands.registerCommand('kaieditor.refresh', () => {
			if (vscode.window.activeTextEditor) {
				updateDecorations(vscode.window.activeTextEditor);
				vscode.window.showInformationMessage('KaiEditor: Decorations refreshed');
			}
		})
	);

	console.log('[KaiEditor] Extension activated');
}

/**
 * Actualiza las decoraciones para el editor dado
 */
function updateDecorations(editor: vscode.TextEditor): void {
	if (!configManager.isEnabled()) {
		decorationManager.clearDecorations(editor.document.uri.toString());
		return;
	}

	// Verificar si el lenguaje está soportado y habilitado en la configuración
	const language = commentDetector.getLanguage(editor.document.languageId);
	if (!language || !configManager.isLanguageEnabled(language)) {
		return;
	}

	const comments = commentDetector.detectComments(editor.document);

	// Aplicar decoraciones (excluye automáticamente comentarios en la línea del cursor)
	decorationManager.applyDecorations(editor, comments);
}

export function deactivate() {
	if (updateTimeout) {
		clearTimeout(updateTimeout);
		updateTimeout = undefined;
	}

	if (decorationManager) {
		decorationManager.dispose();
	}
}
