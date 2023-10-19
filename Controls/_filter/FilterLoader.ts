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
import { IBaseSourceConfig } from 'Controls/interface';
import { isLoaded, loadAsync } from 'WasabyLoader/ModulesLoader';
import { constants } from 'Env/Env';
import { addPageDeps } from 'UICommon/Deps';

export const FILTER_EDITORS_WHICH_REQUIRED_DATA_LOAD = [
    'Controls/filterPanel:ListEditor',
    'Controls/filterPanel:LookupEditor',
];

export function loadFilterConfiguration(
    propStorageId: string
): Promise<IFilterItemConfiguration[]> {
    return loadSavedConfig<['filterUserConfiguration']>(propStorageId, [
        'filterUserConfiguration',
    ]).then((configurationPromiseResult) => {
        const userSettings = configurationPromiseResult?.filterUserConfiguration;
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

export default {
    reloadFilterItem,
    initFilterDescriptionFromData,
    loadFilterConfiguration,
    isCallbacksLoaded,
    loadCallbacks,
};
