// ═══════════════════════════════════════════════════════════════════
// KaiEditor - Ejemplos de tags en TypeScript
// ═══════════════════════════════════════════════════════════════════

// ─── Tags básicos con TypeScript ────────────────────────────────────

//! IMPORTANTE: Esta interfaz es crítica para el sistema
interface User {
    id: number;
    name: string;
    email: string;
}

//✓ COMPLETADO: Migración a strict mode completada
const strictMode: boolean = true;

//? ADVERTENCIA: Este tipo puede cambiar en futuras versiones
type RiskyType = string | number | null;

//@ INFO: Configuración global del sistema
const CONFIG: Readonly<{port: number}> = { port: 3000 };

//# DEBUG: Type guard temporal para debugging
function isDebug(x: unknown): x is boolean {
    return typeof x === 'boolean';
}

//~ PENDIENTE: Añadir validación de tipos runtime
const pendingValidation: unknown = null;

//· ACTIVO: Servicio corriendo en background
let activeService: NodeJS.Timer;

//^ CONFLICTO: Resolver tipo entre string y number
const conflictValue: string = 'version-A';

//» REVISAR: Este tipo genérico necesita revisión
type NeedsReview<T> = T extends object ? keyof T : never;

//- DEPRECADO: Usar newFunction<T>() en su lugar
/** @deprecated */
function deprecatedFunction(): void {
    console.warn('Use newFunction instead');
}

//× ERROR: Bug conocido con tipos genéricos
const buggyGeneric: any = null; // Fix: definir tipo correcto

//* NOTA: Preferir tipos sobre interfaces cuando sea posible
type PreferredType = { value: string };

//¿ PREGUNTA: ¿Debería ser readonly o mutable?
const questionableArray: Array<string> = [];

// ─── Comentarios inline con tipos ──────────────────────────────────

const userId: number = 123;           //! Validar que sea > 0
const userName: string = "John";      //✓ Validación implementada
const userEmail: string = "x@y.com";  //? Verificar formato email
const userStatus: string = "active";  //@ Valores: active | inactive
const debugFlag: boolean = true;      //# Cambiar a false en prod
const pending: null = null;           //~ Implementar tipo correcto
const active: boolean = true;         //· Estado activo del proceso
const conflict: string = "v1";        //^ Decidir entre v1 o v2
const review: string = "code";        //» Pendiente de revisión
const oldApi: Function = () => {};    //- Usar nueva API
const errorProne: any = null;         //× Fix: tipar correctamente
const noteValue: string = "info";     //* Documentar uso
const question: number = 10;          //¿ Debería ser configurable?

// ─── Funciones con JSDoc y tags ────────────────────────────────────

/**
 * Procesa datos de usuario con validación completa
 * 
 * @template T - Tipo del resultado esperado
 * @param {string} input - Datos de entrada del usuario
 * @param {ProcessOptions} options - Opciones de procesamiento
 * @returns {Promise<T>} Resultado procesado
 * @throws {ValidationError} Si los datos son inválidos
 * 
 * @example
 * ```typescript
 * const result = await processUserData<User>('data', { strict: true });
 * ```
 */
async function processUserData<T>(
    input: string,
    options: ProcessOptions
): Promise<T> {
    //! Validar entrada antes de procesar
    if (!input || input.length === 0) {
        throw new Error('Input required');
    }
    
    //✓ Type guard implementado
    const validated = validateInput(input);
    
    //? Revisar si el cast es seguro
    return validated as T;
}

/**
 * Opciones de procesamiento
 */
interface ProcessOptions {
    strict?: boolean;    //@ Modo estricto de validación
    timeout?: number;    //~ Implementar timeout
    retry?: boolean;     //? ¿Necesario reintento automático?
}

/**
 * Valida formato de entrada
 * @param data - Datos a validar
 */
