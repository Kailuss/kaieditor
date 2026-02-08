/**
 * Función de ejemplo con inline tags de JSDoc
 * 
 * Esta función demuestra el uso de {@link MyClass} para referencias.
 * También puedes usar {@link MyClass|una clase personalizada} con label.
 * 
 * Para código inline: {@code myFunction()} o {@literal <html>}.
 * 
 * @param {string} name - El nombre del usuario, ver {@link User|User class}
 * @param {number} age - La edad en años
 * @returns {Promise<User>} Usuario creado, implementa {@link IUser}
 * 
 * @example
 * // Uso básico con {@code createUser}
 * const user = await createUser('John', 30);
 * 
 * @see {@link https://example.com|Documentación completa}
 * @see {@tutorial getting-started}
 */
async function createUser(name, age) {
    return { name, age };
}

/**
 * Clase de ejemplo
 * 
 * Utiliza {@linkcode TypeSystem.check()} para validación.
 * El tipo es {@type {Object.<string, any>}}.
 * 
 * @class
 * @inheritdoc
 */
class MyClass {
    /**
     * Constructor
     * @param {*} config - Configuración {@typeof configType}
     */
    constructor(config) {
        this.config = config;
    }
    
    /**
     * Método principal
     * 
     * Ejecuta {@linkplain process|el proceso} interno.
     * Utiliza valores de {@docRoot}/config.
     * 
     * @returns {number} El valor es {@value DEFAULT_VALUE}
     */
    execute() {
        return 42;
    }
}

/**
 * Ejemplo con nesting (avanzado)
 * 
 * Ver {@link MyClass|la clase {@code MyClass}} para más detalles.
 * 
 * @param {string} data - Datos en formato {@literal JSON}
 */
function parseData(data) {
    return JSON.parse(data);
}

/**
 * Tags combinadas
 * 
 * Este método usa {@code async/await} con {@link Promise}.
 * Retorna un {@type {Array<string>}} procesado.
 * 
 * Para información histórica, ver {@index legacy-api}.
 * 
 * @param {Array} items - Array de items
 * @returns {Array<string>} Items procesados
 */
async function processItems(items) {
    return items.map(String);
}
