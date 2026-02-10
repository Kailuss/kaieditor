# KaiEditor - Ejemplos de Uso

Esta carpeta contiene archivos de ejemplo que demuestran todas las capacidades de KaiEditor.

## 📁 Archivos de Ejemplo

### `test-comments.js` ⭐
Demuestra **todos los 13 tags personalizados** en JavaScript:
- Tags en comentarios de línea
- Tags en comentarios inline
- Comentarios de documentación (JSDoc)
- Comentarios multilínea

### `test-comments.ts` 🔷
Ejemplos específicos de **TypeScript**:
- Tags con tipos e interfaces
- Comentarios en funciones genéricas
- Decoradores y clases tipadas
- Utility types con documentación

### `test-comments.py` 🐍
Ejemplos para **Python**:
- Tags en comentarios de línea (`#`)
- Docstrings con ejemplos
- Type hints con comentarios
- Clases y métodos documentados

### `test-inline-tags.js` 📝
Demuestra el **renderizado de tags JSDoc inline**:
- `{@link}` - Referencias a clases/métodos
- `{@code}` - Código inline
- `{@literal}` - Texto literal
- `{@linkcode}` - Link con código
- `{@type}` - Definición de tipo
- Y más...

## 📊 Tabla de Tags Disponibles

| Tag | Símbolo | JavaScript | TypeScript | Python | Color | Uso |
|-----|---------|------------|------------|--------|-------|-----|
| **Important** | `!` | `//!` | `//!` | `#!` | 🔴 | Crítico |
| **Completed** | `✓` | `//✓` | `//✓` | `#✓` | 🟢 | Terminado |
| **Warning** | `?` | `//?` | `//?` | `#?` | 🟡 | Precaución |
| **Info** | `@` | `//@` | `//@` | `#@` | 🔵 | Info |
| **Debug** | `#` | `//#` | `//#` | `##` | 🟣 | Debug |
| **Pending** | `~` | `//~` | `//~` | `#~` | 🟡 | Pendiente |
| **Active** | `·` | `//·` | `//·` | `#·` | 🔷 | Activo |
| **Conflict** | `^` | `//^` | `//^` | `#^` | 🔴 | Conflicto |
| **Review** | `»` | `//»` | `//»` | `#»` | 🔷 | Revisar |
| **Deprecated** | `-` | `//-` | `//-` | `#-` | ⚫ | Obsoleto |
| **Error** | `×` | `//×` | `//×` | `#×` | 🔴 | Bug |
| **Note** | `*` | `//*` | `//*` | `#*` | 🟡 | Nota |
| **Question** | `¿` | `//¿` | `//¿` | `#¿` | 🟣 | Duda |

## 🎨 Características Demostradas

### ✓ Comentarios de Línea
```javascript
//! Este es un comentario importante
const value = 10;
```

### ✓ Comentarios Inline
```javascript
const user = "John";  //! Validar que no sea null
```

### ✓ Comentarios de Documentación
```javascript
/**
 * Descripción de la función
 * @param {string} input - Parámetro de entrada
 * @returns {boolean} Resultado
 */
function example(input) { }
```

### ✓ Comentarios Multilínea
```javascript
/*
 * Bloque de comentario
 * con múltiples líneas
 */
```

## 🚀 Cómo Usar

1. Abre cualquier archivo `.js` de esta carpeta
2. Los comentarios se renderizarán automáticamente con sus respectivos colores e iconos
3. Hover sobre un comentario para ver el texto original
4. Modifica los comentarios para ver los cambios en tiempo real

## ⚙️ Configuración

Todos los colores son personalizables en VS Code Settings:
- `kaieditor.tagColors.important`
- `kaieditor.tagColors.completed`
- `kaieditor.tagColors.warning`
- etc...

Ver `docs/SETTINGS-GUIDE.md` para más detalles.
