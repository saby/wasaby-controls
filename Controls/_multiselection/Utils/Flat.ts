/**
 * @kaizen_zone ba2b1294-cc16-4bec-aaf4-e4f0bc5bd89b
 */
import { ISelectionObject as ISelection } from 'Controls/interface';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { MultiSelectAccessibility, ISourceDataStrategy } from 'Controls/display';
import { CrudEntityKey } from 'Types/source';

export type IHasMoreUtil = (nodeKey: CrudEntityKey) => boolean;

export interface IFlatGetCountParams {
    collection: ISourceDataStrategy;
    selection: ISelection;
    hasMoreUtil: IHasMoreUtil;
    limit?: number;
    multiSelectAccessibilityProperty?: string;
    filter?: object;
}

export const ALL_SELECTION_VALUE = null;

export interface ICanBeSelectedParams {
    item: Model;
    multiSelectAccessibilityProperty?: string;
}

export function isAllSelected(selection: ISelection): boolean {
    return selection.selected.includes(ALL_SELECTION_VALUE);
}

export function canBeSelected(params: ICanBeSelectedParams): boolean {
    const { item } = params;
    // Если нет элемента, то скорее всего он не загружен. Считаем что его можно выбрать, точно сказать это не можем.
    if (!item) {
        return true;
    }

    let multiSelectAccessibility = item.get(params.multiSelectAccessibilityProperty);
    if (multiSelectAccessibility === undefined) {
        multiSelectAccessibility = MultiSelectAccessibility.enabled;
    }

    return multiSelectAccessibility === MultiSelectAccessibility.enabled;
}

export function getCount(params: IFlatGetCountParams): number | null {
    const { selection, limit, hasMoreUtil, collection, filter } = params;
    const rootKey = null;
    const hasMoreData = hasMoreUtil && hasMoreUtil(rootKey);

    let countItemsSelected: number | null;

    if (isAllSelected(selection)) {
        const itemsCanBeSelectedCount = factory(collection.getSourceCollection())
            .filter((item) => {
                return canBeSelected({ ...params, item });
            })
            .count();
        if (limit) {
            if (hasMoreData && limit > itemsCanBeSelectedCount) {
                // нельзя сказать что кол-во выбранных записей = limit, т.к. на БЛ возможно данных меньше лимита.
                countItemsSelected = null;
            } else {
                countItemsSelected =
                    limit < itemsCanBeSelectedCount
                        ? itemsCanBeSelectedCount - selection.excluded.length
                        : itemsCanBeSelectedCount;
            }
        } else {
            countItemsSelected =
                hasMoreData || filter || itemsCanBeSelectedCount < selection.excluded.length
                    ? null
                    : itemsCanBeSelectedCount - selection.excluded.length;
        }
    } else {
        countItemsSelected = selection.selected.filter((key) => {
            return canBeSelected({
                ...params,
                item: collection.getSourceItemByKey(key),
            });
        }).length;
    }

    return countItemsSelected;
}
