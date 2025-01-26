/**
 * Тип возможных вариантов ключей в массивах
 */
export type TKey = null | string | number;

/**
 * Универсальный тип, обозначающий направление по одной оси
 */
export type TSingleAxisDirection = 'backward' | 'forward';

/**
 * Вспомогательный тип, с помощью которого можно проверить,
 * что объект строго соответствует интерфейсу.
 * На текущий момент TypeScript не выдаёт ошибку, если в объекте есть лишние поля, которые не описаны в интерфейсе
 * @example
 * type Person = {
 *   first: string, last: string
 * }
 *
 * function savePerson(person: Person): Person {
 *     return person;
 * };
 *
 * const tooFew = { first: 'Stefan' };
 * const exact = { first: 'Stefan', last: 'Baumgartner' }
 * const tooMany = { first: 'Stefan', last: 'Baumgartner', age: 37 }
 *
 * savePerson(tooFew); // 💥 TS выдаст ошибку, что не хватает поля
 * savePerson(exact); // ✅ Все ок
 * savePerson(tooMany); // ✅ Все ок, хотя в переданном объекте есть лишнее поле
 *
 * Внедрим в функцию проверку через ValidateShape
 * function savePerson<T>(person: ValidateShape<T, Person>): Person {
 *     return person;
 * };
 * savePerson(tooFew); // 💥 TS выдаст ошибку, что не хватает поля
 * savePerson(exact); // ✅ Все ок
 * savePerson(tooMany); // 💥 TS выдаст ошибку, есть лишнее поле
 */
export type ValidateShape<T, Shape> = T extends Shape
    ? Exclude<keyof T, keyof Shape> extends never
        ? T
        : never
    : never;
