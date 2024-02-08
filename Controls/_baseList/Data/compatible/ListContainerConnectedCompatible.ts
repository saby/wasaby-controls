import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_baseList/Data/compatible/ListContainerConnectedCompatible';
import { IContextValue, connectToDataContext } from 'Controls/context';
import { ListSlice, IListState, IListSliceErrorConfig } from 'Controls/dataFactory';
import type { IBrowserOptions } from 'Controls/_browser/Browser';
import { isEqual, isEmpty } from 'Types/object';
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';
import {
    TFilter,
    TKey,
    INavigationSourceConfig,
    TSelectionViewMode,
    ISelectionObject,
} from 'Controls/interface';
import { Logger } from 'UI/Utils';
import { RegisterClass } from 'Controls/event';
import { ICrudPlus, ICrud, IData, PrefetchProxy } from 'Types/source';
import { process } from 'Controls/error';
import { TViewMode } from 'Controls-DataEnv/interface';
import { INewListSchemeHandlers } from '../INewListScheme';
import { getHandlers } from '../useListContainerConnectedNewApi';

interface IConnectedCompatibleContainerOptions extends IControlOptions, IBrowserOptions {
    storeId: string;
    _dataOptionsValue: IContextValue;
}

const OPTIONS_CHECK_ON_MOUNT = [
    'filter',
    'sorting',
    'navigation',
    'parentProperty',
    'nodeProperty',
    'root',
    'keyProperty',
    'deepReload',
];

const LIST_OF_DATA_OPTIONS = OPTIONS_CHECK_ON_MOUNT.concat([
    'source',
    'searchValue',
    'sourceController',
    'expandedItems',
    'viewMode',
    'selectedKeys',
    'excludedKeys',
    'markedKey',
    'expandedItems',
    'collapsedItems',
]);

const STATES_FOR_CONTENT = [
    'filter',
    'searchValue',
    'searchMisspellValue',
    'viewMode',
    'markedKey',
    'count',
    'root',
    'items',
    'isAllSelected',
    'loading',
    'selectionViewMode',
    'selectedKeys',
    'excludedKeys',
    'expandedItems',
    'collapsedItems',
    'showSelectedCount',
    'listCommandsSelection',
];

function getSlice({ _dataOptionsValue, storeId }: IConnectedCompatibleContainerOptions): ListSlice {
    const slice = _dataOptionsValue[storeId];
    validateSlice(slice, storeId);
    return slice as ListSlice;
}

function validateSlice(slice: ListSlice | unknown, storeId: string): void {
    if (!slice) {
        throw new Error(
            `Controls/baseList:CompatibleContainerConnected в контексте не найден слайс по ключу ${storeId}`
        );
    }

    if (!slice['[IListSlice]']) {
        throw new Error(
            `Controls/baseList:CompatibleContainerConnected Слайс ${storeId} должен быть наследником cлайса списка`
        );
    }
}

function getOriginalSource(source: unknown): ICrudPlus | (ICrud & ICrudPlus & IData) | unknown {
    if (source instanceof PrefetchProxy) {
        return source.getOriginal();
    } else {
        return source;
    }
}

function getNamesOfChangedOptions(
    currentOptions: object,
    newOptions: IBrowserOptions | IListState,
    optionsList = LIST_OF_DATA_OPTIONS,
    equalCallback?: Function
): string[] {
    return optionsList.filter((optionName) => {
        const optionValue = currentOptions[optionName];
        const newOptionValue = newOptions[optionName];
        return equalCallback
            ? equalCallback(optionValue, newOptionValue)
            : !isEqual(optionValue, newOptionValue);
    }) as string[];
}

export function checkOptionsOnMount(
    options: IConnectedCompatibleContainerOptions,
    sliceState: IListState
): string[] {
    const equalFunc = (optionValue, sliceStateValue) => {
        return optionValue !== undefined && !isEqual(optionValue, sliceStateValue);
    };
    const changedOptions = getNamesOfChangedOptions(
        options,
        sliceState,
        OPTIONS_CHECK_ON_MOUNT,
        equalFunc
    );
    // source в опции передают из prefetchResult и он там PrefetchProxy
    // при этом в контексте это уже обычный источник, поэтому пока приходится костылить проверку
    if (getOriginalSource(options.source) !== getOriginalSource(sliceState.source)) {
        changedOptions.push('source');
    }

    // Фильтр на слайсе и в опциях при передаче опции searchValue будет отличаться,
    // и это не ошибка, так было и раньше. В слайсе для фильтра сразу устанавливается searchValue
    if (changedOptions.includes('filter') && options.searchValue) {
        changedOptions.splice(changedOptions.indexOf('filter'), 1);
    }

    return changedOptions;
}

