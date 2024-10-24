import { IFilterItemConfiguration } from './interface/IFilterItemConfiguration';
import IFilterItem from 'Controls/_filter/interface/IFilterDescriptionItem';
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
import type { TFilterItemLocalName } from 'Controls/_filter/interface/IFilterItemLocal';
import { getFilterItemProperty } from 'Controls/_filter/FilterDescription';

/**
 * Модуль для подготовки и загрузки данных для фильтровs
 * @public
 */

export const FILTER_USER_PARAM_POSTFIX = '-filterUserConfiguration';

const LIST_EDITOR = 'Controls/filterPanel:ListEditor';
const LOOKUP_EDITOR = 'Controls/filterPanelEditors:Lookup';
const DATE_MENU_EDITOR = 'Controls/filterPanelEditors:DateMenu';

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

/**
 * Загрузка конфигурации фильтров по идентификатору хранилища
 * @param {string} propStorageId
 */
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

/**
 * Возвращает true, если передан редактор Lookup
 * @param {IFilterItem} options
 */
function isLookupType({ type, editorTemplateName }: IFilterItem): boolean {
    return type === 'lookup' || editorTemplateName === 'Controls/filterPanelEditors:Lookup';
}

/**
 * Возвращает true, если передан редактор Dropdown
 * @param {Partial<IFilterItem>} options
 */
function isDropdownType({ type, editorTemplateName }: Partial<IFilterItem>): boolean {
    return editorTemplateName === 'Controls/filterPanelEditors:Dropdown' || type === 'dropdown';
}

/**
 * Возвращает true, если список отображается в окне фильтра
 * @param {Partial<IFilterItem>} options
 */
function isPopupList({ type }: Partial<IFilterItem>): boolean {
    return type === 'filterPopupList';
}

/**
 * Возвращает true, если передан редактор списка
 * @param {IFilterItem} options
 */
function isListType({ type, editorTemplateName }: IFilterItem): boolean {
    return type === 'list' || editorTemplateName === LIST_EDITOR;
}

/**
 * Возвращает true, если нужно инициализировать описание фильтра
 * @param {IFilterItem[]} filterDescription
 */
function isNeedInitFilterDescription(filterDescription: IFilterItem[]): boolean {
    return (
        Array.isArray(filterDescription) &&
        filterDescription.some((filterItem) => {
            return isNeedInitFilterItem(filterItem);
        })
    );
}

/**
 * Возвращает true, если нужно инициализировать описание элемента фильтра
 * @param {IFilterItem} filterItem
 */
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

/**
 * Инициализирует конфигурацию фильтров по переданным данным
 * @param {IFilterItem[]} filterDescription
 */
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

/**
 * Перезагружает элемент фильтра
 * @param {string} filterName
 * @param {IFilterItem[]} filterDescription
 * @param {IBaseSourceConfig} sourceConfig
 * @param {boolean} keepNavigation
 */
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

/**
 * Возвращает true, если коллбэки filterVisibilityCallback, filterChangedCallback, descriptionToValueConverter, itemActionVisibilityCallbackName загружены
 * @param {IFilterItem[]} items
 */
function isCallbacksLoaded(items: IFilterItem[]): boolean {
    return !items?.find((item) => {
        return FILTER_ITEM_CALLBACKS.find((callbackName) => {
            const callback = item[callbackName] || item.editorOptions?.[callbackName];
            return !isCallbackLoaded(callback);
        });
    });
}

/**
 * Возвращает true, если переданный коллбэк загружен
 * @param {string | Function} cb
 */
function isCallbackLoaded(cb: string | Function): boolean {
    return (
        cb === undefined ||
        cb === null ||
        (typeof cb === 'string' && isLoaded(cb)) ||
        typeof cb === 'function'
    );
}

/**
 * Загрузка коллбэков filterVisibilityCallback, filterChangedCallback, descriptionToValueConverter, itemActionVisibilityCallbackName
 * @param {IFilterItem[]} items
 */
export function loadCallbacks(items: IFilterItem[]): Promise<Function[]> {
    const callBackPromises = [];
    items?.forEach((item) => {
        FILTER_ITEM_CALLBACKS.forEach((callbackName) => {
            return callBackPromises.push(loadCallBackByName(item, callbackName));
        });
        if (
            item.editorTemplateName === DATE_MENU_EDITOR &&
            !item.editorOptions?.dateMenuItems &&
            !item.editorOptions?.items
        ) {
            callBackPromises.push(loadModuleByName('Controls/dateUtils'));
            if (item.editorOptions?.userPeriods) {
                item.editorOptions.userPeriods.forEach((userPeriod) => {
                    if (userPeriod.getValueFunctionName) {
                        callBackPromises.push(loadModuleByName(userPeriod.getValueFunctionName));
                    }
                });
            }
        }
    });
    return Promise.all(callBackPromises);
}

