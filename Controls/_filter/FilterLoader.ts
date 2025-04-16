import { IFilterItemConfiguration } from './interface/IFilterItemConfiguration';
import {
    IFilterDescriptionItem,
    IFilterDescriptionItem as IFilterItem,
    TFilter,
} from 'Controls-DataEnv/interface';
import { object } from 'Types/util';
import {
    NewSourceController as SourceController,
    ISourceControllerOptions,
} from 'Controls/dataSource';
import { RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import { Logger } from 'UI/Utils';
import { IBaseSourceConfig } from 'Controls/interface';
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { addPageDeps } from 'UICommon/Deps';
import { USER } from 'ParametersWebAPI/Scope';
import type { IProperty } from 'Controls/propertyGrid';
import type { TFilterItemLocalName } from 'Controls/_filter/interface/IFilterItemLocal';
import {
    getFilterItemProperty,
    isFrequentDateRangeItem,
    getItemByName,
} from 'Controls/_filter/FilterDescription';
import { QueryWhereExpression } from 'Types/source';

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
];

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
                if (
                    filterItem.editorOptions?.historyId &&
                    filterItem.editorOptions?.parentProperty &&
                    isListType(filterItem) &&
                    //временное решение https://online.saby.ru/opendoc.html?guid=d959a56d-a84e-483b-8e22-d092e6cd9b22&client=3
                    !filterItem.editorOptions?.isFlatHistory
                ) {
                    const {
                        prepareFilterPanelHistoryItems,
                        setHistoryItemsGroupProperty,
                        COPY_ORIG_ID,
                    } = loadSync(
                        'Controls/Utils/History/PrepareFilterPanelItems'
                    ) as typeof import('Controls/Utils/History/PrepareFilterPanelItems');

                    const historyItems = prepareFilterPanelHistoryItems(
                        filterItem?.editorOptions?.items,
                        filterItem.editorOptions.historyId,
                        {
                            parentProperty: filterItem.editorOptions.parentProperty,
                            keyProperty: filterItem.editorOptions.keyProperty,
                            nodeProperty: filterItem.editorOptions.nodeProperty,
                        }
                    );

                    setHistoryItemsGroupProperty(historyItems, filterItem?.editorOptions);

                    newFilterItem.editorOptions.sourceController = new SourceController({
                        ...(filterItem.editorOptions as ISourceControllerOptions),
                        items: historyItems as RecordSet,
                        keyProperty: COPY_ORIG_ID,
                    });
                } else {
                    newFilterItem.editorOptions.sourceController = new SourceController({
                        ...(filterItem.editorOptions as ISourceControllerOptions),
                        items: filterItem.editorOptions.items,
                    });
                }
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

function getItemCallback(item: IFilterDescriptionItem, callbackName: string): Function | void {
    return item[callbackName] || item.editorOptions?.[callbackName];
}

function clearItemsCallbacks(
    filterDescription: IFilterDescriptionItem[]
): Omit<
    IFilterDescriptionItem,
    'filterVisibilityCallback' | 'filterChangedCallback' | 'descriptionToValueConverter'
>[] {
    return filterDescription.map((descriptionItem) => {
        const item: IFilterDescriptionItem = { ...descriptionItem };
        FILTER_ITEM_CALLBACKS.forEach((callbackName) => {
            if (typeof item[callbackName] === 'function') {
                delete item[callbackName];
            }
        });
        return item;
    });
}

function restoreItemsCallbacks(
    loadedFilterDescription: IFilterDescriptionItem[],
    configFilterDescription: IFilterDescriptionItem[]
): IFilterDescriptionItem[] {
    return loadedFilterDescription.map((filterDescriptionItem) => {
        const item = getItemByName(configFilterDescription, filterDescriptionItem.name);
        return {
            ...item,
            ...filterDescriptionItem,
        };
    });
}

/**
 * Возвращает true, если коллбэки filterVisibilityCallback, filterChangedCallback, descriptionToValueConverter, itemActionVisibilityCallbackName загружены
 * @param {IFilterItem[]} items
 */
