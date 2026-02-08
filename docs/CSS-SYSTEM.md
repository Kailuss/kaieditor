# Sistema de Cajas Visuales con CSS Puro

## 📚 Arquitectura

KaiEditor utiliza la **VS Code Decorations API** para transformar comentarios en cajas visuales estilizadas usando **CSS puro**, sin SVG ni dependencias externas.

## 🎯 Componentes Principales

### 1. **DecorationManager** (`src/decorationManager.ts`)

Gestor central de decoraciones visuales.

#### Métodos Principales:

- `applyDecorations(editor, comments)` - Aplica decoraciones a todos los comentarios detectados
- `applyInlineDecorations(editor, comments)` - Maneja comentarios inline y de una línea
- `applyBlockDecorations(editor, comments)` - Maneja comentarios multilínea con borde lateral
- `cleanCommentText(text)` - Limpia delimitadores de comentarios (`//`, `/*`, `*/`, `#`)
- `formatLongText(text, maxLength)` - Trunca texto largo con elipsis

#### Flujo de Decoración:

```
Comentarios detectados
    ↓
Agrupar por tipo (inline/single-line/block)
    ↓
Para cada grupo:
  - Limpiar texto
  - Formatear si es largo
  - Crear DecorationOptions con CSS
  - Aplicar decoración al editor
```

### 2. **DecorationStyle** (`src/types.ts`)

Interface para configuración de estilos CSS:

```typescript
interface DecorationStyle {
  backgroundColor: string;    // Color de fondo
  textColor: string;          // Color de texto
  borderColor: string;        // Color de borde principal
  accentColor: string;        // Color de borde lateral (bloques)
  borderRadius: number;       // Radio de esquinas (px)
  paddingVertical: number;    // Padding vertical (px)
  paddingHorizontal: number;  // Padding horizontal (px)
  fontStyle: string;          // 'normal' | 'italic'
  fontWeight: string;         // '400' | '500' | '600'
  opacity: number;            // 0.0 - 1.0
}
```

### 3. **ConfigManager** (`src/configManager.ts`)

Gestor de configuración que lee settings de VS Code.

#### Método Clave:

```typescript
private loadDecorationStyle(config: WorkspaceConfiguration): DecorationStyle {
  return {
    backgroundColor: config.get<string>('backgroundColor', '#2e3440'),
    textColor: config.get<string>('textColor', '#eceff4'),
    // ... otros valores
  };
}
```

## 🎨 Técnicas de Estilizado CSS

### Comentarios Inline

Se usan propiedades CSS estándar más `textDecoration` para propiedades no soportadas directamente:

```typescript
renderOptions: {
  after: {
    contentText: `  ${formattedText}  `,
    backgroundColor: '#2e3440',
    color: '#eceff4',
    border: '1px solid #4c566a',
    margin: '0 0 0 10px',
    fontStyle: 'normal',
    fontWeight: '400',
    textDecoration: `none; display: inline-block; 
                     border-radius: 6px; 
                     padding: 3px 10px; 
                     opacity: 0.95;`
  }
}
```

### Comentarios Multilínea (Bloques)

Cada línea es una decoración separada con bordes calculados dinámicamente:

```typescript
const isFirst = index === 0;
const isLast = index === lines.length - 1;

// Bordes condicionales
const borderTop = isFirst ? '1px solid #4c566a' : 'none';
const borderBottom = isLast ? '1px solid #4c566a' : 'none';

// Border radius condicional
let borderRadius = '0';
if (isFirst && isLast) borderRadius = '6px';
else if (isFirst) borderRadius = '6px 6px 0 0';
else if (isLast) borderRadius = '0 0 6px 6px';
```

**Resultado visual:**

```
┌─────────────────────────┐
│ Primera línea           │  ← border-top + border-radius superior
│ Línea intermedia        │  ← solo bordes laterales
│ Última línea            │  ← border-bottom + border-radius inferior
└─────────────────────────┘
```

## ⚠️ Limitaciones de VS Code Decorations API

### Propiedades No Soportadas Directamente

Las siguientes propiedades CSS **no** son propiedades nativas de `ThemableDecorationAttachmentRenderOptions`:

