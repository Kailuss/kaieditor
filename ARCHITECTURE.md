# KaiEditor - Arquitectura de la Extensión

## 📋 Descripción

KaiEditor transforma comentarios en cajas visuales estilizadas directamente en el editor de VS Code, sin modificar el código fuente. Utiliza la API de decoraciones de texto de VS Code con **CSS puro** para crear cajas elegantes sin dependencias externas.

## 🏗️ Arquitectura del Proyecto

### Estructura de Archivos

```
kaieditor/
├── src/
│   ├── extension.ts           # Entry point y orquestador principal
│   ├── types.ts               # Interfaces y tipos TypeScript
│   ├── commentDetector.ts     # Parser de comentarios multi-lenguaje
│   ├── decorationManager.ts   # Gestor de decoraciones visuales (CSS puro)
│   └── configManager.ts       # Gestor de configuración
├── examples/
│   └── test-comments.js       # Archivo de prueba con ejemplos
├── docs/
│   ├── CSS-SYSTEM.md          # Documentación técnica del sistema CSS
│   ├── IMPLEMENTATION-SUMMARY.md  # Resumen de implementación
│   └── QUICK-TEST-GUIDE.md    # Guía rápida de prueba
├── package.json               # Manifest de la extensión
└── tsconfig.json             # Configuración de TypeScript
```

---

## 📦 Módulos Principales

### 1. **types.ts** - Definiciones de Tipos

Define las interfaces y enums fundamentales del sistema:

#### Tipos Principales:
- `SupportedLanguage`: Enum con los lenguajes soportados (JS, TS, Python, Rust, Go)
- `CommentType`: Enum para tipos de comentarios (SingleLine, MultiLine, Inline)
- `DetectedComment`: Representa un comentario detectado con su rango y contenido
- `CommentPatterns`: Patrones de sintaxis de comentarios por lenguaje
- `DecorationStyle`: **[NUEVO]** Configuración CSS moderna (borderRadius, padding, opacity, etc.)
- `CommentBoxStyle`: **[LEGACY]** Configuración de estilos visuales (colores, fuente, padding, etc.)
- `KaiEditorConfig`: Configuración completa de la extensión

#### Nueva Interface DecorationStyle (v0.0.1):
```typescript
interface DecorationStyle {
  backgroundColor: string;      // Color de fondo
  textColor: string;           // Color de texto
  borderColor: string;         // Color de borde principal
  accentColor: string;         // Color de acento (borde lateral bloques)
  borderRadius: number;        // Radio de esquinas en píxeles
  paddingVertical: number;     // Padding vertical en píxeles
  paddingHorizontal: number;   // Padding horizontal en píxeles
  fontStyle: string;           // 'normal' | 'italic'
  fontWeight: string;          // '400' | '500' | '600'
  opacity: number;             // 0.0 - 1.0
}
```

---

### 2. **commentDetector.ts** - Parser de Comentarios

**Responsabilidad**: Detectar y clasificar comentarios en el código fuente.

#### Funcionalidades:
- ✅ Detecta comentarios en 5 lenguajes: JavaScript, TypeScript, Python, Rust, Go
- ✅ Soporta comentarios de una línea (`//`, `#`)
- ✅ Soporta comentarios multilínea (`/* */`, `"""`)
- ✅ Distingue entre comentarios inline (después de código) y standalone
- ✅ Ignora comentarios dentro de strings

#### Método Principal:
```typescript
detectComments(document: vscode.TextDocument): DetectedComment[]
```

#### Lógica de Detección:
1. Mapea el `languageId` del documento a `SupportedLanguage`
2. Obtiene los patrones de comentarios para ese lenguaje
3. Itera línea por línea buscando:
   - Inicio/fin de comentarios multilínea
   - Comentarios de una línea
4. Determina si hay código antes del comentario (inline)
5. Retorna array de `DetectedComment` con rangos y contenido

---

### 3. **decorationManager.ts** - Gestor de Decoraciones (CSS Puro)

**Responsabilidad**: Crear y aplicar decoraciones visuales sobre los comentarios usando CSS puro.