/**
 * Загружает шаблоны редакторов элементов фильтра
 * @param {IFilterItem[]} items
 * @param {string} editorsViewMode
 * @param {string} searchParam
 */
export function loadEditorTemplateName(
    items: IFilterItem[],
    editorsViewMode: string,
    searchParam?: string
): Promise<Function> {
    const promises = [];
    updateEditorTemplateNameByMap(items);
    const hasListEditor = items.some((item) => isListType(item));
    if (hasListEditor && !isLoaded(LOOKUP_EDITOR)) {
        if (editorsViewMode === 'cloud') {
            promises.push(loadAsync(LOOKUP_EDITOR));
        } else if (editorsViewMode === 'cloud|default') {
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
                promises.push(loadAsync(LOOKUP_EDITOR));
            }
        }
    }
    const dateMenuEditors = items.filter(
        (item) =>
            item.editorTemplateName === DATE_MENU_EDITOR &&
            !item.editorOptions?.dateMenuItems &&
            !item.editorOptions?.items
    );
    if (dateMenuEditors.length && editorsViewMode === 'cloud') {
        promises.push(loadAsync('Controls/filterPanelEditors:GetDateMenuTextValue'));
    }
    const hasChangedDateMenuEditor = dateMenuEditors.some(
        (item) =>
            !isEqual(item.value, item.resetValue) &&
            (editorsViewMode === 'cloud' || item.viewMode === 'frequent')
    );
    if (hasChangedDateMenuEditor) {
        promises.push(loadAsync('Controls/filterDateRangeEditor'));
    }
    return Promise.all(promises);
}

/**
 * Обновляет шаблоны редакторов элементов фильтра по правилам из EDITORS_NAME_MAP
 * @param {IFilterItem[]} items
 */
function updateEditorTemplateNameByMap(items: IFilterItem[]): void {
    items.forEach((item) => {
        if (!!EDITORS_NAME_MAP[item.editorTemplateName]) {
            item.editorTemplateName = EDITORS_NAME_MAP[item.editorTemplateName];
        }
    });
}

/**
 * Загружает коллбэк по имени
 * @param {IFilterItem} item
 * @param {string} callbackName
 */
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
        return loadModuleByName(callbackModuleName);
    }
    return Promise.resolve();
}

/**
 * Загружает модуль по имени
 * @param {string} moduleName
 */
function loadModuleByName(moduleName: string): Promise<Function | void> {
    addPageDeps([moduleName]);
    return loadAsync(moduleName);
}

/**
 * Загружает коллбэки по переданному имени для всех элементов фильтра
 * @param {IFilterItem[]} items
 * @param {TFilterCallbackName} callbackName
 */
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

/**
 * Возвращает true, если нужно загрузить данные конфигурации фильтров
 * @param {IFilterItem[]} filterSource
 */
function isNeedLoadFilterDescriptionData(filterSource: IFilterItem[]): boolean {
    return filterSource.some((item: IFilterItem) => {
        return needPrepareFilterItem(item);
    });
}

/**
 * Возвращает true, если нужно загрузить данные для элемента фильтра
 * @param {IFilterItem} filterItem
 * @param {boolean} loadItemsForPopup
 */
function needPrepareFilterItem(filterItem: IFilterItem, loadItemsForPopup?: boolean): boolean {
    return (
        ((isLookupType(filterItem) || isListType(filterItem)) &&
            // frequent фильтры строятся по textValue, для них данные запрашивать не надо
            filterItem.viewMode !== 'frequent') ||
        ((isDropdownType(filterItem) || isPopupList(filterItem)) && !!loadItemsForPopup)
    );
}

/**
 * Возвращает true, если нужно загрузить данные для редактора элемента фильтра
 * @param {IFilterItem} options
 */
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

/**
 * Загружает данные для редактора элемента фильтра
 * @param {IFilterItem} item
 */
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

function prepareLoadedData(
    filterDescription: IFilterItem[],
    filterItemLocalProperty?: TFilterItemLocalName
): IFilterItem[] {
    return filterDescription.map((filterItem) => {
        const localPropValue = filterItem[filterItemLocalProperty];
        if (localPropValue?.editorOptions && needPrepareFilterItem(filterItem)) {
            return {
                ...filterItem,
                [filterItemLocalProperty]: {
                    ...localPropValue,
                    editorOptions: filterItem.editorOptions,
                },
            };
        }
        return filterItem;
    });
}

