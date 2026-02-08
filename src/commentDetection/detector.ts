import * as vscode from 'vscode';
import { 
    DetectedComment, 
    CommentType, 
    SupportedLanguage, 
    CustomTag
} from '../types';
import { CommentPatternsManager } from './patterns';
import { LanguageMapper } from './languageMapper';
import { TagDetector } from './tagDetector';
import { StringParser } from './stringParser';

/**
 * Detector principal de comentarios en el código fuente
 * Soporta múltiples lenguajes de programación
 */
export class CommentDetector {
    private patternsManager: CommentPatternsManager;
    private languageMapper: LanguageMapper;
    private tagDetector: TagDetector;
    private stringParser: StringParser;

    constructor() {
        this.patternsManager = new CommentPatternsManager();
        this.languageMapper = new LanguageMapper();
        this.tagDetector = new TagDetector();
        this.stringParser = new StringParser();
    }

    /**
     * Detecta todos los comentarios en un documento
     */
    public detectComments(document: vscode.TextDocument): DetectedComment[] {
        const language = this.languageMapper.mapLanguageId(document.languageId);
        if (!language) {
            return [];
        }

        const pattern = this.patternsManager.getPattern(language);
        if (!pattern) {
            return [];
        }

        const comments: DetectedComment[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        let inMultiLineComment = false;
        let multiLineStart: vscode.Position | null = null;
        let multiLineContent = '';

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];

            // Detectar comentarios multilínea
            if (inMultiLineComment) {
                const endIndex = line.indexOf(pattern.multiLineEnd);
                if (endIndex !== -1) {
                    multiLineContent += line.substring(0, endIndex);
                    const endPos = new vscode.Position(lineIndex, endIndex + pattern.multiLineEnd.length);
                    if (multiLineStart) {
                        comments.push({
                            range: new vscode.Range(multiLineStart, endPos),
                            content: multiLineContent.trim(),
                            type: CommentType.MultiLine,
                            language: language,
                            isAfterCode: false
                        });
                    }

                    inMultiLineComment = false;
                    multiLineStart = null;
                    multiLineContent = '';
                } else {
                    multiLineContent += line + '\n';
                }
                continue;
            }

            // Detectar inicio de comentario multilínea
            const multiLineStartIndex = line.indexOf(pattern.multiLineStart);
            if (multiLineStartIndex !== -1) {
                const endIndex = line.indexOf(pattern.multiLineEnd, multiLineStartIndex + pattern.multiLineStart.length);
                
                // Verificar si es comentario de documentación (/** */)
                const isDocumentation = pattern.multiLineStart === '/*' && 
                                       multiLineStartIndex < line.length - 2 && 
                                       line[multiLineStartIndex + 2] === '*';
                
                if (endIndex !== -1) {
                    // Comentario multilínea en una sola línea
                    const content = line.substring(
                        multiLineStartIndex + pattern.multiLineStart.length, 
                        endIndex
                    );
                    const startPos = new vscode.Position(lineIndex, multiLineStartIndex);
                    const endPos = new vscode.Position(lineIndex, endIndex + pattern.multiLineEnd.length);
                    const beforeCode = line.substring(0, multiLineStartIndex).trim();

                    comments.push({
                        range: new vscode.Range(startPos, endPos),
                        content: content.trim(),
                        type: isDocumentation ? CommentType.Documentation : CommentType.MultiLine,
                        language: language,
                        isAfterCode: beforeCode.length > 0,
                        isDocumentation: isDocumentation
                    });
                } else {
                    // Inicio de comentario multilínea que continúa en siguientes líneas
                    inMultiLineComment = true;
                    multiLineStart = new vscode.Position(lineIndex, multiLineStartIndex);
                    multiLineContent = line.substring(multiLineStartIndex + pattern.multiLineStart.length) + '\n';
                }
                continue;
            }

            // Detectar comentarios de una línea
            const singleLineIndex = this.stringParser.findCommentStart(line, pattern.singleLine, language);
            if (singleLineIndex !== -1) {
                const content = line.substring(singleLineIndex + pattern.singleLine.length);
                const startPos = new vscode.Position(lineIndex, singleLineIndex);
                const endPos = new vscode.Position(lineIndex, line.length);
                const beforeCode = line.substring(0, singleLineIndex).trim();

                // Detectar custom tag
                const customTag = this.tagDetector.detectCustomTag(content);
                const cleanContent = this.tagDetector.cleanContent(content, customTag);

                comments.push({
                    range: new vscode.Range(startPos, endPos),
                    content: cleanContent,
                    type: beforeCode.length > 0 ? CommentType.Inline : CommentType.SingleLine,
                    language: language,
                    isAfterCode: beforeCode.length > 0,
                    customTag: customTag
                });
            }
        }

        return comments;
    }

    /**
     * Verifica si un lenguaje está soportado
     */
    public isLanguageSupported(languageId: string): boolean {
        return this.languageMapper.isLanguageSupported(languageId);
    }
}
