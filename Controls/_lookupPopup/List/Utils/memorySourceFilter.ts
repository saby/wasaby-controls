/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { Model } from 'Types/entity';
import { BaseUtils } from 'Controls/listAspects';
import { TKeySelection, TSelectionRecordContent } from 'Controls/interface';

const FILTER_SELECTION_FIELD = 'selection';
const SELECTION_MARKED_FIELD = 'marked';

interface ISelectionFilter {
    selection: Model<TSelectionRecordContent>;
    [key: string]: unknown;
}

/**
 * Модуль возвращает функцию, которую можно использовать в опции {@link Types/_source/Local#filter filter} для локальных источников данных,
 * используемых для списочных контролов на окнах выбора.
 *
 * @remark
 * Аргументы функции:
 *
 * * item: Model
 * * filter: object - текущий фильтр списочного контрола
 * * keyProperty: string - Имя свойства, содержащего информацию об идентификаторе переданной записи.
 *
 * @example
 * <pre class="brush: js">
 * var myMemory = new Memory({
 *    data: myData,
 *    keyProperty: 'id',
 *    filter: function(item, filter) {
 *       return memorySourceFilter(item, filter, 'id');
 *    }
 * })
 * </pre>
 *
 * @class Controls/_lookupPopup/List/Utils/memorySourceFilter
 * @public
 */

/*
 * Function that used for filtering {@link Types/_source/Memory} with selection in query filter.
 * @param {item} item
 * @param {Object} filter
 * @param {String} idProperty
 * @example
 * var myMemory = new Memory({
 *     data: myData,
 *     keyProperty: 'id',
 *     filter: function(item, filter) {
 *         return memorySourceFilter(item, filter, 'id');
 *     }
 * })
 * @returns {Boolean}
 */

function filter(
    item: Model,
    filterObj: ISelectionFilter,
    keyProperty: string,
    parentProperty?: string
): boolean {
    const selection = filterObj[FILTER_SELECTION_FIELD];
    let result = true;
    let hasIdInMarked = false;

    if (selection) {
        const marked = selection.get(SELECTION_MARKED_FIELD);
        const recursive = selection.get('recursive');
        const itemId = String(item.get(keyProperty));
        const parentId = parentProperty ? String(item.get(parentProperty)) : void 0;

        if (BaseUtils.isAllSelected({ selectedKeys: marked })) {
            result = true;
        } else {
            marked.forEach((key: TKeySelection) => {
                const markedKey = String(key);
                if (
                    !hasIdInMarked &&
                    (itemId === markedKey || (recursive && parentId === markedKey))
                ) {
                    hasIdInMarked = true;
                }
            });
            result = hasIdInMarked;
        }
    }

    return result;
}

export = filter;