- `borderRadius`
- `borderLeft`, `borderTop`, `borderBottom`, `borderRight`
- `padding` (en formato `3px 10px`)
- `opacity`

**Solución:** Incluirlas en la propiedad `textDecoration` como string CSS completo.

### Limitaciones Visuales

1. **Sin word-wrap automático**: El texto no hace salto de línea dentro de la caja
2. **Altura fija**: La caja no aumenta la altura de línea del editor
3. **Texto muy largo**: Se trunca con elipsis (máximo 80 caracteres por defecto)
4. **Una decoración por línea**: Bloques multilínea requieren múltiples decoraciones

## 🔧 Gestión de Decoraciones

### Cache de Decoraciones

```typescript
private decorationTypes: Map<string, vscode.TextEditorDecorationType> = new Map();
```

- **'inline'**: Decoración para comentarios inline/single-line
- **'block'**: Decoración para comentarios multilínea

### Limpieza de Recursos

```typescript
public dispose(): void {
  this.clearAllDecorations();
}

public clearAllDecorations(): void {
  this.activeDecorations.forEach(decorations => {
    decorations.forEach(decoration => decoration.dispose());
  });
  this.activeDecorations.clear();
  this.decorationTypes.forEach(type => type.dispose());
  this.decorationTypes.clear();
}
```

## 📊 Flujo de Actualización de Configuración

```
Usuario cambia setting en VS Code
    ↓
ConfigManager detecta cambio (onDidChangeConfiguration)
    ↓
ConfigManager.reloadConfig()
    ↓
DecorationManager.refreshDecorations()
    ↓
clearAllDecorations() + applyDecorations()
    ↓
Nuevas decoraciones con estilos actualizados
```

## 🎯 Optimizaciones

### 1. **Limpieza de Texto**

```typescript
private cleanCommentText(text: string): string {
  return text
    .replace(/^\/\/\s?/, '')      // Quita //
    .replace(/^\/\*\s?/, '')      // Quita /*
    .replace(/\s?\*\/$/, '')      // Quita */
    .replace(/^\*\s?/, '')        // Quita * inicial
    .replace(/^#\s?/, '')         // Quita # (Python)
    .trim();
}
```

### 2. **Formateo de Texto Largo**

```typescript
private formatLongText(text: string, maxLength: number = 80): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}
```

### 3. **Reutilización de Decoration Types**

Las decoraciones se cachean por tipo para evitar recrearlas en cada actualización:

```typescript
if (this.decorationTypes.has(key)) {
  return this.decorationTypes.get(key)!;
}
```

## 🚀 Extensibilidad Futura

### Posibles Mejoras:

1. **Iconos personalizados**: Agregar iconos usando `contentIconPath`
2. **Hover tooltips**: Usar `hoverMessage` para mostrar información adicional
3. **Múltiples estilos por tipo**: Diferentes estilos según contenido del comentario
4. **Animaciones**: Transiciones CSS para aparecer/desaparecer
5. **Themes preconfigurados**: Nord, Dracula, Monokai, etc.

## 📚 Referencias

- [VS Code Decorations API](https://code.visualstudio.com/api/references/vscode-api#window.createTextEditorDecorationType)
- [ThemableDecorationRenderOptions](https://code.visualstudio.com/api/references/vscode-api#ThemableDecorationRenderOptions)
- [CSS Properties in VS Code](https://code.visualstudio.com/api/references/vscode-api#ThemableDecorationAttachmentRenderOptions)

## 💡 Consejos de Desarrollo

### Testing de Estilos

1. Usar el archivo `examples/test-comments.js` para probar diferentes escenarios
2. Cambiar configuración en tiempo real con `Ctrl+,`
3. Ejecutar "KaiEditor: Refresh Decorations" para aplicar cambios

### Debugging

```typescript
console.log('Aplicando decoraciones:', {
  totalComments: comments.length,
  inline: inlineComments.length,
  blocks: multiLineComments.length
});
```

### Verificar Tipos

```bash
npm run check-types
```

### Compilar y Empaquetar

```bash
npm run compile
npm run package
```
