import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { IContextValue } from 'Controls/context';
import { ListSlice, IListState } from 'Controls/dataFactory';
import { IBrowserOptions } from 'Controls/_browser/Browser';
import { isEqual, isEmpty } from 'Types/object';
import { RecordSet } from 'Types/collection';
import { SyntheticEvent } from 'UICommon/Events';
import { TFilter, TKey } from 'Controls/interface';
import { Logger } from 'UI/Utils';
import { RegisterClass } from 'Controls/event';
import * as template from 'wml!Controls/_browser/resources/BrowserConnected';

interface IConnectedBrowserOptions extends IControlOptions, IBrowserOptions {
    dataStoreId: string;
    _dataOptionsValue: IContextValue;
}

const LIST_OF_DATA_OPTIONS = [
    'source',
    'filter',
    'sorting',
    'navigation',
    'searchValue',
    'parentProperty',
    'nodeProperty',
    'root',
    'expandedItems',
];

const STATES_FOR_CONTENT = [
    'filter',
    'searchValue',
    'searchMisspellValue',
    'markedKey',
    'count',
    'root',
];

function getSlice({ _dataOptionsValue, dataStoreId }: IConnectedBrowserOptions): ListSlice {
    const slice = _dataOptionsValue[dataStoreId];
    validateSlice(slice, dataStoreId);
    return slice;
}

function validateSlice(slice: ListSlice | unknown, dataStoreId: string): void {
    if (!slice) {
        throw new Error(
            `Controls/browser:Browser в контексте не найден слайс по ключу ${dataStoreId}`
        );
    }

    if (!slice['[IListSlice]']) {
        throw new Error(
            `Controls/browser:Browser Слайс ${dataStoreId} должен быть наследником cлайса списка`
        );
    }
}

function isDataOptionsChanged(
    currentOptions: object,
    newOptions: IBrowserOptions | IListState
): boolean {
    return LIST_OF_DATA_OPTIONS.some((optionName) => {
        return (
            currentOptions[optionName] !== undefined &&
            !isEqual(currentOptions[optionName], newOptions[optionName])
        );
    });
}

export default class BrowserConnected extends Control<IConnectedBrowserOptions> {
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

    protected _beforeMount(options: IConnectedBrowserOptions): void {
        this._initSlice(options);

        if (isDataOptionsChanged(options, this._slice.state)) {
            Logger.error(`Controls/browser:Browser на маунте отличается состояние слайса со storeId: ${options.dataStoreId} 
                          и опций Browser'a. Необходимо обеспечить, 
                          чтобы опции в загрузчике совпадали с опциями Browser'a на маунте.`);
            this._syncBrowserOptionsAndSliceState(options);
        }
    }

    protected _beforeUpdate(options: IConnectedBrowserOptions): void {
        const slice = getSlice(options);
        const sliceChanged = this._slice !== slice;

        if (sliceChanged) {
            this._initSlice(options);
        }

        if (!sliceChanged) {
            if (isDataOptionsChanged(this._options, options)) {
                this._syncBrowserOptionsAndSliceState(options);
            }

            if (this._isSliceStateChanged()) {
                this._sliceStateChanged(slice.state);
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

    protected _initSlice(options: IConnectedBrowserOptions): void {
        const slice = getSlice(options);
        this._slice = slice;
        this._updateBrowserStateBySliceState(slice.state);
    }

    private _updateBrowserStateBySliceState(state: IListState): void {
        this._searchValue = state.searchValue;
        this._searchMisspellValue = state.searchMisspellValue;
        this._markedKey = state.markedKey;
        this._count = state.count;
        this._filter = state.filter;
        this._items = state.items;
        this._root = state.root;
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

    private _sliceStateChanged(newState: IListState): void {
        let hasChanges = false;
        STATES_FOR_CONTENT.forEach((stateName) => {
            if (this._isStateInSliceAndInBrowserChanged(stateName, newState)) {
                hasChanges = true;
                this._notify(stateName + 'Changed', [newState[stateName]]);
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

    protected _selectedTypeChangedHandler(event: Event, type: string): void {
        this._getSelectionTypeRegister().start(type);
    }
}
