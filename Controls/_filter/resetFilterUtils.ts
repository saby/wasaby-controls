/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { factory } from 'Types/chain';
import { object as objectUtils } from 'Types/util';
import { RecordSet } from 'Types/collection';
import { IFilterItem, IEditorOptions, TViewMode } from './View/interface/IFilterItem';

const getPropValue = objectUtils.getPropertyValue;
const setPropValue = objectUtils.setPropertyValue;

export function hasResetValue(items: RecordSet) {
    let hasReset = false;
    factory(items).each((item) => {
        if (hasReset) {
            return;
        }
        hasReset = getPropValue(item, 'resetValue') !== undefined;
    });
    return hasReset;
}

export function resetFilterItem(item: IFilterItem): IFilterItem {
    const resetValue = getPropValue(item, 'resetValue');
    const textValue = getPropValue(item, 'textValue');
    const editorOptions = getPropValue<IEditorOptions>(item, 'editorOptions');
    const viewMode = getPropValue<TViewMode>(item, 'viewMode');
    const filterVisibilityCallback = getPropValue(item, 'filterVisibilityCallback');

    if (getPropValue(item, 'visibility') !== undefined) {
        if (filterVisibilityCallback) {
            // visibility проставляется на элементе, если для него передан filterVisibilityCallback
            // сбросим его именно в undefined, как неопределённое состояние видимости
            // (в фильтре оно трактуется как фильтр виден)
            setPropValue(item, 'visibility', undefined);
        } else if (item.viewMode === 'extended' && !item.editorTemplateName) {
            setPropValue(item, 'visibility', false);
        }
    }
    if (item.hasOwnProperty('resetValue')) {
        setPropValue(item, 'value', resetValue);

        if (editorOptions?.extendedCaption && viewMode === 'basic') {
            setPropValue(item, 'viewMode', 'extended');
        }
        if (textValue !== undefined) {
            setPropValue(item, 'textValue', textValue === null ? textValue : '');
        }
    }
    return item;
}

export function resetFilter(items: IFilterItem[], clone?: boolean): IFilterItem[] {
    const filterItems = clone ? objectUtils.clonePlain(items) : items;
    factory(filterItems).each((item) => {
        resetFilterItem(item);
    });
    return filterItems;
}
