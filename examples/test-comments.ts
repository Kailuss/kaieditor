// ═══════════════════════════════════════════════════════════════════
// KaiEditor - Tag examples in TypeScript
// ═══════════════════════════════════════════════════════════════════

// ─── Basic tags with TypeScript ────────────────────────────────────

//! IMPORTANT: This interface is critical for the system
interface User {
    id: number;
    name: string;
    email: string;
}

//✓ COMPLETED: Migration to strict mode finished
const strictMode: boolean = true;

//? WARNING: This type may change in future versions
type RiskyType = string | number | null;

//@ INFO: Global system configuration
const CONFIG: Readonly<{port: number}> = { port: 3000 };

//# DEBUG: Temporary type guard for debugging
function isDebug(x: unknown): x is boolean {
    return typeof x === 'boolean';
}

//~ PENDING: Add runtime type validation
const pendingValidation: unknown = null;

//· ACTIVE: Service running in background
let activeService: NodeJS.Timer;

//^ CONFLICT: Resolve type between string and number
const conflictValue: string = 'version-A';

//» REVIEW: This generic type needs review
type NeedsReview<T> = T extends object ? keyof T : never;

//- DEPRECATED: Use newFunction<T>() instead
/** @deprecated */
function deprecatedFunction(): void {
    console.warn('Use newFunction instead');
}

//× ERROR: Known bug with generic types
const buggyGeneric: any = null; // Fix: definir tipo correcto

//* NOTE: Prefer types over interfaces when possible
type PreferredType = { value: string };

//? QUESTION: Should it be readonly or mutable?
const questionableArray: Array<string> = [];

// ─── Inline comments with types ──────────────────────────────────

const userId: number = 123;           //! Validate that it's > 0
const userName: string = "John";      //✓ Validation implemented
const userEmail: string = "x@y.com";  //? Check email format
const userStatus: string = "active";  //@ Values: active | inactive
const debugFlag: boolean = true;      //# Change to false in prod
const pending: null = null;           //~ Implement correct type
const active: boolean = true;         //· Active state of the process
const conflict: string = "v1";        //^ Decide between v1 or v2
const review: string = "code";        //» Pending review
const oldApi: Function = () => {};    //- Use new API
const errorProne: any = null;         //× Fix: type correctly
const noteValue: string = "info";     //* Document usage
const question: number = 10;          //? Should this be configurable?

// ─── Functions with JSDoc and tags ────────────────────────────────────

/**
 * Processes user data with full validation
 * 
 * @template T - Type of the expected result
 * @param {string} input - Input data from the user
 * @param {ProcessOptions} options - Processing options
 * @returns {Promise<T>} Processed result
 * @throws {ValidationError} If the data is invalid
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
    //! Validate input before processing
    if (!input || input.length === 0) {
        throw new Error('Input required');
    }
    
    //✓ Type guard implemented
    const validated = validateInput(input);
    
    //? Check if the cast is safe
    return validated as T;
}

/**
 * Opciones de procesamiento
 */
interface ProcessOptions {
    strict?: boolean;    //@ Strict validation mode
    timeout?: number;    //~ Implement timeout
    retry?: boolean;     //? Is automatic retry necessary?
}

/**
 * Validates input format
 * @param data - Data to validate
 */
function validateInput(data: string): unknown {
    //@ Basic type and format validation
    if (typeof data !== 'string') {
        return String(data);
    }
    return data;
}

// ─── Classes with decorators and tags ─────────────────────────────────

/**
 * Example class with typed properties
 * 
 * @class ExampleClass
 * @template T - Type of handled data
 */
class ExampleClass<T> {
    //@ Private property with generic type
    private data: Map<string, T>;
    
    //# Debug-only, remove in production
    private debugInfo: number;
    
    constructor() {
        //✓ Proper initialization with types
        this.data = new Map<string, T>();
        
        //# Creation timestamp
        this.debugInfo = Date.now();
    }
    
    /**
     * Executes an operation on the data
     * @returns Operation status
     */
    execute(): boolean {
        //~ Implement real logic with error handling
        return true;
    }
    
    /**
     * Retrieves value by key
     * @param key - Key to look up
     */
    get(key: string): T | undefined {
        //! Validate that the key exists
        return this.data.get(key);
    }
}

// ─── Advanced types with comments ───────────────────────────────

//! IMPORTANT: Critical union type for the system
type Status = 'pending' | 'active' | 'completed' | 'error';

//✓ COMPLETED: Type predicates implemented
function isStatus(value: unknown): value is Status {
    return typeof value === 'string' && 
           ['pending', 'active', 'completed', 'error'].includes(value);
}

//? WARNING: This type may become too large
type DeepNested<T> = {
    [K in keyof T]: T[K] extends object ? DeepNested<T[K]> : T[K];
};

//@ INFO: Utility type for asynchronous operations
type AsyncResult<T> = Promise<T | Error>;

//# DEBUG: Helper type for debugging
type Debug<T> = { [K in keyof T]: T[K] } & { __debug: true };

//~ PENDING: Add more utility types
type TODO<T> = T; // Placeholder

//· ACTIVE: Type actively used in production
type ActiveRecord<T> = T & { id: string; createdAt: Date };

//^ CONFLICT: Decide between Partial or Required
type ConflictType<T> = Partial<T> | Required<T>;

//» REVIEW: Is this mapped type necessary?
type ReviewType<T> = { [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K] };

//- DEPRECATED: Use built-in Record<K, V> instead
/** @deprecated */
type DeprecatedMap<K extends string, V> = { [P in K]: V };

//× ERROR: Este tipo causa problemas con inference
type ErrorProne = any; // Fix: define correctly

//* NOTE: Prefer type over interface for unions
type NoteType = string | number;

//? QUESTION: Should it be nominal or structural?
type QuestionType = { __brand: 'Question' } & string;

// ─── Comentarios multilínea ────────────────────────────────────────

/*
 * This is a multiline comment block
 * explaining advanced TypeScript concepts
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
 * Possible system states
 */
enum SystemState {
    //! Critical state - requires attention
    CRITICAL = 'critical',
    
    //✓ System running normally
    HEALTHY = 'healthy',
    
    //? State that needs monitoring
    WARNING = 'warning',
    
    //@ Maintenance information
    MAINTENANCE = 'maintenance'
}

export { User, SystemState, ExampleClass };
