import { ISelectionObject as ISelection, TKeySelection } from 'Controls/interface';
import { factory } from 'Types/chain';
import { Model } from 'Types/entity';
import { MultiSelectAccessibility, ISourceDataStrategy } from 'Controls/display';
import { Utils as BaseUtils } from 'Controls/abstractSelectionAspect';
export type IHasMoreUtil = (nodeKey: TKeySelection) => boolean;

export interface IFlatGetCountParams {
    collection: ISourceDataStrategy;
    selection: ISelection;
    hasMoreUtil: IHasMoreUtil;
    limit?: number;
    multiSelectAccessibilityProperty?: string;
    filter?: object;
}

export const ALL_SELECTION_VALUE = BaseUtils.ALL_SELECTION_VALUE;

export interface ICanBeSelectedParams {
    item: Model;
    multiSelectAccessibilityProperty?: string;
}

export function isAllSelected(selection: ISelection): boolean {
    // FIXME
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return BaseUtils.isAllSelected({
        selectedKeys: selection.selected,
        excludedKeys: selection.excluded,
    });
}

export function canBeSelected(params: ICanBeSelectedParams): boolean {
    const { item } = params;
    // Если нет элемента, то скорее всего он не загружен. Считаем что его можно выбрать, точно сказать это не можем.
    if (!item) {
        return true;
    }

    let multiSelectAccessibility;
    if (typeof params.multiSelectAccessibilityProperty !== 'undefined') {
        multiSelectAccessibility = item.get(params.multiSelectAccessibilityProperty);
    }

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
        const itemsCanBeSelectedCount = factory<Model>(collection.getSourceCollection())
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
                item: collection.getSourceItemByKey(key) as Model,
            });
        }).length;
    }

    return countItemsSelected;
}
