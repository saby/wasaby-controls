import { IFilterItemConfiguration } from './View/interface/IFilterItemConfiguration';
import { loadSavedConfig } from 'Controls/Application/SettingsController';
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

export const FILTER_USER_PARAM_POSTFIX = '-filterUserConfiguration';

export const FILTER_EDITORS_WHICH_REQUIRED_DATA_LOAD = [
    'Controls/filterPanel:ListEditor',
    'Controls/filterPanel:LookupEditor',
];

export function loadFilterConfiguration(
    propStorageId: string
): Promise<IFilterItemConfiguration[]> {
    // loadSavedConfig для совместимости до 23.7100
    const userParamId = propStorageId + FILTER_USER_PARAM_POSTFIX;
    return Promise.all([
        USER.load([userParamId]),
        loadSavedConfig<['filterUserConfiguration']>(propStorageId, ['filterUserConfiguration']),
    ]).then(([userParams, configurationPromiseResult]) => {
        const userParamsValue = userParams.get(userParamId);
        let userSettings;

        if (userParamsValue) {
            userSettings = JSON.parse(userParamsValue);
        } else {
            userSettings = configurationPromiseResult?.filterUserConfiguration;

            if (userSettings) {
                USER.set(userParamId, JSON.stringify(userSettings));
            }
        }

        return Array.isArray(userSettings) ? userSettings : [];
    });
}

function isNeedInitFilterDescription(filterDescription: IFilterItem[]): boolean {
    return (
        Array.isArray(filterDescription) &&
        filterDescription.some((filterItem) => {
            return isNeedInitFilterItem(filterItem);
        })
    );
}

function isNeedInitFilterItem({ editorOptions, editorTemplateName, type }: IFilterItem): boolean {
    const loadByType =
        FILTER_EDITORS_WHICH_REQUIRED_DATA_LOAD.includes(editorTemplateName) || type === 'list';
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
        return (
            !isCallbackLoaded(item.filterVisibilityCallback) ||
            !isCallbackLoaded(item.filterChangedCallback)
        );
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
    const callbacks = [
        'filterVisibilityCallback',
        'filterChangedCallback',
        'descriptionToValueConverter',
        'itemActionVisibilityCallbackName',
    ];
    items?.forEach((item) => {
        callbacks.forEach((callbackName) => {
            return callBackPromises.push(loadCallBackByName(item, callbackName));
        });
    });
    return Promise.all(callBackPromises);
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

function isNeedLoadFilterDescriptionData(filterSource: IFilterItem[]): boolean {
    return filterSource.some((item: IFilterItem) => {
        return needPrepareFilterItem(item);
    });
}

function needPrepareFilterItem({ type, editorTemplateName, viewMode }: IFilterItem): boolean {
    return (
        (type === 'list' || FILTER_EDITORS_WHICH_REQUIRED_DATA_LOAD.includes(editorTemplateName)) &&
        // frequent фильтры строятся по textValue, для них данные запрашивать не надо
        viewMode !== 'frequent'
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
    loadDataTimeout?: number
): Promise<IFilterItem[]> {
    const filterStructurePromise = loadFilterData(filterSource, editorsViewMode);
    const dataFactoryPromise =
        loadAsync<typeof import('Controls/dataFactory')>('Controls/dataFactory');
    return Promise.all([filterStructurePromise, dataFactoryPromise]).then(
        ([filterStructure, { PropertyGrid }]) => {
            return PropertyGrid.loadData({
                typeDescription: filterStructure as IProperty[],
                loadDataTimeout,
            }) as unknown as Promise<IFilterItem[]>;
        }
    );
}

function loadFilterData(
    description: IFilterItem[],
    editorsViewMode: string
): Promise<IFilterItem[]> {
    const getFilter = (
        { editorOptions, value }: IFilterItem,
        filter: TFilter,
        propertyChanged: boolean
    ): TFilter => {
        const resultFilter = filter || {};
        if (
            propertyChanged &&
            editorOptions.navigation &&
            editorsViewMode !== 'popupCloudPanelDefault'
        ) {
            resultFilter[editorOptions.keyProperty] = Array.isArray(value) ? value : [value];
        }
        if (editorOptions.historyId) {
            resultFilter._historyIds = [editorOptions.historyId];
        }
        return resultFilter;
    };
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
            const editorTemplateName = property.editorTemplateName;
            if (needPrepareFilterItem(property)) {
                const propertyChanged = !isEqual(property.value, property.resetValue);
                const isListEditor = editorTemplateName === 'Controls/filterPanel:ListEditor';
                let filter;

                // Загрузку записей, даже если параметр фильтра не изменён, надо делать только для редактора
                // в виде списка, например для lookup'a ничего загружать не надо
                if (propertyChanged || isListEditor || property.type === 'list') {
                    filter = getFilter(property, property.editorOptions.filter, propertyChanged);
                    if (isListEditor) {
                        property.type = 'list';
                    }
                    property.editorOptions.filter = filter;
                    property.editorOptions.sourceController?.setFilter(filter);
                }
            }
            return property;
        });
    });
}

export default {
    reloadFilterItem,
    initFilterDescriptionFromData,
    loadFilterConfiguration,
    isCallbacksLoaded,
    loadCallbacks,
    FILTER_USER_PARAM_POSTFIX,
    isNeedLoadFilterDescriptionData,
    loadFilterDescriptionData,
};
