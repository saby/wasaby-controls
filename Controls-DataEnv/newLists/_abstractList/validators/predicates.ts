//#region Атомные предикаты
// НЕ МОГУТ ИМЕТЬ ДЖЕНЕРИК. Это будет нарушать концепцию предиката, он не должен
// врать и делать больше чем должно.
// Если нужен дженерик, значит не нужен дженерик, а нужен более узкий предикат.
//
/**
 * Предикат для проверки, что переданное значение является строкой.
 */
export const isString = (o: unknown): o is string => typeof o === 'string';
/**
 * Предикат для проверки, что переданное значение является числом.
 */
export const isNumber = (o: unknown): o is number => typeof o === 'number';
/**
 * Предикат для проверки, что переданное значение является функцией.
 */
export const isFunction = (o: unknown): o is Function => typeof o === 'function';
/**
 * Предикат для проверки, что переданное значение является массивом.
 */
export const isArray = (o: unknown): o is Array<unknown> => o instanceof Array;
/**
 * Предикат для проверки, что переданное значение является объектом.
 */
export const isObject = (o: unknown): o is object => typeof o === 'object';
//#endregion Атомные предикаты
