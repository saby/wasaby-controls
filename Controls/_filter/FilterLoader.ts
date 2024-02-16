import { IFilterItemConfiguration } from './View/interface/IFilterItemConfiguration';
import { IFilterItem } from 'Controls/_filter/View/interface/IFilterItem';
import { object } from 'Types/util';
import {
    NewSourceController as SourceController,
    ISourceControllerOptions,
} from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import { Logger } from 'UI/Utils';
import { IBaseSourceConfig, TFilter } from 'Controls/interface';
import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import { constants } from 'Env/Env';
import { addPageDeps } from 'UICommon/Deps';
import { USER } from 'ParametersWebAPI/Scope';
import type { IProperty } from 'Controls/propertyGrid';
import { default as FilterCalculator } from 'Controls/_filter/FilterCalculator';

export const FILTER_USER_PARAM_POSTFIX = '-filterUserConfiguration';

const LIST_EDITOR = 'Controls/filterPanel:ListEditor';
const LOOKUP_EDITOR = 'Controls/filterPanelEditors:Lookup';

export const EDITORS_NAME_MAP = {
    'Controls/filterPanel:TextEditor': 'Controls/filterPanelEditors:Boolean',
    'Controls/filterPanel:BooleanEditor': 'Controls/filterPanelEditors:Boolean',
    'Controls/filterPanel:DateMenuEditor': 'Controls/filterPanelEditors:DateMenu',
    'Controls/filterPanel:DateRangeEditor': 'Controls/filterPanelEditors:DateRange',
    'Controls/filterPanel:DateEditor': 'Controls/filterPanelEditors:Date',
    'Controls/filterPanel:DropdownEditor': 'Controls/filterPanelEditors:Dropdown',
    'Controls/filterPanel:LookupEditor': 'Controls/filterPanelEditors:Lookup',
    'Controls/filterPanel:LookupInputEditor': 'Controls/filterPanelEditors:LookupInput',
};

const FILTER_ITEM_CALLBACKS = [
    'filterVisibilityCallback',
    'filterChangedCallback',
    'descriptionToValueConverter',
    'itemActionVisibilityCallbackName',
] as const;

type TFilterCallbackName = (typeof FILTER_ITEM_CALLBACKS)[number];

export function loadFilterConfiguration(
    propStorageId: string
): Promise<IFilterItemConfiguration[]> {
    const userParamId = propStorageId + FILTER_USER_PARAM_POSTFIX;
    return USER.load([userParamId]).then((userParams) => {
        const userParamsValue = userParams.get(userParamId);
        let userSettings;

        if (userParamsValue) {
            try {
                userSettings = JSON.parse(userParamsValue);
            } catch (e) {
                Logger.error(
                    'Ошибка разбора сохранённой конфигурации фильтров. Проверьте на правильность JSON и обратитесь за консультацией в платформу.',
                    null,
                    e
                );
                userSettings = [];
            }
        }

        return Array.isArray(userSettings) ? userSettings : [];
    });
}

function isLookupType({ type, editorTemplateName }: IFilterItem): boolean {
    return type === 'lookup' || editorTemplateName === 'Controls/filterPanelEditors:Lookup';
}

function isDropdownType({ type, editorTemplateName }: Partial<IFilterItem>): boolean {
    return editorTemplateName === 'Controls/filterPanelEditors:Dropdown' || type === 'dropdown';
}

function isPopupList({ type }: Partial<IFilterItem>): boolean {
    return type === 'filterPopupList';
}

function isListType({ type, editorTemplateName }: IFilterItem): boolean {
    return type === 'list' || editorTemplateName === LIST_EDITOR;
}

function isNeedInitFilterDescription(filterDescription: IFilterItem[]): boolean {
    return (
        Array.isArray(filterDescription) &&
        filterDescription.some((filterItem) => {
            return isNeedInitFilterItem(filterItem);
        })
    );
}

function isNeedInitFilterItem(filterItem: IFilterItem): boolean {
    const loadByType = isListType(filterItem) || isLookupType(filterItem);
    const { editorOptions } = filterItem;
    return !!(
        editorOptions &&
        loadByType &&
        editorOptions.source &&
        !editorOptions.sourceController
    );
}

export function initFilterDescriptionFromData(filterDescription: IFilterItem[]): IFilterItem[] {
    if (isNeedInitFilterDescription(filterDescription)) {
        const preparedFilterDescription = [];

        filterDescription.forEach((filterItem) => {
            if (isNeedInitFilterItem(filterItem)) {
                // делаем поверхностное клонирование, чтобы сохранить ссылку на items
                const newFilterItem = object.clonePlain(filterItem, {
                    processCloneable: false,
                });
                newFilterItem.editorOptions.sourceController = new SourceController({
                    ...(filterItem.editorOptions as ISourceControllerOptions),
                    items: filterItem.editorOptions.items as RecordSet,
                });
                preparedFilterDescription.push(newFilterItem);
            } else {
                preparedFilterDescription.push(filterItem);
            }
        });

        return preparedFilterDescription;
    } else {
        return filterDescription;
    }
}

