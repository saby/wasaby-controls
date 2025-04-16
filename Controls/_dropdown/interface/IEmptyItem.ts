/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */

/**
 * Интерфейс для контролов выпадающий список, поддерживающих вывод пустого элемента.
 *
 * @interface Controls/dropdown:IEmptyItem
 * @public
 */
export interface IEmptyItemOptions {
    /**
     * @name Controls/_dropdown/interface/IEmptyItem#emptyText
     * @cfg {String} Добавляет пустой элемент в список с заданным текстом.
     * Ключ пустого элемента по умолчанию null, для изменения значения ключа используйте {@link emptyKey}.
     * @demo Controls-demo/dropdown_new/Input/EmptyText/Simple/Index
     * @see emptyKey
     */
    emptyText?: string;

    /**
     * @name Controls/_dropdown/interface/IEmptyItem#emptyKey
     * @cfg {String|String[]} Первичный ключ для пункта выпадающего списка, который создаётся при установке опции {@link emptyText}.
     * Если в качестве emptyKey задается массив ключей, записи с этими ключами должны быть в наборе всех записей.
     * Не влияет на порядок элементов, элементы с ключами из emptyKey должны располагаться в начале списка
     * @default null
     * @example
     * Пример задания несколько пустых значений.
     * <pre class="brush: js">
     * <!-- TSX -->
     * import { Selector } from 'Controls/dropdown';
     * import * as React from 'react';
     *
     * const EMPTY_KEYS = ['-2', '-1'];
     * ...
     *
     * const items = new RecordSet({
     *    keyProperty: 'key',
     *    rawData: [{
     *        key: '-2',
     *        title: 'Все юрлица',
     *    }, {
     *        key: '-1',
     *        title: 'Наша компания',
     *    }, ...]
     * });
     *
     * <Selector
     *     items={items}
     *     multiSelect={true}
     *     emptyKey={EMPTY_KEYS}
     *     displayProperty="title"
     *     ... />
     * </pre>
     * @demo Controls-demo/dropdown_new/Input/EmptyText/EmptyKey/Index
     * @demo Controls-demo/dropdown_new/Input/MultiSelect/EmptyKey/Index
     * @see emptyText
     */
    emptyKey?: string | number;
}