function isCallbacksLoaded(items: IFilterItem[]): boolean {
    return !items?.find((item) => {
        return FILTER_ITEM_CALLBACKS.find((callbackName) => {
            const callback = getItemCallback(item, callbackName);
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

        callBackPromises.push(loadHistoryUtils(items));

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
    editorsViewMode?: string,
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
    if (editorsViewMode === 'cloud' && items.some((item) => isDateMenuEditor(item))) {
        promises.push(loadAsync('Controls/filterPanelEditors:GetDateMenuTextValue'));
    }

    promises.push(loadHistoryUtils(items));

    const needLoadFilterDateRangeEditor = items.some(
        (item) =>
            isFrequentDateRangeItem(item) ||
            (isDateMenuEditor(item) &&
                !isEqual(item.value, item.resetValue) &&
                (editorsViewMode === 'cloud' || item.viewMode === 'frequent'))
    );

    if (needLoadFilterDateRangeEditor) {
        promises.push(loadModuleByName('Controls/filterDateRangeEditor'));
    }
    return Promise.all(promises);
}

function loadHistoryUtils(items: IFilterItem[]): Promise<any> | null {
    const hasHistory = items.some(
        (item) =>
            isListType(item) &&
            item?.editorOptions?.historyId &&
            item?.editorOptions?.parentProperty
    );
    return hasHistory ? loadModuleByName('Controls/Utils/History/PrepareFilterPanelItems') : null;
}

function isDateMenuEditor({ editorTemplateName, editorOptions }: IFilterItem): boolean {
    return (
        editorTemplateName === DATE_MENU_EDITOR &&
        !editorOptions?.dateMenuItems &&
        !editorOptions?.items
    );
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
    const callback = getItemCallback(item, callbackName);
    let callbackModuleName;

    if (typeof callback === 'string') {
        callbackModuleName = callback;
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
async function loadEditorOptions(item: IFilterItem): Promise<object> {
    const editorOptions = item.editorOptions || {};
    let resultEditorOptions = {};

    if (item.__editorOptionsResolved) {
        return Promise.resolve(editorOptions);
    }

    const editorOptionsNameResult = await loadAsync<Function | object>(
        item.editorOptionsName as string
    );

    if (editorOptionsNameResult instanceof Function) {
        resultEditorOptions = await editorOptionsNameResult(editorOptions);
    } else {
        resultEditorOptions = editorOptionsNameResult;
    }

    return Promise.resolve({ ...editorOptions, ...(resultEditorOptions || {}) });
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

/**
 * Загружает данные конфигурации элементов фильтра
 * @param {IFilterItem[]} filterSource
 * @param {string} editorsViewMode
 * @param {number} loadDataTimeout
 * @param {boolean} loadItemsForPopup
 */
function loadFilterDescriptionData(
    filterSource: IFilterItem[],
    editorsViewMode?: string,
    loadDataTimeout?: number,
    loadItemsForPopup?: boolean,
    filterItemLocalProperty?: TFilterItemLocalName
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
        async ([filterStructure, { PropertyGrid }]) => {
            if (filterStructure) {
                await loadHistoryUtils(filterStructure);
            }
            return PropertyGrid.loadData({
                typeDescription: filterStructure as IProperty[],
                editingObject: {},
                loadDataTimeout,
            }).then((loadResult) =>
                prepareLoadedData(
                    loadResult.typeDescription as IFilterItem[],
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
    editorsViewMode?: string,
    loadItemsForPopup?: boolean
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
    } else if (
        isDropdownType(filterItem) &&
        loadItemsForPopup &&
        (editorOptions.historyId || !!editorOptions.source?.['[Controls/_historyOld/Source]'])
    ) {
        resultFilter.$_history = true;
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
    editorsViewMode?: string,
    loadItemsForPopup?: boolean,
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
    editorsViewMode?: string
): boolean {
    const hasExtendedItems =
        filterDescription.findIndex(({ viewMode }) => viewMode === 'extended') !== -1;
    const hasExtendedListItems = filterDescription.find(
        (filterItem) =>
            filterItem.viewMode === 'extended' &&
            filterItem.expanderVisible &&
            isListType(filterItem)
    );
    return (
        hasExtendedItems &&
        (editorsViewMode === 'cloud' || hasExtendedListItems) &&
        !isLoaded('Controls/filterPanelExtendedItems')
    );
}

function loadFilterTemplates(
    filterDescription: IFilterItem[],
    editorsViewMode?: string,
    searchParam?: string
): Promise<unknown> {
    const editorTemplatesPromise = loadEditorTemplateName(
        filterDescription,
        editorsViewMode,
        searchParam
    );
    let extendedItemsTemplatePromise;
    const searchSelectedItemTemplatePromises: any[] = [];

    if (isNeedLoadExtendedItemsTemplate(filterDescription, editorsViewMode)) {
        extendedItemsTemplatePromise = loadAsync('Controls/filterPanelExtendedItems');
        addPageDeps(['Controls/filterPanelExtendedItems']);
    }

    filterDescription.forEach((filterItem) => {
        if (
            filterItem?.editorOptions?.searchSelectedItemTemplate &&
            typeof filterItem?.editorOptions?.searchSelectedItemTemplate === 'string' &&
            !isEqual(filterItem.value, filterItem.resetValue)
        ) {
            searchSelectedItemTemplatePromises.push(
                loadAsync(filterItem?.editorOptions?.searchSelectedItemTemplate)
            );
        }
    });

    return Promise.all([
        editorTemplatesPromise,
        extendedItemsTemplatePromise,
        ...searchSelectedItemTemplatePromises,
    ]);
}

export interface IFilterDepsLoadConfig {
    editorsViewMode?: string;
    countFilterValueConverter?:
        | string
        | ((
              value: string | Date | Date[],
              filterItem: IFilterDescriptionItem,
              filterDescription: IFilterDescriptionItem[]
          ) => QueryWhereExpression<unknown>);
    filter?: TFilter;
    searchParam?: string;
    loadDataTimeout?: number;
}

/**
 * Функция загрузки зависимостей фильтра
 * */
export async function loadFilterDescriptionDeps(
    filterDescription: IFilterDescriptionItem[],
    config: IFilterDepsLoadConfig,
    countFilterValue?: unknown
): Promise<IFilterDescriptionItem[] | void> {
    let loadFilterDataPromise;
    let loadFilterDataAndCallbacksPromise;
    let loadFilterLibPromise;

    if (filterDescription) {
        if (!isLoaded('Controls/filter')) {
            await loadAsync('Controls/filter');
        }
        addPageDeps(['Controls/filter']);
    }

    const { FilterLoader, FilterDescription, loadCallbacks } =
        loadSync<typeof import('Controls/filter')>('Controls/filter');
    const loadFilterCallbacksPromise = loadCallbacks(filterDescription);
    const { countFilterValueConverter, editorsViewMode } = config;
    let countFilterPromise;
    if (typeof countFilterValueConverter === 'string') {
        countFilterPromise = loadAsync(countFilterValueConverter);
        addPageDeps([countFilterValueConverter]);
    }

    if (filterDescription && FilterLoader.isNeedLoadFilterDescriptionData(filterDescription)) {
        loadFilterDataPromise = Promise.all([loadFilterCallbacksPromise, countFilterPromise]).then(
            () => {
                const filterDescr = FilterDescription.isFilterDescriptionChanged(filterDescription)
                    ? FilterDescription.callFilterChangedCallbackOnFilterDescription(
                          filterDescription,
                          config.filter
                      )
                    : filterDescription;
                const filterDescriptionWithFilterCount = FilterDescription.applyFilterCounter(
                    countFilterValue,
                    filterDescr,
                    config
                );
                return FilterLoader.loadFilterDescriptionData(
                    filterDescriptionWithFilterCount,
                    editorsViewMode ?? 'default',
                    config.loadDataTimeout,
                    false,
                    'panel'
                );
            }
        );
    }

    const loadTemplatesPromise = loadFilterTemplates(
        filterDescription,
        editorsViewMode,
        config.searchParam
    );

    if (filterDescription.find((filter) => !!filter.filterVisibilityCallback)) {
        loadFilterDataAndCallbacksPromise = Promise.all([
            loadFilterDataPromise,
            loadFilterCallbacksPromise,
        ]).then(([loadedFilterDescription]) => {
            FilterDescription.callVisibilityCallbackOnFilterDescription(
                loadedFilterDescription || filterDescription,
                config.filter
            );
            return loadedFilterDescription;
        });
    }

    if (filterDescription) {
        loadFilterLibPromise = loadAsync('Controls/filter');
    }

    return Promise.all([
        loadFilterDataPromise,
        loadFilterCallbacksPromise,
        loadTemplatesPromise,
        loadFilterDataAndCallbacksPromise,
        loadFilterLibPromise,
    ]).then(([filterDescription]) => filterDescription);
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
    loadFilterTemplates,
    isNeedLoadExtendedItemsTemplate,
    loadFilterDescriptionDeps,
    clearItemsCallbacks,
    restoreItemsCallbacks,
};
