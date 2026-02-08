# Sistema de Inline Tags de JSDoc

## Descripción

El sistema de inline tags permite parsear y procesar las tags de formato `{@tag content}` que se utilizan dentro del texto de comentarios JSDoc. A diferencia de las block tags (`@param`, `@returns`), las inline tags se utilizan para formatear y referenciar contenido dentro de la descripción.

## Tags Soportadas

### Core / Imprescindibles

#### `{@link target}`
Crea una referencia a otra parte del código.

```javascript
/**
 * Ver {@link MyClass} para más detalles
 */
```

#### `{@link target|label}`
Link con texto personalizado.

```javascript
/**
 * Consulta {@link MyClass|la clase principal}
 */
```

#### `{@linkplain target}`
Link sin formato especial (texto plano).

```javascript
/**
 * Referencia: {@linkplain MyClass}
 */
```

#### `{@linkcode target}`
Link con formato de código.

```javascript
/**
 * Usa {@linkcode MyClass.method()}
 */
```

#### `{@tutorial name}`
Referencia a un tutorial.

```javascript
/**
 * Ver {@tutorial getting-started} para empezar
 */
```

#### `{@inheritdoc}`
Indica que hereda la documentación de la clase/método padre.

```javascript
/**
 * {@inheritdoc}
 * Funcionalidad adicional...
 */
```

### Formato

#### `{@code text}`
Formatea texto como código (monospace).

```javascript
/**
 * Usa {@code myFunction()} para ejecutar
 */
// Resultado: Usa `myFunction()` para ejecutar
```

#### `{@literal text}`
Texto literal sin procesar (útil para HTML).

```javascript
/**
 * HTML: {@literal <div>test</div>}
 */
// Resultado: HTML: <div>test</div>
```

### Tipos y Referencias

#### `{@type Type}`
Especifica un tipo.

```javascript
/**
 * Retorna {@type Promise<User>}
 */
```

#### `{@typeof symbol}`
Referencia al tipo de un símbolo.

```javascript
/**
 * Config es {@typeof ConfigType}
 */
```

#### `{@namepath}`
Referencia a un namespace (raro).

```javascript
/**
 * Ver {@namepath MyModule.SubModule}
 */
```

### Legacy / Raros

#### `{@docRoot}`
Referencia a la raíz de la documentación.

```javascript
/**
 * Ver {@docRoot}/api/reference
 */
```

#### `{@value}`
Muestra el valor de una constante.

```javascript
/**
 * Valor: {@value MAX_SIZE}
 */
```

#### `{@index}`
Marca entrada de índice.

```javascript
/**
 * {@index API Reference}
 */
```

## API del Parser

### `parseInlineTags(content: string): InlineTag[]`

Parsea todas las inline tags en un string.

```typescript
const parser = new XmlTagParser();
const tags = parser.parseInlineTags('Ver {@link MyClass|clase} aquí');

// Resultado:
// [{
//   tag: 'link',
//   content: 'MyClass|clase',
//   target: 'MyClass',
//   label: 'clase',
//   raw: '{@link MyClass|clase}',
//   start: 4,
//   end: 26
// }]
```

### `replaceInlineTags(content: string): string`

Reemplaza inline tags por su representación visual.

```typescript
const parser = new XmlTagParser();
const result = parser.replaceInlineTags('Use {@code test()}');
// Resultado: "Use `test()`"
```

### `processInlineTags(content: string): { cleanText: string; tags: InlineTag[] }`

Procesa inline tags y devuelve texto limpio + tags encontradas.

```typescript
const parser = new XmlTagParser();
const result = parser.processInlineTags('Ver {@link A} y {@code test()}');
// Resultado:
// {
//   cleanText: 'Ver A y `test()`',
//   tags: [...]
// }
```

### `isKnownInlineTag(tagName: string): boolean`

Verifica si una tag es estándar/conocida.

```typescript
parser.isKnownInlineTag('link');    // true
parser.isKnownInlineTag('code');    // true
parser.isKnownInlineTag('custom');  // false
```

## Interface InlineTag

```typescript
interface InlineTag {
    tag: string;        // Nombre de la tag (sin @)
    content: string;    // Contenido completo
    target?: string;    // Target/referencia
    label?: string;     // Label personalizado
    raw: string;        // Texto raw completo
    start: number;      // Posición inicio
    end: number;        // Posición fin
}
```

## Reglas de Parseado

### 1. Sintaxis Base

```
{@tag content}
{@tag target|label}
```

### 2. Soporte de Pipe (|)

El carácter pipe separa el target del label:

- `{@link MyClass}` → target: "MyClass", label: undefined
- `{@link MyClass|texto}` → target: "MyClass", label: "texto"

### 3. Tags Desconocidas

El parser **no falla** con tags desconocidas:

