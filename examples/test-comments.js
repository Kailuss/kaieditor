// ═══════════════════════════════════════════════════════════════════
// KaiEditor - Test de todos los tags personalizados
// ═══════════════════════════════════════════════════════════════════

// ─── Tags básicos ───────────────────────────────────────────────────

//! IMPORTANTE: Este comentario marca algo crítico que requiere atención inmediata
const criticalValue = 999;

//✓ COMPLETADO: Esta funcionalidad ya fue implementada y probada exitosamente
const completedFeature = true;

//? ADVERTENCIA: Ten cuidado con este código, puede causar efectos secundarios
const riskyOperation = () => { /* ... */ };

//@ INFO: Este es un comentario informativo con detalles adicionales
const configPath = './config.json';

//# DEBUG: Variable temporal solo para debugging, eliminar antes de producción
const debugMode = true;

//~ PENDIENTE: Esta funcionalidad aún está por implementarse
const pendingFeature = null;

//· ACTIVO: Este proceso está corriendo activamente en background
const activeProcess = setInterval(() => {}, 1000);

//^ CONFLICTO: Hay un merge conflict aquí que necesita resolverse
const conflictingValue = 'version-A'; // o 'version-B'?

//» REVISAR: Este código necesita code review antes de mergear
const needsReview = function() {
    return 'implementación temporal';
};

//- DEPRECADO: No usar esta función, será eliminada en la próxima versión
const deprecatedFunction = () => console.warn('deprecated');

//× ERROR: Este código tiene un bug conocido que necesita fix urgente
const buggyCode = null.toString(); // NullPointerException!

//* NOTA: Información adicional sobre el comportamiento esperado
const expectedBehavior = 'async';

//¿ PREGUNTA: ¿Debería este valor ser configurable o hardcoded?
const questionableValue = 42;

// ─── Comentarios inline ────────────────────────────────────────────

const user = "John";      //! Validar que no sea null
const age = 25;           //✓ Validación implementada
const email = "x@y.com";  //? Verificar formato
const status = "active";  //@ Estado por defecto
const debug = false;      //# Cambiar a false en producción
const pending = null;     //~ Implementar validación
const active = true;      //· Proceso activo
const conflict = "v1";    //^ Resolver conflicto
const review = "code";    //» Necesita revisión
const old = legacyAPI();  //- Usar newAPI() en su lugar
const error = null;       //× Fix: validar antes de usar
const note = "info";      //* Ver documentación
const question = 10;      //¿ Debería ser configurable?

// ─── Comentarios de documentación ──────────────────────────────────

/**
 * Función principal del sistema
 * 
 * Esta función procesa los datos de entrada y retorna
 * el resultado después de aplicar todas las transformaciones.
 * 
 * @param {string} input - Datos de entrada
 * @param {Object} options - Opciones de configuración
 * @returns {Promise<string>} Resultado procesado
 * 
 * @example
 * const result = await processData('input', { strict: true });
 */
async function processData(input, options) {
    //! Validar input antes de procesar
    if (!input) throw new Error('Input required');
    
    //✓ Validación implementada
    const validated = validate(input);
    
    //? Verificar si options es necesario
    const config = options || getDefaultOptions();
    
    return validated;
}

/**
 * Clase de ejemplo con todos los tags
 * 
 * @class ExampleClass
 */
class ExampleClass {
    constructor() {
        //@ Inicialización por defecto
        this.data = {};
        
        //# Solo para debugging
        this.debugInfo = Date.now();
    }
    
    /**
     * Método de ejemplo
     * @returns {boolean} Estado de operación
     */
    execute() {
        //~ Implementar lógica real
        return true;
    }
}

// ─── Comentarios multilínea ────────────────────────────────────────

/*
 * Este es un bloque de comentario normal
 * que explica la lógica compleja del algoritmo
 * implementado a continuación
 */
function complexAlgorithm() {
    return 42;
}

// ─── Resumen de todos los tags ─────────────────────────────────────

/*
 * Guía rápida de tags personalizados:
 * 
 * //! - IMPORTANTE (rojo)     - Requiere atención inmediata
 * //✓ - COMPLETADO (verde)    - Tarea finalizada
 * //? - ADVERTENCIA (amarillo) - Precaución necesaria
 * //@ - INFO (azul)           - Información adicional
 * //# - DEBUG (morado)        - Solo para debugging
 * //~ - PENDIENTE (amarillo)  - Por implementar
 * //· - ACTIVO (cyan)         - Proceso activo
 * //^ - CONFLICTO (rojo)      - Conflicto a resolver
 * //» - REVISAR (cyan)        - Necesita code review
 * //- - DEPRECADO (gris)      - Obsoleto, no usar
 * //× - ERROR (rojo)          - Bug conocido
 * //* - NOTA (amarillo)       - Nota informativa
 * //¿ - PREGUNTA (morado)     - Decisión pendiente
 */
