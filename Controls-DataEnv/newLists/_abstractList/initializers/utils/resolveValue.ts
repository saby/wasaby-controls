import { loadSync } from 'WasabyLoader/ModulesLoader';
import validateOption, { type TValidator } from './validateOption';

/**
 * Небезопасно получает значение, которое может быть определено строкой (путь до реального значения).
 *
 * - Если переданное значение не определено, то результат будет undefined.
 * - Если переданное значение НЕ является строкой, то оно будет возвращено как есть.
 * - Если передана строка, то оно будет воспринято как путь и в результате вернется то, что находится по данному пути.
 *
 * **НЕ РЕКОМЕНДУЕТСЯ определять тип значения вручную через дженерик функции, лучше полагаться на ts, определив тип самой переменной.**
 *
 * @example
 * Пример использования функции без защитника типов.
 * Если передана строка, то результат будет unknown.
 *
 * <pre class="brush: js">
 *      let header: string | IBaseColumnConfig[] | undefined;
 *      let columns: IBaseColumnConfig[] | undefined;
 *
 *      // type: unknown.
 *      // Т.к. по пути могло загрузиться что угодно.
 *      // Без использования защитника типов, тип гарантирован быть не может.
 *      const unsafe_resolvedHeader = resolveValue(header);
 *
 *      // type: IBaseColumnConfig[] | undefined
 *      // Т.к. мы не загружали ничего и возвращаем ровно то, что нам передали.
 *      // Тип без string поддерживается, но является бессмысленным в использовании с утилитой
 *      const unsafe_resolvedColumns = resolveValue(columns);
 * </pre>
 */
function resolveValue<T extends unknown>(
    value: T
): (T extends string ? unknown : T) | (T extends undefined ? undefined : T) | T;
/**
 * Безопасно получает значение, которое может быть определено строкой (путь до реального значения), валидируя его.
 * Является типо-безопасным, т.к. пропускает значение через защитника типов.
 *
 * В результате может вернуться
 * - либо значение, переданного типа;
 * - либо undefined, если значение не является переданным типом.
 *
 * **НЕ РЕКОМЕНДУЕТСЯ определять тип значения вручную через дженерик функции, лучше полагаться на ts, определив тип самой переменной.**
 *
 * @example
 * Пример использования функции с защитником типов.
 *
 * <pre class="brush: js">
 *      let header: string | IBaseColumnConfig[] | undefined;
 *
 *      const validator = (value: unknown): value is IBaseColumnConfig[] =>
 *          isArray(value) &&
 *          value.every((i) => {
 *              const possibleKey = (i as IBaseColumnConfig).key as unknown;
 *              return isNumber(possibleKey) || isString(possibleKey);
 *          });
 *
 *      // type: IBaseColumnConfig[] | undefined
 *      // Т.к. используется защитник типов, любой загруженное значение,
 *      // отличное от undefined будет проверено на соответствие типу.
 *      // В случае несоответствия вернется undefined.
 *      const safe_resolvedHeader = resolveValue(header, validator);
 * </pre>
 */
function resolveValue<T>(value: unknown, validator: TValidator<T>): T | undefined;
function resolveValue<T>(value: unknown, validator?: TValidator<T>): T | undefined | unknown {
    if (!value) {
        return;
    }
    if (typeof value === 'string') {
        // eslint-disable-next-line no-param-reassign
        value = loadSync(value);
    }
    if (validator) {
        return validateOption(value, validator, 'INIT_VALIDATION_FAILED', value);
    } else {
        return value;
    }
}

export default resolveValue;