export function reloadFilterItem(
    filterName: string,
    filterDescription: IFilterItem[],
    sourceConfig?: IBaseSourceConfig,
    keepNavigation?: boolean
): void | Promise<RecordSet | Error> {
    const filterItem = filterDescription.find(({ name }) => {
        return name === filterName;
    });

    if (!filterItem) {
        Logger.error(
            `FilterLoader::reloadFilterItem() в структуре фильтров отстуствует элемент с именем ${filterName}`,
            this
        );
        return;
    }

    const editorOptions = filterItem.editorOptions;

    if (!editorOptions.source) {
        Logger.error(
            `$FilterLoader::reloadFilterItem() элемент структуры фильтров ${filterName} не поддерживает перезагрузку.`,
            this
        );
        return;
    }

    return editorOptions.sourceController
        .reload(sourceConfig, undefined, undefined, keepNavigation)
        .then((result) => {
            if (!isEqual(editorOptions.items, editorOptions.sourceController.getItems())) {
                (editorOptions.items as RecordSet).assign(
                    editorOptions.sourceController.getItems()
                );
            }
            return result;
        })
        .catch((error) => {
            return error;
        });
}

function isCallbacksLoaded(items: IFilterItem[]): boolean {
    return !items?.find((item) => {
        return FILTER_ITEM_CALLBACKS.find((callbackName) => {
            const callback = item[callbackName] || item.editorOptions?.[callbackName];
            return !isCallbackLoaded(callback);
        });
    });
}

function isCallbackLoaded(cb: string | Function): boolean {
    return (
        cb === undefined ||
        cb === null ||
        (typeof cb === 'string' && isLoaded(cb)) ||
        typeof cb === 'function'
    );
}

export function loadCallbacks(items: IFilterItem[]): Promise<Function[]> {
    const callBackPromises = [];
    items?.forEach((item) => {
        FILTER_ITEM_CALLBACKS.forEach((callbackName) => {
            return callBackPromises.push(loadCallBackByName(item, callbackName));
        });
    });
    return Promise.all(callBackPromises);
}

export function loadEditorTemplateName(
    items: IFilterItem[],
    editorsViewMode: string,
    searchParam?: string
): Promise<Function> | void {
    updateEditorTemplateNameByMap(items);
    const hasListEditor = items.some((item) => isListType(item));
    if (hasListEditor && !isLoaded(LOOKUP_EDITOR)) {
        if (editorsViewMode === 'cloud') {
            return loadAsync(LOOKUP_EDITOR);
        }
        if (editorsViewMode === 'cloud|default') {
            const isChangedFilterPopupItem = items.some((item) => {
                return (
                    !isEqual(item.value, item.resetValue) &&
                    item.viewMode !== 'frequent' &&
                    item.visibility !== false &&
                    item.name !== searchParam &&
                    item.type !== 'list'
                );
            });
            if (isChangedFilterPopupItem) {
                return loadAsync(LOOKUP_EDITOR);
            }
        }
    }
}

function updateEditorTemplateNameByMap(items: IFilterItem[]): void {
    items.forEach((item) => {
        if (!!EDITORS_NAME_MAP[item.editorTemplateName]) {
            item.editorTemplateName = EDITORS_NAME_MAP[item.editorTemplateName];
        }
    });
}

function loadCallBackByName(item: IFilterItem, callbackName: string): Promise<Function | void> {
    const callback = item[callbackName] || item.editorOptions?.[callbackName];
    let callbackModuleName;

    if (typeof callback === 'string') {
        callbackModuleName = callback;
    } else if (typeof callback === 'function') {
        const moduleName =
            callback._moduleName || (callback.prototype && callback.prototype._moduleName);

        if (!moduleName && constants.isServerSide) {
            Logger.error(`FilterLoader::функция, указанная в ${callbackName} элемента структуры фильтра c именем ${item.name}, не сериализуется, потому что она анонимная.
                      ${callbackName} надо задать в виде строки (путь до функции) или указать функцию, которая экспортируется из библиотеки`);
        }
    }

    if (callbackModuleName) {
        addPageDeps([callbackModuleName]);
        return loadAsync(callbackModuleName);
    }
    return Promise.resolve();
}

function loadCallbacksByName(
    items: IFilterItem[],
    callbackName: TFilterCallbackName
): Promise<(void | Function)[] | void> {
    return Promise.all(
        items.map((item) => {
            return loadCallBackByName(item, callbackName);
        })
    );
}

function isNeedLoadFilterDescriptionData(filterSource: IFilterItem[]): boolean {
    return filterSource.some((item: IFilterItem) => {
        return needPrepareFilterItem(item);
    });
}

function needPrepareFilterItem(filterItem: IFilterItem, loadItemsForPopup?: boolean): boolean {
    return (
        ((isLookupType(filterItem) || isListType(filterItem)) &&
            // frequent фильтры строятся по textValue, для них данные запрашивать не надо
            filterItem.viewMode !== 'frequent') ||
        ((isDropdownType(filterItem) || isPopupList(filterItem)) && !!loadItemsForPopup)
    );
}