function getItemsWithBasicViewMode(
    filterItems: IFilterItem[],
    userConfig?: IFilterItemConfiguration[]
): IFilterItem[] {
    if (userConfig?.length) {
        return filterItems.filter((item) => {
            const filterConfiguration = userConfig.find(({ name }) => name === item.name);
            return filterConfiguration?.viewMode !== 'extended';
        });
    }
    return filterItems;
}

function getFilterDescriptionWithLoadedItems(
    filterItems: IFilterItem[],
    updatedSource: IFilterItem[]
): IFilterItem[] {
    return filterItems.map((item) => {
        const updatedItem = updatedSource.find(({ name }) => name === item.name);
        return updatedItem || item;
    });
}

/**
 * Загружает данные конфигурации элементов фильтра
 * @param {IFilterItem[]} filterSource
 * @param {string} editorsViewMode
 * @param {number} loadDataTimeout
 * @param {boolean} loadItemsForPopup
 */
function loadFilterDescriptionData(
    filterSource: IFilterItem[],
    editorsViewMode: string,
    loadDataTimeout?: number,
    loadItemsForPopup?: boolean,
    filterItemLocalProperty?: TFilterItemLocalName,
    userConfig?: IFilterItemConfiguration[]
): Promise<IFilterItem[]> {
    const filterStructurePromise = prepareFilterDataForLoad(
        filterSource,
        editorsViewMode,
        loadItemsForPopup,
        filterItemLocalProperty
    );
    const dataFactoryPromise =
        loadAsync<typeof import('Controls/dataFactory')>('Controls/dataFactory');
    return Promise.all([filterStructurePromise, dataFactoryPromise]).then(
        ([filterStructure, { PropertyGrid }]) => {
            return PropertyGrid.loadData({
                typeDescription: getItemsWithBasicViewMode(
                    filterStructure,
                    userConfig
                ) as IProperty[],
                editingObject: {},
                loadDataTimeout,
            }).then((loadResult) =>
                prepareLoadedData(
                    getFilterDescriptionWithLoadedItems(
                        filterStructure,
                        loadResult.typeDescription
                    ) as IFilterItem[],
                    filterItemLocalProperty
                )
            );
        }
    );
}

/**
 * Получает элемент фильтра по переданному значению
 * @param {IFilterItem} filterItem
 * @param {boolean} propertyChanged
 * @param {string} editorsViewMode
 * @param {boolean} loadItemsForPopup
 */
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

/**
 * Подготавливает данные для загрузки
 * @param {IFilterItem[]} description
 * @param {string} editorsViewMode
 * @param {boolean} loadItemsForPopup
 */
function prepareFilterDataForLoad(
    description: IFilterItem[],
    editorsViewMode: string,
    loadItemsForPopup: boolean,
    filterItemLocalProperty?: TFilterItemLocalName
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
            clonedProperty.editorOptions = {
                ...getFilterItemProperty(clonedProperty, 'editorOptions', filterItemLocalProperty),
            };
            clonedProperty.editorTemplateName = getFilterItemProperty(
                property,
                'editorTemplateName',
                filterItemLocalProperty
            );
            if (needPrepareFilterItem(clonedProperty, loadItemsForPopup)) {
                const propertyChanged = !isEqual(property.value, property.resetValue);
                const isBuildByItems =
                    clonedProperty.editorOptions?.buildByItems &&
                    clonedProperty.editorOptions?.items;
                const isListTypeFilter =
                    isListType(clonedProperty) ||
                    (isPopupList(clonedProperty) && loadItemsForPopup);
                const isDropdownTypeFilter =
                    isDropdownType(clonedProperty) &&
                    editorsViewMode === 'cloud' &&
                    !isBuildByItems;
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
                        clonedProperty,
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

function isNeedLoadExtendedItemsTemplate(
    filterDescription: IFilterItem[],
    editorsViewMode: string
): boolean {
    const hasExtendedItems = filterDescription.find(({ viewMode }) => viewMode === 'extended');
    const hasExtendedListItems = filterDescription.find(
        (filterItem) =>
            filterItem.viewMode === 'extended' &&
            filterItem.expanderVisible &&
            isListType(filterItem)
    );
    return hasExtendedItems && (editorsViewMode === 'cloud' || hasExtendedListItems);
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
    loadEditorOptions,
    isNeedLoadExtendedItemsTemplate,
};
