import { Query } from 'Types/source';
import { factory } from 'Types/chain';
import * as cClone from 'Core/core-clone';
import { default as selectionToRecordUtil } from 'Controls/Utils/selectionToRecord';
import { process } from 'Controls/error';
import type { ISelectionObject, TSelectionType } from 'Controls/interface';
import type { RecordSet } from 'Types/collection';
import type { ICrud, QueryWhereExpression, CrudEntityKey } from 'Types/source';

// TODO Надо заставить ВСЕХ прикладников использовать DeleteSelected. Мы сами getItemsBySelection больше нигде не используем.
//  https://wi.sbis.ru/doc/platform/developmentapl/service-development/service-contract/objects/blmethods/blauto/delete-selected//
//  См. коммит f11f11a4049fffc411808b10363e844f42c87988 от 21.12.2022
//  После того, как это будет сделано, можно будет избавиться от getItemsBySelection.
//  Пока большинство работают исключительно через destroy/
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