#### 🆕 Funcionalidades Renovadas (v0.0.1):
- ✅ Sistema de decoración con CSS puro (sin SVG)
- ✅ Bordes redondeados configurables (`borderRadius`)
- ✅ Padding independiente (vertical/horizontal)
- ✅ Opacidad ajustable
- ✅ Limpieza automática de delimitadores (`//`, `/*`, `*/`, `#`)
- ✅ Truncado de texto largo (80 caracteres)
- ✅ Decoraciones multilínea con borde lateral de acento
- ✅ Bordes condicionales para primera/última línea de bloques
- ✅ Cache de decoration types por tipo

#### Métodos Principales:
```typescript
// Aplica todas las decoraciones
applyDecorations(editor: TextEditor, comments: DetectedComment[]): void

// Decoraciones inline (después de código)
private applyInlineDecorations(editor: TextEditor, comments: DetectedComment[]): void

// Decoraciones de bloques multilínea
private applyBlockDecorations(editor: TextEditor, comments: DetectedComment[]): void

// Limpia delimitadores de comentarios
private cleanCommentText(text: string): string

// Trunca texto largo con elipsis
private formatLongText(text: string, maxLength: number): string
```

#### Proceso de Decoración:
1. Limpia decoraciones previas del documento
2. Agrupa comentarios por tipo (inline/single-line/block)
3. Para cada grupo:
   - **Inline/Single-line**:
     - Crea decoración que oculta texto original
     - Agrega caja con CSS en `renderOptions.after`
     - Usa `textDecoration` para propiedades no soportadas
   - **Block (multilínea)**:
     - Procesa cada línea independientemente
     - Calcula bordes condicionales (top/bottom)
     - Agrega borde lateral de acento (`accentColor`)
     - Aplica `borderRadius` según posición (primera/última)
4. Aplica decoraciones con `setDecorations()`

#### Características del Diseño Visual CSS:
- **Comentarios Inline**: 
  ```typescript
  contentText: `  ${text}  `
  margin: '0 0 0 10px'
  border: '1px solid #4c566a'
  textDecoration: 'display: inline-block; border-radius: 6px; padding: 3px 10px;'
  ```
  
- **Comentarios de Bloque**:
  ```typescript
  borderLeft: '3px solid #88c0d0'  // Borde de acento
  borderTop: isFirst ? '1px solid' : 'none'
  borderBottom: isLast ? '1px solid' : 'none'
  borderRadius: calculado según posición
  ```

#### Limitaciones de VS Code API:
- `borderRadius`, `borderLeft/Top/Bottom`, `padding` personalizado no son propiedades nativas
- **Solución**: Se incluyen en `textDecoration` como string CSS completo
- Bloques multilínea requieren una decoración por línea

---

### 4. **configManager.ts** - Gestor de Configuración

**Responsabilidad**: Gestionar configuración desde VS Code settings.

#### Funcionalidades:
- ✅ Lee configuración desde `workspace settings`
- ✅ Proporciona valores por defecto para todos los estilos
- ✅ Recarga automática cuando cambian los settings
- ✅ Valida lenguajes habilitados

#### Estilos por Defecto:

**Single-Line Comments:**
- Background: `#2d3748` (gris oscuro)
- Text: `#e2e8f0` (gris claro)
- Border: `#4a5568` / 1px
- Padding: 6px 12px

**Multi-Line Comments:**
- Background: `#1a365d` (azul oscuro)
- Text: `#bee3f8` (azul claro)
- Border: `#2c5282` / 2px
- Padding: 10px 16px

**Inline Comments:**
- Background: `#44337a` (púrpura)
- Text: `#e9d8fd` (púrpura claro)
- Border: `#6b46c1` / 1px
- Padding: 4px 8px

#### Configuración en VS Code:
```json
{
  "kaieditor.enabled": true,
  "kaieditor.enabledLanguages": ["javascript", "typescript", "python"],
  "kaieditor.singleLineStyle.backgroundColor": "#2d3748",
  "kaieditor.singleLineStyle.textColor": "#e2e8f0"
}
```

---

### 5. **extension.ts** - Entry Point

**Responsabilidad**: Orquestar todos los módulos y gestionar el ciclo de vida.

#### Funcionalidades:
- ✅ Inicializa `CommentDetector`, `DecorationManager`, `ConfigManager`
- ✅ Actualiza decoraciones cuando cambia el editor activo
- ✅ Actualiza decoraciones cuando cambia el contenido del documento
- ✅ Recarga decoraciones cuando cambia la configuración
- ✅ Proporciona comandos para toggle y refresh manual

