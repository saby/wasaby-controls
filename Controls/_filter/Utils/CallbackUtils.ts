/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { IFilterItem } from 'Controls/_filter/View/interface/IFilterItem';
import { TFilter } from 'Controls/_interface/IFilter';
import { isEqual } from 'Types/object';
import * as isEmpty from 'Core/helpers/Object/isEmpty';
import { loadAsync, loadSync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { object } from 'Types/util';
import { addPageDeps } from 'UI/Deps';

function loadCallBackByName(
    item: IFilterItem,
    callbackName: string
): Promise<Function | void> {
    let callbackModuleName;

    if (typeof item[callbackName] === 'string') {
        callbackModuleName = item[callbackName];
    }
    if (typeof item.editorOptions?.[callbackName] === 'string') {
        callbackModuleName = item.editorOptions[callbackName];
    }

    if (callbackModuleName) {
        addPageDeps([callbackModuleName]);
        return loadAsync(callbackModuleName);
    }
    return Promise.resolve();
}

export function isCallbacksLoaded(items: IFilterItem[]): boolean {
    return !items?.find((item) => {
        return (
            !isCallbackLoaded(item.filterVisibilityCallback) ||
            !isCallbackLoaded(item.filterChangedCallback)
        );
    });
}

function isCallbackLoaded(cb: string | Function): boolean {
    return (
        cb === undefined ||
        (typeof cb === 'string' && isLoaded(cb)) ||
        typeof cb === 'function'
    );
}

function callCallback<T>(
    callback: string | Function,
    item: IFilterItem,
    updatedFilter: TFilter,
    changedFilters: object,
    filterSource: IFilterItem[]
): T {
    const func =
        typeof callback === 'string' ? loadSync<Function>(callback) : callback;

    if (func) {
        return func(
            object.clonePlain(item),
            updatedFilter,
            changedFilters,
            filterSource
        );
    }
}

export function getChangedFilters(
    currentFilter: TFilter,
    updatedFilter: TFilter
): object {
    const changedFilters = {};
    // changed
    for (const filterName in currentFilter) {
        if (currentFilter.hasOwnProperty(filterName)) {
            if (
                !isEqual(currentFilter[filterName], updatedFilter[filterName])
            ) {
                changedFilters[filterName] = updatedFilter[filterName];
            }
        }
    }
    // added
    for (const filterName in updatedFilter) {
        if (
            updatedFilter.hasOwnProperty(filterName) &&
            !currentFilter.hasOwnProperty(filterName)
        ) {
            changedFilters[filterName] = updatedFilter[filterName];
        }
    }
    return changedFilters;
}

export function getItemOnFilterChangedCallback(
    item: IFilterItem,
    updatedFilter: TFilter,
    changedFilters: object,
    callback: string | Function,
    filterSource: IFilterItem[]
): IFilterItem {
    return (
        callCallback<IFilterItem>(
            callback,
            item,
            updatedFilter,
            changedFilters,
            filterSource
        ) || item
    );
}

export function getItemVisivbility(
    item: IFilterItem,
    updatedFilter: TFilter,
    changedFilters: object,
    callback: string | Function
): boolean {
    return callCallback<boolean>(callback, item, updatedFilter, changedFilters);
}

export function updateFilterDescription(
    items: IFilterItem[],
    currentFilter: TFilter,
    updatedFilter: TFilter,
    updateCallback: (filterItems: IFilterItem[]) => void
): void {
    const changedFilters = getChangedFilters(currentFilter, updatedFilter);
    if (!isEmpty(changedFilters)) {
        if (isCallbacksLoaded(items)) {
            callCallbacksOnFilterDescriptionItems(
                changedFilters,
                updatedFilter,
                items,
                updateCallback
            );
        } else {
            loadCallbacks(items).then(() => {
                callCallbacksOnFilterDescriptionItems(
                    changedFilters,
                    updatedFilter,
                    items,
                    updateCallback
                );
            });
        }
    } else {
        updateCallback(items);
    }
}

export function loadCallbacks(items: IFilterItem[]): Promise<Function[]> {
    const callBackPromises = [];
    const callbacks = [
        'filterVisibilityCallback',
        'filterChangedCallback',
        'descriptionToValueConverter',
        'itemActionVisibilityCallbackName',
    ];
    items?.forEach((item) => {
        callbacks.forEach((callbackName) => {
            return callBackPromises.push(
                loadCallBackByName(item, callbackName)
            );
        });
    });
    return Promise.all(callBackPromises);
}

export function callCallbacksOnFilterDescriptionItems(
    changedFilters: object,
    updatedFilter: TFilter,
    items: IFilterItem[],
    updateCallback: Function
): void {
    const newFilterDescription = [];
    items?.forEach((item) => {
        if (item.filterVisibilityCallback) {
            item.visibility = getItemVisivbility(
                item,
                updatedFilter,
                changedFilters,
                item.filterVisibilityCallback
            );
        }
        newFilterDescription.push(
            getItemOnFilterChangedCallback(
                item,
                updatedFilter,
                changedFilters,
                item.filterChangedCallback,
                items
            )
        );
    });
    updateCallback(newFilterDescription);
}
