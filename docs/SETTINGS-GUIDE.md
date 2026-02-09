# Guía de Configuraciones KaiEditor

## Configuraciones Activas

Todas las configuraciones están completamente conectadas y funcionales. Se aplican en tiempo real cuando cambias los valores en VS Code settings.

### ✅ Habilitación General

| Configuración | Tipo | Default | Descripción |
|--------------|------|---------|-------------|
| `kaieditor.enabled` | boolean | `true` | Activa/desactiva la extensión |
| `kaieditor.enabledLanguages` | array | `["javascript", "typescript", "python", "rust", "go"]` | Lenguajes donde se muestran las decoraciones |

### ✅ Colores Principales

| Configuración | Tipo | Default | Descripción |
|--------------|------|---------|-------------|
| `kaieditor.backgroundColor` | string | `#2e3440` | Color de fondo de las cajas de comentarios |
| `kaieditor.textColor` | string | `#eceff4` | Color del texto en las cajas |
| `kaieditor.borderColor` | string | `#4c566a` | Color del borde (no usado actualmente) |
| `kaieditor.accentColor` | string | `#88c0d0` | Color del borde lateral izquierdo en bloques multilínea |

### ✅ Geometría y Bordes

| Configuración | Tipo | Default | Rango | Descripción |
|--------------|------|---------|-------|-------------|
| `kaieditor.borderRadius` | number | `16` | 0-20 | Radio de las esquinas en píxeles |
| `kaieditor.paddingVertical` | number | `3` | 0-20 | Padding vertical en píxeles |
| `kaieditor.paddingHorizontal` | number | `10` | 0-40 | Padding horizontal en píxeles |

### ✅ Tipografía

| Configuración | Tipo | Default | Descripción |
|--------------|------|---------|-------------|
| `kaieditor.fontStyle` | enum | `normal` | Estilo de fuente: `normal` o `italic` |
| `kaieditor.fontWeight` | enum | `400` | Peso de fuente: `400`, `500` o `600` |
| `kaieditor.opacity` | number | `0.95` | Opacidad de las cajas (0.1-1.0) |
| `kaieditor.inlineFontSize` | string | `0.64em` | Tamaño de fuente para comentarios inline |
| `kaieditor.blockFontSize` | string | `0.9em` | Tamaño de fuente para bloques multilínea |

### ✅ Paddings Específicos

| Configuración | Tipo | Default | Descripción |
|--------------|------|---------|-------------|
| `kaieditor.inlinePaddingTop` | string | `1px` | Padding superior para comentarios inline |
| `kaieditor.inlinePaddingBottom` | string | `0.5px` | Padding inferior para comentarios inline |
| `kaieditor.blockPaddingMultiplier` | number | `2` | Multiplicador de padding vertical para bloques |

### ✅ Colores por Tag Personalizado

| Configuración | Tag | Default | Descripción |
|--------------|-----|---------|-------------|
| `kaieditor.tagColors.important` | `//!` | `#ff6b6b99` | Color rojo para tags importantes |
| `kaieditor.tagColors.success` | `//·` | `#49c78a99` | Color verde para tags de éxito |
| `kaieditor.tagColors.warning` | `//?` | `#ffb86b99` | Color amarillo para advertencias |
| `kaieditor.tagColors.info` | `//@` | `#74b3ff99` | Color azul para información |
| `kaieditor.tagColors.debug` | `//#` | `#b084ff99` | Color morado para debug |

### ✅ Comentarios de Documentación (JSDoc, etc.)

| Configuración | Tipo | Default | Descripción |
|--------------|------|---------|-------------|
| `kaieditor.docColors.backgroundColor` | string | `#061425` | Fondo oscuro para documentación |
| `kaieditor.docColors.borderColor` | string | `#1b2b3a` | Borde para documentación |
| `kaieditor.docColors.textColor` | string | `#bcd6ee` | Color del texto de documentación |

### ✅ Iconos (Nuevo)

| Configuración | Tipo | Default | Rango | Descripción |
|--------------|------|---------|-------|-------------|
| `kaieditor.showIcons` | boolean | `true` | - | Mostrar iconos SVG antes de comentarios con tags |

**Nota sobre iconos:**
- **Tamaño fijo**: Los iconos son siempre de **16px** para garantizar consistencia visual
- **Margen automático**: El margen se calcula dinámicamente según el contexto:
  - **Comentarios inline**: `-16px` (solapamiento perfecto con el fondo)
  - **Comentarios block**: `-20px` (espacio extra para padding del contenedor)
- Los iconos se posicionan usando `position: absolute` con `z-index: 1`

## Arquitectura del Sistema de Configuración

### Flujo de Datos

```
package.json (settings)
    ↓
ConfigManager.loadConfig()
    ↓
KaiEditorConfig (interface)
    ↓
DecorationStyle (unificado)
    ↓
ColorManager.getColors()
    ↓
InlineDecorationApplier / BlockDecorationApplier
    ↓
VS Code Decorations API
```

### Cache y Rendimiento

- **Configuración cacheada**: Se carga una vez al inicio y se recarga solo cuando cambia
- **Iconos cacheados**: Los SVG con colores se generan una vez por combinación `tag + color`
- **Listener de cambios**: `onConfigChange()` detecta cambios y recarga automáticamente

### Decoración Unificada

A diferencia de versiones anteriores que tenían `singleLineStyle`, `multiLineStyle` e `inlineStyle` separados, ahora usamos un **único `decorationStyle`** que se aplica consistentemente a todos los tipos de comentarios:

- **Single-line comments** (`// comment`)
- **Inline comments** (`code // comment`)
- **Multi-line comments** (`/* ... */`)
- **Documentation comments** (`/** JSDoc */`)

Los colores se personalizan dinámicamente según:
1. **Custom tags** (`//!`, `//·`, etc.) → `tagColors.*`
2. **Documentación** → `docColors.*`
3. **Estándar** → `backgroundColor`, `textColor`, etc.

## Ejemplo de Configuración Personalizada

```json
{
  "kaieditor.enabled": true,
  "kaieditor.backgroundColor": "#1e1e1e",
  "kaieditor.textColor": "#d4d4d4",
  "kaieditor.accentColor": "#569cd6",
  "kaieditor.borderRadius": 8,
  "kaieditor.opacity": 0.9,
  "kaieditor.fontStyle": "italic",
  "kaieditor.showIcons": true,
  "kaieditor.iconSize": 14,
  "kaieditor.tagColors.important": "#ff0000cc",
  "kaieditor.tagColors.success": "#00ff00cc"
}
```

## Debugging

Para verificar que una configuración se está aplicando:

1. Cambia el valor en Settings UI o `settings.json`
2. La extensión detecta el cambio automáticamente
3. Las decoraciones se refrescan sin necesidad de recargar VS Code
4. Si no ves cambios, verifica la consola de desarrollador (F1 → "Developer: Toggle Developer Tools")

## Configuraciones Eliminadas

Las siguientes configuraciones legacy han sido eliminadas porque eran redundantes:

- ❌ `kaieditor.singleLineStyle.*`
- ❌ `kaieditor.multiLineStyle.*`
- ❌ `kaieditor.inlineStyle.*`

Usa las configuraciones principales listadas arriba que ahora se aplican uniformemente.
