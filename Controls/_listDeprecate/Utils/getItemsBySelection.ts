/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { CrudEntityKey } from 'Types/source';
import { getItemsBySelection as originGetItemsBySelection } from 'Controls/listCommands';

/**
 * @typedef {Object} ISelectionObject
 * @property {Array<string|number>} selected массив идентификаторов отмеченных записей
 * @property {Array<string|number>} excluded массив идентификаторов записей, исключённых из отметки
 */

/**
 * Функция позволяет по переданным параметрам получить выборку из отмеченных записей.
 * @function Controls/_listDeprecate/Utils#getItemsBySelection
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
export function getItemsBySelection(...args): Promise<CrudEntityKey[]> {
    return originGetItemsBySelection(...args);
}