// Экспорт для типов
export class CompatibleContainer
    extends Control<IConnectedCompatibleContainerOptions, void>
    implements INewListSchemeHandlers
{
    protected _template: TemplateFunction = template;
    protected _slice: ListSlice;
    protected _selectedTypeRegister: RegisterClass;

    protected _searchValue: string;
    protected _searchMisspellValue: string;
    protected _items: RecordSet;
    protected _filter: TFilter;
    protected _markedKey: TKey;
    protected _count: number | void;
    protected _root: TKey;
    protected _isAllSelected: boolean;
    protected _loading: boolean;
    protected _errorConfig: IListSliceErrorConfig;
    protected _viewMode: TViewMode;
    protected _selectionViewMode: TSelectionViewMode;
    protected _showSelectedCount: number;
    protected _listCommandsSelection: ISelectionObject;

    protected _beforeMount(options: IConnectedCompatibleContainerOptions): void {
        this._initSlice(options);
        this._bindHandlersForListNewScheme();
        const invalidOptions = checkOptionsOnMount(options, this._slice.state);

        if (invalidOptions.length) {
            let errorMsg = `Отличается значение опций ${invalidOptions.join(
                ', '
            )} у контрола и sourceController'a.
        Как поправить ошибку: `;

            // _dataSyntheticStoreId задаём мы сами для списка или DataContainer'a,
            // а иначе это Browser
            if (options.storeId === '_dataSyntheticStoreId') {
                errorMsg += `проверьте что опции контрола (список или Controls/listDataOld:DataContainer) совпадают с опциями sourceController'a.
        Опции sourceController'a берутся из конфигурации загрузчика sabyPage.`;
            } else {
                errorMsg +=
                    'проверьте, что опции Controls/browser совпадают с опциями, которые задаются в конфигурации загрузчика sabyPage.';
            }

            errorMsg +=
                ' (подробнее тут: https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/).';
            Logger.error(errorMsg, this);
        }
    }

    protected _beforeUpdate(options: IConnectedCompatibleContainerOptions): void {
        const slice = getSlice(options);
        const sliceChanged = this._slice !== slice;

        if (sliceChanged) {
            this._initSlice(options);
        }

        if (!sliceChanged) {
            if (getNamesOfChangedOptions(this._options, options).length) {
                this._syncBrowserOptionsAndSliceState(options);
            }

            if (slice.state.errorConfig && !this._errorConfig) {
                this._errorConfig = slice.state.errorConfig;

                if (options.dataLoadErrback) {
                    options.dataLoadErrback(this._errorConfig.error);
                }

                if (!this._errorConfig.error.processed) {
                    process({ error: this._errorConfig.error });
                }
            } else {
                this._errorConfig = null;
            }

            if (this._isSliceStateChanged()) {
                this._sliceStateChanged(slice.state, options);
            }

            if (slice.state.command) {
                this._getSelectionTypeRegister().start(slice.state.command);
                slice.onExecutedCommand();
            }
        }
    }

    protected _beforeUnmount(): void {
        this._selectedTypeRegister?.destroy();
    }

    protected _misspellCaptionClick(event: SyntheticEvent, caption: string): void {
        this._slice.setState({
            searchValue: caption,
            searchInputValue: caption,
        });
    }

    protected _initSlice(options: IConnectedCompatibleContainerOptions): void {
        this._slice = getSlice(options);
        const sliceState = this._slice.state;
        this._updateBrowserStateBySliceState(sliceState);
        if (sliceState.items) {
            options.dataLoadCallback?.(sliceState.items);
        }
        sliceState.sourceController.setDataLoadCallback(options.dataLoadCallback);
        sliceState.sourceController.setNodeLoadCallback(options.nodeLoadCallback);
    }

    private _updateBrowserStateBySliceState(state: IListState): void {
        STATES_FOR_CONTENT.forEach((stateName) => {
            this['_' + stateName] = state[stateName];
        });
    }

    private _isStateInSliceAndInBrowserChanged(stateName: string, sliceState: IListState): boolean {
        const nameOfStateOnBrowser = '_' + stateName;
        const sliceStateValue = sliceState[stateName];
        return !isEqual(this[nameOfStateOnBrowser], sliceStateValue);
    }

    private _isSliceStateChanged(): boolean {
        return STATES_FOR_CONTENT.some((stateName) => {
            return this._isStateInSliceAndInBrowserChanged(stateName, this._slice.state);
        });
    }

    private _sliceStateChanged(
        newState: IListState,
        newOptions: IConnectedCompatibleContainerOptions
    ): void {
        let hasChanges = false;
        STATES_FOR_CONTENT.forEach((stateName) => {
            if (this._isStateInSliceAndInBrowserChanged(stateName, newState)) {
                const optionValue = newOptions[stateName];
                const sliceValue = newState[stateName];
                hasChanges = true;

                if (optionValue === undefined || !isEqual(optionValue, sliceValue)) {
                    this._notify(stateName + 'Changed', [sliceValue]);
                }
            }
        });

        if (hasChanges) {
            this._updateBrowserStateBySliceState(newState);
        }
    }

    protected _syncBrowserOptionsAndSliceState(options): void {
        const stateForSlice = {};

        LIST_OF_DATA_OPTIONS.forEach((optName) => {
            const optionValue = options[optName];
            if (
                optionValue !== undefined &&
                !isEqual(optionValue, this._options[optName]) &&
                !isEqual(optionValue, this._slice.state[optName])
            ) {
                stateForSlice[optName] = optionValue;
            }
        });

        if (!isEmpty(stateForSlice)) {
            this._slice.setState(stateForSlice);
        }
    }

    protected _setOptionToSliceAndNotify(
        event: SyntheticEvent,
        optionName: string,
        optionValue: unknown
    ): void {
        if (
            this._options[optionName] === undefined &&
            !isEqual(this._slice.state[optionName], optionValue)
        ) {
            this._slice.setState({ [optionName]: optionValue });
        }
        this._notify(optionName + 'Changed', [optionValue]);
    }

    protected _selectedCountChanged(
        event: SyntheticEvent,
        count: number,
        isAllSelected: boolean
    ): void {
        this._slice.setSelectionCount(count, isAllSelected);
    }

    protected _registerHandler(
        event: Event,
        registerType: string,
        component: Control,
        callback: Function
    ): void {
        this._getSelectionTypeRegister().register(event, registerType, component, callback);
    }

    protected _unregisterHandler(
        event: Event,
        registerType: string,
        component: Control,
        callback: Function
    ): void {
        this._getSelectionTypeRegister().register(event, registerType, component, callback);
    }

    protected _getSelectionTypeRegister(): RegisterClass {
        if (!this._selectedTypeRegister) {
            this._selectedTypeRegister = new RegisterClass({
                register: 'selectedTypeChanged',
            });
        }
        return this._selectedTypeRegister;
    }

    protected _selectedTypeChangedHandler(event: Event, type: TSelectionViewMode): void {
        if (type === 'all' || type === 'selected') {
            this._slice.setSelectionViewMode(type);
        }
        this._slice.executeCommand(type);
    }

    protected _loadExpandedItem(event: Event, key: TKey): Promise<RecordSet | Error> | void {
        if (!this._slice.hasLoaded(key)) {
            event.stopPropagation();
            return this._slice.load(void 0, key);
        }
    }

    protected _onDataError(event, errorCfg): void {
        if (errorCfg.error && !errorCfg.error.processed) {
            process(errorCfg);
        }
    }

    reload(config: INavigationSourceConfig): Promise<RecordSet | Error> {
        return this._slice.reload(config);
    }

    //# region INewListSchemeHandlers
    protected _bindHandlersForListNewScheme() {
        const h = getHandlers({
            slice: this._slice,
            changeRootByItemClick: this._options.changeRootByItemClick,
        });
        Object.keys(h).forEach((hName) => {
            this[hName] = h[hName as keyof typeof h].bind(this);
        });
    }

    //# endregion INewListSchemeHandlers
}

export default connectToDataContext<CompatibleContainer>(CompatibleContainer);