```javascript
// Tag no estándar
{@customTag algo}

// Se parsea normalmente
{
  tag: 'customTag',
  content: 'algo',
  ...
}

// Pero isKnownInlineTag('customTag') retorna false
```

### 4. Nesting Básico

Soporte limitado para tags anidadas:

```javascript
/**
 * Ver {@link MyClass|la clase {@code MyClass}}
 */
```

**Nota:** El nesting profundo puede causar problemas. Evitar cuando sea posible.

## Conversión Visual

Cada tipo de tag se convierte según su propósito:

| Tag | Conversión |
|-----|------------|
| `{@link A}` | `A` |
| `{@link A\|B}` | `B` |
| `{@code X}` | `` `X` `` |
| `{@literal X}` | `X` |
| `{@type T}` | `T` |
| `{@inheritdoc}` | `(inherited)` |
| otros | contenido sin cambios |

## Integración con Parser Principal

El `CommentParser` puede usar inline tags para procesar contenido:

```typescript
const parser = new CommentParser();
const xmlParser = new XmlTagParser();

// Parsear comentario
const parsed = parser.parseComment(comment);

// Procesar inline tags en el contenido
for (const tag of parsed.tags) {
    const { cleanText, tags: inlineTags } = xmlParser.processInlineTags(tag.content);
    // Usar cleanText para mostrar
    // Guardar inlineTags para referencia
}
```

## Mejores Prácticas

### ✅ DO

- Usar `{@link}` para referencias a código
- Usar `{@code}` para código inline
- Usar `{@literal}` para HTML/XML literal
- Preferir label cuando el target es poco legible: `{@link module.submodule.MyClass|MyClass}`

### ❌ DON'T

- No usar block tags como inline: `{@param x}` ← INVÁLIDO
- No anidar profundamente: máximo 1 nivel
- No confundir con block tags: `@param` vs `{@link}`

## Diferencias con Block Tags

| Aspecto | Block Tags | Inline Tags |
|---------|-----------|-------------|
| Formato | `@tag ...` | `{@tag ...}` |
| Ubicación | Inicio de línea | Dentro del texto |
| Propósito | Declarar/estructurar | Formatear/referenciar |
| Ejemplos | `@param`, `@returns` | `{@link}`, `{@code}` |

## Ejemplos Completos

### Ejemplo 1: Referencias
```javascript
/**
 * Crea un usuario nuevo en el sistema.
 * 
 * Utiliza {@link Database.connect()} para conectar y
 * {@link UserValidator.validate()|valida} los datos.
 * 
 * @param {string} name - Nombre del usuario
 * @returns {User} El usuario creado, ver {@link User}
 */
function createUser(name) {
    // ...
}
```

### Ejemplo 2: Formato
```javascript
/**
 * Parser de configuración JSON.
 * 
 * Soporta formato {@literal {"key": "value"}} estándar.
 * Usa {@code JSON.parse()} internamente.
 * 
 * @param {string} json - String JSON
 * @returns {Object} Objeto parseado
 */
function parseConfig(json) {
    // ...
}
```

### Ejemplo 3: Tipos
```javascript
/**
 * Procesa datos asíncronamente.
 * 
 * Retorna {@type Promise<Array<User>>} con los usuarios.
 * El callback recibe {@typeof UserCallback} como parámetro.
 * 
 * @async
 */
async function processUsers() {
    // ...
}
```

### Ejemplo 4: Herencia
```javascript
class Animal {
    /**
     * Método que hace ruido
     * @returns {string} El sonido del animal
     */
    makeSound() { return 'sound'; }
}

class Dog extends Animal {
    /**
     * {@inheritdoc}
     * Los perros ladran.
     */
    makeSound() { return 'woof'; }
}
```

## Testing

El archivo [xmlTagParser.inline.test.ts](../src/test/xmlTagParser.inline.test.ts) contiene 25+ tests que cubren:

- Parseado de todas las tags estándar
- Sintaxis con pipe (target|label)
- Tags desconocidas (no debe fallar)
- Conversión visual
- Manejo de posiciones
- Nesting básico
- Espacios y formato

Para ejecutar los tests:
```bash
npm test
```

## Roadmap

### Futuras Mejoras

1. **Nesting avanzado**: Mejor soporte para tags anidadas múltiples niveles
2. **Validación de targets**: Verificar que los links apunten a símbolos existentes
3. **Autocompletado**: Sugerir targets válidos al escribir `{@link`
4. **Go to definition**: Click en link para navegar al símbolo
5. **Sintaxis extendida**: Soportar más formatos (URLs, archivos, etc.)

## Referencias

- [JSDoc Tags](https://jsdoc.app/tags-inline-link.html)
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [VS Code Extension API](https://code.visualstudio.com/api/references/vscode-api)
