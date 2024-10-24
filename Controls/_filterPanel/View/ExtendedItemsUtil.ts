import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';

export function viewModeFilter(
    filterByViewMode: IFilterItem['viewMode'],
    { viewMode }: IFilterItem
): boolean {
    return viewMode === filterByViewMode || (filterByViewMode === 'basic' && !viewMode);
}

export function isFrequentFilterItem(
    item: IFilterItem,
    filterViewMode: string,
    editorsViewMode?: string
): boolean {
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

/**
 * Возвращает все элементы, которые отображаются в "Можно отобрать" в сброшенном фильтре.
 */
export function getAdditionalItems(
    typeDescription: IFilterItem[],
    viewMode: string
): IFilterItem[] {
    return typeDescription
        .filter((item) => {
            return isExtendedItem(item, viewMode);
        })
        .sort((item1, item2) => (item1.extendedOrder || 0) - (item2.extendedOrder || 0));
}

export function isExtendedItem(item: IFilterItem, viewMode: string): boolean {
    return !!(
        viewModeFilter('extended', item) ||
        isFrequentFilterItem(item, viewMode) ||
        (viewModeFilter('basic', item) && item.editorOptions?.extendedCaption)
    );
}