function validateInput(data: string): unknown {
    //@ Validación básica de tipo y formato
    if (typeof data !== 'string') {
        return String(data);
    }
    return data;
}

// ─── Clases con decoradores y tags ─────────────────────────────────

/**
 * Clase de ejemplo con propiedades tipadas
 * 
 * @class ExampleClass
 * @template T - Tipo de datos manejados
 */
class ExampleClass<T> {
    //@ Propiedad privada con tipo genérico
    private data: Map<string, T>;
    
    //# Solo para debugging, eliminar en producción
    private debugInfo: number;
    
    constructor() {
        //✓ Inicialización correcta con tipos
        this.data = new Map<string, T>();
        
        //# Timestamp de creación
        this.debugInfo = Date.now();
    }
    
    /**
     * Ejecuta operación sobre los datos
     * @returns Estado de la operación
     */
    execute(): boolean {
        //~ Implementar lógica real con manejo de errores
        return true;
    }
    
    /**
     * Obtiene valor por clave
     * @param key - Clave a buscar
     */
    get(key: string): T | undefined {
        //! Validar que la clave exista
        return this.data.get(key);
    }
}

// ─── Tipos avanzados con comentarios ───────────────────────────────

//! IMPORTANTE: Tipo union crítico para el sistema
type Status = 'pending' | 'active' | 'completed' | 'error';

//✓ COMPLETADO: Type predicates implementados
function isStatus(value: unknown): value is Status {
    return typeof value === 'string' && 
           ['pending', 'active', 'completed', 'error'].includes(value);
}

//? ADVERTENCIA: Este tipo puede crecer demasiado
type DeepNested<T> = {
    [K in keyof T]: T[K] extends object ? DeepNested<T[K]> : T[K];
};

//@ INFO: Utility type para operaciones asíncronas
type AsyncResult<T> = Promise<T | Error>;

//# DEBUG: Tipo helper para debugging
type Debug<T> = { [K in keyof T]: T[K] } & { __debug: true };

//~ PENDIENTE: Añadir más utility types
type TODO<T> = T; // Placeholder

//· ACTIVO: Tipo en uso activo en producción
type ActiveRecord<T> = T & { id: string; createdAt: Date };

//^ CONFLICTO: Decidir entre Partial o Required
type ConflictType<T> = Partial<T> | Required<T>;

//» REVISAR: ¿Es necesario este mapped type?
type ReviewType<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };

//- DEPRECADO: Usar built-in Record<K, V> en su lugar
/** @deprecated */
type DeprecatedMap<K extends string, V> = { [P in K]: V };

//× ERROR: Este tipo causa problemas con inference
type ErrorProne = any; // Fix: definir correctamente

//* NOTA: Preferir type sobre interface para unions
type NoteType = string | number;

//¿ PREGUNTA: ¿Debería ser nominal o estructural?
type QuestionType = { __brand: 'Question' } & string;

// ─── Comentarios multilínea ────────────────────────────────────────

/*
 * Este es un bloque de comentario multilínea
 * que explica conceptos avanzados de TypeScript
 * 
 * - Generics
 * - Type inference
 * - Conditional types
 * - Mapped types
 */

function complexGenericFunction<
    T extends object,
    K extends keyof T
>(obj: T, key: K): T[K] {
    //! Validar que la propiedad existe
    if (!(key in obj)) {
        throw new Error(`Key ${String(key)} not found`);
    }
    
    //✓ Type-safe property access
    return obj[key];
}

// ─── Enums con documentación ────────────────────────────────────────

/**
 * Estados posibles del sistema
 */
enum SystemState {
    //! Estado crítico - requiere atención
    CRITICAL = 'critical',
    
    //✓ Sistema funcionando normalmente
    HEALTHY = 'healthy',
    
    //? Estado que requiere monitoreo
    WARNING = 'warning',
    
    //@ Información de mantenimiento
    MAINTENANCE = 'maintenance'
}

export { User, SystemState, ExampleClass };