function needLoadEditorOptions({
    type,
    value,
    resetValue,
    editorTemplateName,
}: IFilterItem): boolean {
    const isPropertyChanged = !isEqual(value, resetValue);
    const isListEditor = editorTemplateName === 'Controls/filterPanel:ListEditor';
    return isPropertyChanged || isListEditor || type === 'list';
}

function loadEditorOptions(item: IFilterItem): Promise<object> {
    const editorOptions = item.editorOptions || {};
    let resultEditorOptions;
    return loadAsync<Function | object>(item.editorOptionsName).then((loadedEditorOptions) => {
        if (loadedEditorOptions instanceof Function) {
            resultEditorOptions = loadedEditorOptions(editorOptions);
            if (resultEditorOptions instanceof Promise) {
                return resultEditorOptions.then((loadedOptions) => {
                    return {
                        ...editorOptions,
                        ...loadedOptions,
                    };
                });
            } else {
                return {
                    ...editorOptions,
                    ...resultEditorOptions,
                };
            }
        } else {
            resultEditorOptions = Promise.resolve({ ...editorOptions, ...loadedEditorOptions });
        }
        return resultEditorOptions;
    });
}

function loadFilterDescriptionData(
    filterSource: IFilterItem[],
    editorsViewMode: string,
    loadDataTimeout?: number,
    loadItemsForPopup?: boolean
): Promise<IFilterItem[]> {
    const filterStructurePromise = prepareFilterDataForLoad(
        filterSource,
        editorsViewMode,
        loadItemsForPopup
    );
    const dataFactoryPromise =
        loadAsync<typeof import('Controls/dataFactory')>('Controls/dataFactory');
    return Promise.all([filterStructurePromise, dataFactoryPromise]).then(
        ([filterStructure, { PropertyGrid }]) => {
            return PropertyGrid.loadData({
                typeDescription: filterStructure as IProperty[],
                editingObject: FilterCalculator.getFilterByFilterDescription({}, filterSource),
                loadDataTimeout,
            }).then((loadResult) => loadResult.typeDescription as IFilterItem[]);
        }
    );
}

function getFilterByValue(
    filterItem: IFilterItem,
    propertyChanged: boolean,
    editorsViewMode: string,
    loadItemsForPopup: boolean
): TFilter {
    const filter = filterItem.editorOptions.filter;
    const resultFilter = { ...filter };
    const { editorOptions, value } = filterItem;
    if (
        propertyChanged &&
        (editorsViewMode === 'cloud' || editorOptions.navigation) &&
        isListType(filterItem)
    ) {
        resultFilter[editorOptions.keyProperty] = Array.isArray(value) ? value : [value];
    }
    if (editorOptions.historyId && !loadItemsForPopup) {
        resultFilter._historyIds = [editorOptions.historyId];
    }
    return resultFilter;
}

function prepareFilterDataForLoad(
    description: IFilterItem[],
    editorsViewMode: string,
    loadItemsForPopup: boolean
): Promise<IFilterItem[]> {
    return Promise.all(
        description.map((item) => {
            return item.editorOptionsName && needLoadEditorOptions(item)
                ? loadEditorOptions(item)
                : undefined;
        })
    ).then((loadedEditorOptions) => {
        description.forEach((item, index) => {
            if (item.editorOptionsName) {
                item.editorOptions = {
                    ...item?.editorOptions,
                    ...loadedEditorOptions[index],
                };
            }
        });
        return description.map((property) => {
            const clonedProperty = { ...property };
            if (needPrepareFilterItem(property, loadItemsForPopup)) {
                const propertyChanged = !isEqual(property.value, property.resetValue);
                const isListTypeFilter =
                    isListType(property) || (isPopupList(property) && loadItemsForPopup);
                const isDropdownTypeFilter =
                    isDropdownType(property) && editorsViewMode === 'cloud';
                let filter;

                // Загрузку записей, даже если параметр фильтра не изменён, надо делать только для редактора
                // в виде списка, например для lookup'a ничего загружать не надо
                if (propertyChanged || isListTypeFilter || isDropdownTypeFilter) {
                    if (isListTypeFilter || (!propertyChanged && isDropdownTypeFilter)) {
                        clonedProperty.type = 'list';
                    } else if (isDropdownTypeFilter) {
                        clonedProperty.type = 'dropdown';
                    } else if (isLookupType(property) && propertyChanged) {
                        clonedProperty.type = 'lookup';
                    }
                    filter = getFilterByValue(
                        property,
                        propertyChanged,
                        editorsViewMode,
                        loadItemsForPopup
                    );
                    clonedProperty.editorOptions.filter = filter;
                    clonedProperty.editorOptions.sourceController?.setFilter(filter);
                }
            }
            return clonedProperty;
        });
    });
}

export default {
    reloadFilterItem,
    initFilterDescriptionFromData,
    loadFilterConfiguration,
    isCallbacksLoaded,
    loadCallbacks,
    loadCallbacksByName,
    FILTER_USER_PARAM_POSTFIX,
    isNeedLoadFilterDescriptionData,
    loadFilterDescriptionData,
    loadEditorTemplateName,
};
