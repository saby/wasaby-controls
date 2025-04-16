import { IHierarchyState } from '../interface/IAbstractListStateParts/IHierarchyState';
//# region Атомные предикаты
// НЕ МОГУТ ИМЕТЬ ДЖЕНЕРИК. Это будет нарушать концепцию предиката, он не должен
// врать и делать больше чем должно.
// Если нужен дженерик, значит не нужен дженерик, а нужен более узкий предикат.
/**
 * Предикат для проверки, что переданное значение не определено.
 */
export const isUndefined = (o: unknown): o is undefined => typeof o === 'undefined';
/**
 * Предикат для проверки, что переданное значение является boolean.
 */
export const isBool = (o: unknown): o is boolean => typeof o === 'boolean';
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
export const isArray = (o: unknown): o is unknown[] => o instanceof Array;
/**
 * Предикат для проверки, что переданное значение является объектом.
 */
export const isObject = (o: unknown): o is object => typeof o === 'object';
//# endregion Атомные предикаты

/**
 * Предикат для проверки, что переданное значение определено.
 */
export const isDefined = <T>(o: T): o is Exclude<T, undefined> => !isUndefined(o);

/**
 * Предикат для проверки, что переданное значение поддерживает иерархию.
 */
export const isHierarchyDefined = <T>(
    o: T
): o is T & Partial<IHierarchyState> & Pick<Required<IHierarchyState>, 'parentProperty'> =>
    isObject(o) &&
    isString((o as Pick<Partial<IHierarchyState>, 'parentProperty'>).parentProperty as unknown);
