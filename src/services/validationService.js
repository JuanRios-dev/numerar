// Verifica si un valor es único en una lista considerando un segundo campo y un ID actual.
export const isUnique = (field, value, list = [], extraField, extraValue, currentId) => {
    if (!value) return true; // Si el valor está vacío, no se necesita validar unicidad.

    // Verificar si existe en la lista con el mismo campo adicional, ignorando el cliente actual.
    return !list.some((item) =>
        item[field] === value &&
        item.id !== currentId && // Ignorar el ID del cliente que se está editando
        (!extraField || item[extraField] === extraValue)
    );
};

// Reglas de validación predefinidas
export const validationRules = {
    required: (message = "{field} es requerido") => ({
        test: (value) => !!value,
        message,
    }),
    optional: () => ({
        test: () => true,
        message: "",
    }),
    numeric: (message = "{field} debe contener solo números") => ({
        test: (value) => !value || /^\d+$/.test(value),
        message,
    }),
    email: (message = "Formato de correo electrónico inválido") => ({
        test: (value) => !value || /\S+@\S+\.\S+/.test(value),
        message,
    }),
    maxLength: (max, message = "{field} no puede tener más de {max} caracteres") => ({
        test: (value) => !value || value.length <= max,
        message,
    }),
    lengthBetween: (min, max, message = "{field} debe tener entre {min} y {max} caracteres") => ({
        test: (value) => value && value.length >= min && value.length <= max,
        message,
    }),
    greaterThan: (min, message = "{field} debe ser mayor a {min}") => ({
        test: (value) => !value || parseFloat(value) > min,
        message,
    }),
    range: (min, max, message = "{field} debe estar entre {min} y {max}") => ({
        test: (value) => !value || (parseFloat(value) >= min && parseFloat(value) <= max),
        message,
    }),
    alphaNumericHyphen: (message = "{field} debe contener solo números y guiones") => ({
        test: (value) => value && /^[\d-]+$/.test(value),
        message,
    }),
    unique: (
        field,
        list,
        extraField = null,
        extraValue = null,
        currentId,
        message = "Ya existe un registro con este {field}."
    ) => ({
        test: (value) => isUnique(field, value, list, extraField, extraValue, currentId),
        message,
    }),
};

// Validación genérica que acepta valor, reglas y un objeto de reemplazo para mensajes dinámicos.
export const validateField = (value, rules, replacements = {}) => {
    for (let rule of rules) {
        if (!rule.test(value)) {
            return replacePlaceholders(rule.message, replacements);
        }
    }
    return null;
};

// Reemplaza placeholders en el mensaje de error con valores personalizados.
const replacePlaceholders = (message, replacements) => {
    if (typeof message !== 'string') {
        console.error('Expected message to be a string, but received:', message);
        return ''; // Retorna una cadena vacía si no es una cadena
    }
    return message.replace(/\{(\w+)\}/g, (_, key) => replacements[key] || '');
};
