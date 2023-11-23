/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Query, ICrud, QueryWhereExpression, CrudEntityKey } from 'Types/source';
import { factory } from 'Types/chain';
import { ISelectionObject, TSelectionType } from 'Controls/interface';
import * as cClone from 'Core/core-clone';
import { default as selectionToRecordUtil } from 'Controls/Utils/selectionToRecord';
import { process } from 'Controls/error';
import { RecordSet } from 'Types/collection';

/**
 * @typedef {Object} ISelectionObject
 * @property {Array<string|number>} selected массив идентификаторов отмеченных записей
 * @property {Array<string|number>} excluded массив идентификаторов записей, исключённых из отметки
 */

/**
 * Функция позволяет по переданным параметрам получить выборку из отмеченных записей.
 * @name Controls/_baseList/utils#getItemsBySelection
 * @function getItemsBySelection
 * @param {ISelectionObject} selection Объект, описывающий выделение
 * @param {Types/source:ICrud} dataSource Источник данных
 * @param {Types/collection:RecordSet} items Коллекция записей списка
 * @param {object} filter объект, описывающий фильтрацию
 * @param {number} limit Максимальное количество записей в выборке
 * @param {string} selectionType Тип записей, доступных для выбора, поддерживаются варианты: "all", "leaf", "node"
 *
 * @example
 * <pre>
 * const selection = {
 *     selected: [1,2,3],
 *     excluded: []
 * };
 * const source = new SbisService(...)
 * const filter = {
 *     onlyStore: true
 * }
 * import('Controls/list').then((listLib) => {
 *      listLib.getItemsBySelection(selection, source, items, filter).then(() => {
 *          ...
 *      });
 * });
 * </pre>
 * @public
 */
export function getItemsBySelection(
    selection: ISelectionObject,
    dataSource: ICrud,
    items: RecordSet,
    filter: QueryWhereExpression<unknown>,
    limit?: number,
    selectionType?: TSelectionType
): Promise<CrudEntityKey[]> {
    let item;
    const query: Query = new Query();
    let selectedItems = [];

    if (items) {
        selection.selected.forEach((key) => {
            item = items.getRecordById(key);
            if (item) {
                selectedItems.push(item.getId());
            }
        });
    } else if (selection.selected.length && selection.selected[0] !== null) {
        selectedItems = selection.selected;
    }

    // Do not load the data if they are all in the current recordSet.
    if (selectedItems.length === selection.selected.length && !selection.excluded?.length) {
        return Promise.resolve(selectedItems);
    }

    const filterClone = filter ? cClone(filter) : {};

    filterClone.selection = selectionToRecordUtil(
        selection,
        'adapter.sbis',
        selectionType,
        selection.recursive !== false
    );

    if (limit) {
        query.limit(limit);
    }
    return dataSource
        .query(query.where(filterClone))
        .then((list) => {
            return factory(list.getAll())
                .toArray()
                .map((curItem) => {
                    return curItem.getKey();
                });
        })
        .catch((error) => {
            return process({ error }).then(() => {
                return [];
            });
        });
}
