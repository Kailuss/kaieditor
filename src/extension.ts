// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CommentDetector } from './commentDetection';
import { DecorationManager } from './decorationManagement';
import { ConfigManager } from './configManager';

// Instancias globales
let commentDetector: CommentDetector;
let decorationManager: DecorationManager;
let configManager: ConfigManager;
let updateTimeout: NodeJS.Timeout | undefined;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('[KaiEditor] Extension activating...');

	// Inicializar gestores
	try {
		configManager = new ConfigManager();
		console.log('[KaiEditor] ConfigManager initialized');
		
		commentDetector = new CommentDetector();
		console.log('[KaiEditor] CommentDetector initialized');
		
		decorationManager = new DecorationManager(configManager);
		console.log('[KaiEditor] DecorationManager initialized');
	} catch (error) {
		console.error('[KaiEditor] Error during initialization:', error);
		vscode.window.showErrorMessage(`KaiEditor failed to initialize: ${error}`);
		return;
	}

	// Procesar el editor activo al iniciar
	if (vscode.window.activeTextEditor) {
		console.log('[KaiEditor] Processing active editor on startup');
		updateDecorations(vscode.window.activeTextEditor);
	}

	// Actualizar decoraciones cuando cambia el editor activo
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor) {
				console.log('[KaiEditor] Active editor changed:', editor.document.fileName);
				updateDecorations(editor);
			}
		})
	);

	// Actualizar decoraciones cuando cambia el contenido del documento
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(event => {
			const editor = vscode.window.activeTextEditor;
			if (editor && event.document === editor.document) {
				// Debounce para evitar actualizaciones excesivas
				if (updateTimeout) {
					clearTimeout(updateTimeout);
				}
				updateTimeout = setTimeout(() => {
					console.log('[KaiEditor] Document changed, updating decorations');
					updateDecorations(editor);
				}, 300); // 300ms de debounce
			}
		})
	);

	// Actualizar decoraciones cuando cambia la selección/cursor
	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(event => {
			if (event.textEditor === vscode.window.activeTextEditor) {
				// Actualizar decoraciones basado en la posición del cursor
				updateDecorations(event.textEditor);
			}
		})
	);

	// Actualizar decoraciones cuando cambia la configuración
	context.subscriptions.push(
		configManager.onConfigChange(() => {
			if (vscode.window.activeTextEditor) {
				updateDecorations(vscode.window.activeTextEditor);
			}
		})
	);

	// Comando para habilitar/deshabilitar la extensión
	context.subscriptions.push(
		vscode.commands.registerCommand('kaieditor.toggle', () => {
			const config = vscode.workspace.getConfiguration('kaieditor');
			const currentState = config.get<boolean>('enabled', true);
			config.update('enabled', !currentState, vscode.ConfigurationTarget.Workspace);
			
			const message = !currentState ? 'KaiEditor enabled' : 'KaiEditor disabled';
			console.log(`[KaiEditor] ${message}`);
			vscode.window.showInformationMessage(message);
		})
	);

	// Comando para refrescar decoraciones manualmente
	context.subscriptions.push(
		vscode.commands.registerCommand('kaieditor.refresh', () => {
			if (vscode.window.activeTextEditor) {
				console.log('[KaiEditor] 🔄 Manually refreshing decorations');
				updateDecorations(vscode.window.activeTextEditor);
				vscode.window.showInformationMessage('KaiEditor: Decorations refreshed 🔄');
			}
		})
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('kaieditor.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log('[KaiEditor] 👋 Hello World command executed');
		vscode.window.showInformationMessage('Hello World from KaiEditor! 🎉');
	});

	context.subscriptions.push(disposable);
	
	console.log('[KaiEditor] ✅ Extension activated successfully! 🎉');
}

/**
 * Actualiza las decoraciones para el editor dado
 */
function updateDecorations(editor: vscode.TextEditor): void {
	const fileName = editor.document.fileName.split('\\').pop();
	const languageId = editor.document.languageId;
	
	console.log(`[KaiEditor] 🔍 Processing file: ${fileName} (${languageId})`);
	
	// Verificar si la extensión está habilitada
	if (!configManager.isEnabled()) {
		console.log('[KaiEditor] ⏸️ Extension is disabled, skipping');
		decorationManager.clearDecorations(editor.document.uri.toString());
		return;
	}

	// Verificar si el lenguaje está soportado
	if (!commentDetector.isLanguageSupported(editor.document.languageId)) {
		console.log(`[KaiEditor] ⚠️ Language not supported: ${languageId}`);
		return;
	}

	// Detectar comentarios
	const comments = commentDetector.detectComments(editor.document);
	console.log(`[KaiEditor] 📊 Detected ${comments.length} comments`);

	// Obtener selección actual (incluye cursor y rango seleccionado)
	const selection = editor.selection;

	// Aplicar decoraciones (excluyendo comentarios donde está el cursor o hay selección)
	decorationManager.applyDecorations(editor, comments, selection);
	console.log('[KaiEditor] ✨ Decorations applied successfully');
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('[KaiEditor] 👋 Extension deactivating...');
	
	// Limpiar timeout pendiente
	if (updateTimeout) {
		clearTimeout(updateTimeout);
		updateTimeout = undefined;
	}
	
	if (decorationManager) {
		decorationManager.dispose();
		console.log('[KaiEditor] ✅ DecorationManager disposed');
	}
	console.log('[KaiEditor] 🛑 Extension deactivated');
}
