# 🚀 Guía Rápida de Prueba - KaiEditor

## 1. Compilar la Extensión

```powershell
npm run compile
```

**Resultado esperado:**
```
✓ check-types: Sin errores
✓ lint: Sin errores  
✓ build: Exitoso
```

## 2. Iniciar el Modo de Desarrollo

1. Presiona **F5** en VS Code
2. Se abrirá una nueva ventana "Extension Development Host"
3. En esa ventana, la extensión KaiEditor estará activa

## 3. Abrir el Archivo de Prueba

En la ventana de desarrollo:

```
File → Open File → examples/test-comments.js
```

O crear un nuevo archivo `.js` con:

```javascript
// Este es un comentario simple
const x = 10;

const result = sum(5, 3); // Comentario inline

/*
 * Este es un comentario
 * multilínea con varias
 * líneas de texto
 */
function sum(a, b) {
    return a + b;
}
```

## 4. Ver las Cajas Visuales

Los comentarios deberían aparecer como cajas estilizadas:
- Los comentarios `//` aparecen con fondo, borde y padding
- Los comentarios inline (después de código) aparecen a la derecha
- Los comentarios `/* */` multilínea tienen borde lateral de acento

## 5. Personalizar Estilos

### Opción A: Configuración Visual

1. En la ventana de desarrollo: **Ctrl+,** (o **Cmd+,**)
2. Buscar "kaieditor"
3. Cambiar colores, padding, etc.
4. Ver cambios en tiempo real

### Opción B: Configuración JSON

1. **Ctrl+Shift+P** → "Preferences: Open User Settings (JSON)"
2. Agregar:

```json
{
  "kaieditor.backgroundColor": "#1e1e1e",
  "kaieditor.textColor": "#ffffff",
  "kaieditor.borderColor": "#555555",
  "kaieditor.accentColor": "#00ff00",
  "kaieditor.borderRadius": 8,
  "kaieditor.paddingVertical": 5,
  "kaieditor.paddingHorizontal": 15,
  "kaieditor.opacity": 0.9
}
```

## 6. Probar Comandos

### Toggle (Activar/Desactivar)
1. **Ctrl+Shift+P**
2. Escribir: "KaiEditor: Toggle"
3. Las cajas desaparecen/aparecen

### Refresh (Refrescar)
1. **Ctrl+Shift+P**
2. Escribir: "KaiEditor: Refresh"
3. Recarga las decoraciones

## 7. Probar en Diferentes Lenguajes

### Python (test.py)
```python
# Comentario de Python
def suma(a, b):
    """
    Suma dos números
    """
    return a + b

resultado = suma(5, 3)  # Inline comment
```

### TypeScript (test.ts)
```typescript
// Comentario TypeScript
const mensaje: string = "Hola";

/**
 * Función de suma
 * @param a Primer número
 * @param b Segundo número
 */
function sum(a: number, b: number): number {
    return a + b;
}
```

### Rust (test.rs)
```rust
// Comentario Rust
fn main() {
    let x = 10; // Variable entera
    
    /*
     * Bloque multilínea
     * en Rust
     */
    println!("Hello, world!");
}
```

## 8. Estilos Predefinidos para Probar

### Tema Nord (Default)
```json
{
  "kaieditor.backgroundColor": "#3b4252",
  "kaieditor.textColor": "#eceff4",
  "kaieditor.borderColor": "#4c566a",
  "kaieditor.accentColor": "#88c0d0",
  "kaieditor.borderRadius": 6,
  "kaieditor.paddingVertical": 3,
  "kaieditor.paddingHorizontal": 10,
  "kaieditor.opacity": 0.9
}
```

### Tema GitHub
```json
{
  "kaieditor.backgroundColor": "#0d1117",
  "kaieditor.textColor": "#c9d1d9",
  "kaieditor.borderColor": "#30363d",
  "kaieditor.accentColor": "#58a6ff",
  "kaieditor.borderRadius": 4,
  "kaieditor.paddingVertical": 2,
  "kaieditor.paddingHorizontal": 8
}
```

### Tema Minimalista
```json
{
  "kaieditor.backgroundColor": "#1e1e1e",
  "kaieditor.textColor": "#888888",
  "kaieditor.borderColor": "#333333",
  "kaieditor.accentColor": "#555555",
  "kaieditor.borderRadius": 3,
  "kaieditor.paddingVertical": 1,
  "kaieditor.paddingHorizontal": 6,
  "kaieditor.opacity": 0.85,
  "kaieditor.fontStyle": "normal",
  "kaieditor.fontWeight": "400"
}
```

### Tema Colorido
```json
{
  "kaieditor.backgroundColor": "#2d1b69",
  "kaieditor.textColor": "#e9d8fd",
  "kaieditor.borderColor": "#805ad5",
  "kaieditor.accentColor": "#d53f8c",
  "kaieditor.borderRadius": 10,
  "kaieditor.paddingVertical": 4,
  "kaieditor.paddingHorizontal": 12,
  "kaieditor.opacity": 0.95,
  "kaieditor.fontStyle": "italic",
  "kaieditor.fontWeight": "500"
}
```

## 9. Verificar Console (Opcional)

Si hay problemas:

1. **Ctrl+Shift+I** (Developer Tools)
2. Ver la pestaña "Console"
3. Buscar errores o warnings de KaiEditor

## 10. Empaquetar (Opcional)

Para crear un `.vsix` instalable:

```powershell
npm run package
```

Instalar:
```powershell
code --install-extension kaieditor-0.0.1.vsix
```

## ✅ Checklist de Prueba

- [ ] Compilación exitosa
- [ ] Extensión se inicia en modo desarrollo (F5)
- [ ] Comentarios inline aparecen con cajas
- [ ] Comentarios de línea completa aparecen con cajas
- [ ] Comentarios multilínea tienen borde lateral de acento
- [ ] Configuración se actualiza en tiempo real
- [ ] Comando Toggle funciona
- [ ] Comando Refresh funciona
- [ ] Funciona en JavaScript
- [ ] Funciona en TypeScript
- [ ] Funciona en Python
- [ ] Texto largo se trunca con "..."

## 🐛 Troubleshooting

### Las cajas no aparecen
- Verificar que `kaieditor.enabled` es `true`
- Verificar que el lenguaje está en `kaieditor.enabledLanguages`
- Ejecutar "KaiEditor: Refresh Decorations"

### Colores no se ven bien
- Cambiar el tema de VS Code (oscuro/claro)
- Ajustar opacity
- Probar un estilo predefinido

### Texto se corta
- Aumentar `maxLength` en `formatLongText()` (src/decorationManager.ts)
- Actualmente limitado a 80 caracteres

## 🎉 ¡Listo!

Si todo funciona, ¡tienes un sistema completo de cajas visuales con CSS puro! 🚀