#### Comandos Disponibles:
```typescript
kaieditor.toggle   // Habilitar/deshabilitar la extensión
kaieditor.refresh  // Refrescar decoraciones manualmente
```

#### Flujo de Activación:
1. `activate()` se ejecuta al iniciar VS Code
2. Se crean instancias de los 3 gestores
3. Se procesan decoraciones del editor activo
4. Se registran listeners para:
   - Cambio de editor activo
   - Cambio de contenido de documento
   - Cambio de configuración

#### Función `updateDecorations()`:
```typescript
function updateDecorations(editor: vscode.TextEditor): void {
  // 1. Verificar si la extensión está habilitada
  if (!configManager.isEnabled()) return;
  
  // 2. Verificar si el lenguaje está soportado
  if (!commentDetector.isLanguageSupported()) return;
  
  // 3. Detectar comentarios
  const comments = commentDetector.detectComments(editor.document);
  
  // 4. Aplicar decoraciones
  decorationManager.applyDecorations(editor, comments);
}
```

---

## 🔄 Flujo de Datos

```
1. Usuario abre archivo .js/.ts/.py/.rs/.go
   ↓
2. extension.ts detecta cambio de editor
   ↓
3. commentDetector.detectComments() escanea el documento
   ↓
4. Retorna array de DetectedComment con rangos y tipos
   ↓
5. decorationManager.applyDecorations() crea decoraciones
   ↓
6. Oculta texto original y muestra cajas visuales
   ↓
7. Usuario edita código → se actualiza automáticamente
```

---

## 🎨 Tecnologías y APIs de VS Code

### APIs Utilizadas:
- **TextEditorDecorationType**: Crear tipos de decoración personalizados
- **DecorationOptions**: Especificar rangos y estilos de renderizado
- **renderOptions.after**: Insertar contenido después del texto original
- **textDecoration CSS**: Ocultar texto original (`display: none`)
- **WorkspaceConfiguration**: Leer settings del usuario
- **onDidChangeTextDocument**: Detectar cambios en documentos
- **onDidChangeActiveTextEditor**: Detectar cambios de editor

---

## 📐 Decisiones de Diseño

### ¿Por qué Decoraciones en vez de CodeLens?
- **Decoraciones**: Permiten estilos CSS completos y posicionamiento preciso
- **CodeLens**: Más limitado, diseñado para información contextual

### ¿Por qué `display: none` en vez de otros métodos?
- Oculta completamente el comentario original sin afectar el layout
- No interfiere con el código circundante
- Funciona bien con wrapping y comentarios multilínea

### ¿Por qué detectar inline vs standalone?
- Comentarios inline necesitan margen izquierdo para separación visual
- Comentarios standalone pueden usar todo el ancho disponible

---

## 🚀 Extensiones Futuras

### Características Planeadas:
- [ ] Soporte para más lenguajes (C++, C#, Java, Ruby)
- [ ] Temas predefinidos (Dark, Light, High Contrast)
- [ ] Iconos en cajas de comentarios
- [ ] Markdown rendering en comentarios
- [ ] Comentarios colapsables
- [ ] Exportar/importar configuraciones

---

## 🧪 Testing

### Estrategia de Testing:
1. **Unit Tests**: Probar `commentDetector` con diferentes sintaxis
2. **Integration Tests**: Verificar flujo completo de decoraciones
3. **Manual Testing**: Probar en archivos reales de diferentes lenguajes

### Casos de Prueba Críticos:
- Comentarios dentro de strings (no deben detectarse)
- Comentarios multilínea anidados
- Comentarios al final de líneas de código
- Cambios de configuración en tiempo real
- Performance con archivos grandes

---

## 📝 Configuración del Proyecto

### Compilación:
```bash
npm run compile        # Compilar una vez
npm run watch          # Compilar en modo watch
npm run package        # Build de producción
```

### Debugging:
1. Presionar F5 en VS Code
2. Se abre una nueva ventana de Extension Development Host
3. Abrir un archivo .js/.ts/.py/.rs/.go con comentarios
4. Los comentarios se transforman en cajas visuales automáticamente

---

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.
