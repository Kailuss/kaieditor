// Ejemplo de comentarios con cajas visuales CSS

//! Este es un comentario IMPORTANTE (rojo)
const x = 10;

//* Este comentario indica ÉXITO (verde)
const userName = "Juan";

//? Este es un comentario de ADVERTENCIA (amarillo)
const result = sum(5, 3);

//@ Comentario INFORMATIVO (azul)
const PI = 3.14159;

//# Comentario de DEBUG (morado)
const debug = true;

const inline = "valor"; //! Comentario inline importante

/**
 * Este es un comentario de DOCUMENTACIÓN
 * Debería tener un estilo especial
 * @param {number} a - Primer número
 * @param {number} b - Segundo número
 * @returns {number} La suma de a y b
 */
function sum(a, b) {
    // Comentario normal de línea
    return a + b;
}

/*
 * Este es un comentario multilínea normal
 * que abarca varias líneas
 * y debería tener un borde lateral de acento
 */
function multiply(a, b) {
    return a * b;
}

/**
 * Calcula el área de un círculo
 * @param {number} radius - El radio del círculo
 * @returns {number} El área del círculo
 */
function calculateCircleArea(radius) {
    const PI = 3.14159; //* Valor constante de PI
    return PI * radius * radius;
}

// Comentario con texto muy largo que debería truncarse automáticamente con puntos suspensivos
const longComment = "ejemplo";

//! IMPORTANTE: Esta función es crítica para el sistema
function criticalFunction() {
    //? Revisar esta lógica más adelante
    return true;
}

//@ INFO: Los custom tags funcionan así:
//! //! - Importante (Rojo)
//* //* - Éxito (Verde)
//? //? - Advertencia (Amarillo)
//@ //@ - Info (Azul)
//# //# - Debug (Morado)
