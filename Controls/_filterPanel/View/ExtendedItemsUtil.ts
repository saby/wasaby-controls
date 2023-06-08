import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';

export function viewModeFilter(
    filterByViewMode: IFilterItem['viewMode'],
    { viewMode }: IFilterItem
): boolean {
    return viewMode === filterByViewMode || (filterByViewMode === 'basic' && !viewMode);
}

export function isFrequentFilterItem(item: IFilterItem, filterViewMode: string, editorsViewMode?: string): boolean {
    const isFrequent = viewModeFilter('frequent', item);
    if (filterViewMode === 'popup') {
        return isFrequent;
    }
    return editorsViewMode === 'cloud' && isFrequent;
}

export function isExtendedItemCurrent(item: IFilterItem, filterViewMode: string): boolean {
    return (
        viewModeFilter('extended', item) ||
        (isFrequentFilterItem(item, filterViewMode) && isEqual(item.value, item.resetValue))
    );
}

/**
 * Возвращает элементы, которые сейчас отображаются в "Можно отобрать".
 */
export function getExtendedItems(source: IFilterItem[], filterViewMode: string): IFilterItem[] {
    return source.filter((item) => {
        return isExtendedItemCurrent(item, filterViewMode);
    });
}

export function isExtendedItem(item: IFilterItem, viewMode: string): boolean {
    return !!(
        viewModeFilter('extended', item) ||
        isFrequentFilterItem(item, viewMode) ||
        (viewModeFilter('basic', item) && item.editorOptions?.extendedCaption)
    );
}
