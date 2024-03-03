/**
 * @kaizen_zone 9667df49-f81c-47b7-8671-9b43a1025495
 */
/**
 * @typedef {String} CONSTANTS
 * @description Набор констант, использующихся в редактировании по месту.
 * @variant CANCEL позволяет отменить асинхронную операцию, вернув значение из функции обратного вызова до начала операции.
 */
export enum CONSTANTS {
    CANCEL = 'Cancel',
    GOTONEXT = 'GoToNext',
    GOTOPREV = 'GoToPrev',
    NEXT_COLUMN = 'NextColumn',
    PREV_COLUMN = 'PrevColumn',
}

// TODO: Подумать, как это можно более красиво типизировать для использования редактирования с асинхронной загрузкой.
export type TCancelConstant = 'Cancel';
export type TGoToNextConstant = 'GoToNext';
export type TGoToPrevConstant = 'GoToPrev';
export type TNextColumnConstant = 'NextColumn';
export type TPrevColumnConstant = 'PrevColumn';

/**
 * @typedef {String|Number|Null} TKey
 * @description Тип ключа редактируемого элемента.
 */
export type TKey = string | number | null;

/**
 * @typedef {String} TAddPosition
 * @description Позиция в коллекции добавляемого элемента. Позиция определяется относительно определенного набора данных.
 * Если элемент добавляется в группу, то набором будут все элементы группы.
 * Если элемент добавляется в родителя, то набором будут все дочерние элементы родителя.
 * Если элемент добавляется в корень, то набором будут все элементы коллекции.
 * @variant top Добавить элемент в начало набора данных.
 * @variant bottom  Добавить элемент в конец набора данных.
 */
export type TAddPosition = 'top' | 'bottom';
