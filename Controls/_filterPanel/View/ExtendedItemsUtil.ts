import {IFilterItem} from 'Controls/filter';
import { isEqual } from 'Types/object';

export function viewModeFilter(
    filterByViewMode: IFilterItem['viewMode'],
    { viewMode }: IFilterItem
): boolean {
    return viewMode === filterByViewMode || (filterByViewMode === 'basic' && !viewMode);
}

export function isFrequentFilterItem(item: IFilterItem, filterViewMode: string): boolean {
    if (filterViewMode === 'popup') {
        return viewModeFilter('frequent', item);
    }
    return false;
}

export function isExtendedItem(item: IFilterItem, filterViewMode: string): boolean {
    return (
        viewModeFilter('extended', item) ||
        (isFrequentFilterItem(item, filterViewMode) && isEqual(item.value, item.resetValue))
    );
}

/**
 * Возвращает элементы, которые сейчас отображаются в "Можно отобрать".
 */
export  function getExtendedItems(source: IFilterItem[], filterViewMode: string): IFilterItem[] {
    return source.filter((item) => {
        return isExtendedItem(item, filterViewMode);
    });
}