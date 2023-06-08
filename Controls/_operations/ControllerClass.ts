/**
 * @kaizen_zone 47124c7e-27dc-43e5-a39f-fcc418c550f0
 */
import { RegisterClass } from 'Controls/event';
import { Control } from 'UI/Base';
import { Model, OptionsToPropertyMixin, SerializableMixin, ObservableMixin } from 'Types/entity';
import {
    ISelectionObject,
    TKey,
    ISourceOptions,
    INavigationSourceConfig,
} from 'Controls/interface';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IAction } from 'Controls/actions';
import { NewSourceController as SourceController } from 'Controls/dataSource';
import { isEqual } from 'Types/object';
import { mixin } from 'Types/util';

interface IKeysByList {
    [key: string]: TKey[];
}

interface ISelectedKeyCountByList {
    count: number;
    isAllSelected: boolean;
}

interface ISelectedKeysCountByList {
    [key: string]: ISelectedKeyCountByList;
}

interface IOperationsControllerOptions {
    selectedKeys: TKey[];
    excludedKeys: TKey[];
    root: TKey;
    selectionViewMode: string;
}

export interface IExecuteCommandParams extends ISourceOptions {
    target?: SyntheticEvent;
    selection?: ISelectionObject;
    item?: Model;
    filter?: Record<string, any>;
    parentProperty?: string;
    nodeProperty?: string;
    navigation?: INavigationSourceConfig;
    sourceController?: SourceController;
    operationsController?: OperationsController;
    selectedKeysCount?: number;
    toolbarSelectedKeys?: TKey[];
    toolbarItem?: Model;
}

export default class OperationsController extends mixin<
    SerializableMixin,
    OptionsToPropertyMixin,
    ObservableMixin
>(SerializableMixin, OptionsToPropertyMixin, ObservableMixin) {
    protected _$selectedKeys: TKey[] = null;
    protected _$excludedKeys: TKey[] = null;
    protected _$root: TKey = null;
    protected _$selectionViewMode: string = '';
    private _listMarkedKey: TKey = null;
    private _savedListMarkedKey: TKey = null;
    private _isOperationsPanelVisible: boolean = false;
    private _selectedTypeRegister: RegisterClass = null;
    private _selectedKeysCount: number = null;
    private _selectedKeysByList: IKeysByList = {};
    private _excludedKeysByList: IKeysByList = {};
    private _selectedKeysCountByList: ISelectedKeysCountByList = {};
    protected _options: IOperationsControllerOptions;
    protected _listActions: IAction[];
    protected _counterResult: ISelectedKeyCountByList;
    protected _operationsPanelOpened: boolean;

    constructor(options: Partial<IOperationsControllerOptions>) {
        super();
        OptionsToPropertyMixin.initMixin(this, options);
        ObservableMixin.initMixin(this);
        this._$selectedKeys = options.selectedKeys?.slice() || [];
        this._$excludedKeys = options.excludedKeys?.slice() || [];
        this._$root = OperationsController._getRoot(options);
        this._options = options;
    }

    destroy(): void {
        if (this._selectedTypeRegister) {
            this._selectedTypeRegister.destroy();
            this._selectedTypeRegister = null;
        }
        this._options = {} as null;
    }

    update(options: IOperationsControllerOptions): void {
        const selectedKeysChanged = !isEqual(options.selectedKeys, this._options.selectedKeys);
        const excludedKeysChanged = !isEqual(options.excludedKeys, this._options.excludedKeys);
        if (selectedKeysChanged || excludedKeysChanged) {
            this._$selectedKeys = options.selectedKeys;
            this._$excludedKeys = options.excludedKeys;
            this._notify('selectionChanged', {
                selected: this._$selectedKeys,
                excluded: this._$excludedKeys,
            });
        }
        this._$root = OperationsController._getRoot(options);
        this._$selectionViewMode = options.selectionViewMode;
        this._options = options;
    }

    setListMarkedKey(key: TKey): TKey {
        return this._setListMarkedKey(key);
    }

    getListMarkedKey(key: TKey): TKey {
        return this._listMarkedKey;
    }

    getSelection(): ISelectionObject {
        return {
            selected: this._$selectedKeys,
            excluded: this._$excludedKeys,
        };
    }

    handleActionClick(clickEvent: SyntheticEvent, item: Model): void {
        this._notify('actionClick', item, clickEvent);
    }

    setOperationsPanelVisible(visible: boolean): TKey {
        let markedKey;
        if (visible !== this._isOperationsPanelVisible) {
            this._isOperationsPanelVisible = visible;
            this._notify('operationsPanelVisibleChanged', this._isOperationsPanelVisible);
        }

        if (visible && this._savedListMarkedKey !== null) {
            markedKey = this.setListMarkedKey(this._savedListMarkedKey);
        } else {
            markedKey = this.setListMarkedKey(this._listMarkedKey);
        }
        return markedKey;
    }

    registerHandler(
        event: SyntheticEvent,
        registerType: string,
        component: Control,
        callback: Function,
        config: object
    ): void {
        this._getRegister().register(event, registerType, component, callback, config);
    }

    unregisterHandler(
        event: SyntheticEvent,
        registerType: string,
        component: Control,
        callback: Function,
        config: object
    ): void {
        this._getRegister().unregister(event, registerType, component, config);
    }

    selectionTypeChanged(type: string, limit: number, id: string): void {
        if (type === 'all' || type === 'selected') {
            this._notify('selectionViewModeChanged', type, id);
        } else {
            this._getRegister().start(type, limit);
        }
    }

    itemOpenHandler(newCurrentRoot: TKey): void {
        if (newCurrentRoot !== this._$root && this._$selectionViewMode === 'selected') {
            this._notify('selectionViewModeChanged', 'all');
        }
    }

    updateSelectedKeys(values: TKey[], added: TKey[], deleted: TKey[], listId: string): TKey[] {
        this._selectedKeysByList[listId] = values.slice();
        let result = this._updateListKeys(this._$selectedKeys, added, deleted);
        if (added.length && added[0] === null) {
            result = [null];
        }
        this._$selectedKeys = result;
        return result;
    }

    setListActions(actions: IAction[]): void {
        this._listActions = actions;
        this._notify('listActionsChanged', actions);
    }

    setSelectedKeysCount(count: number): void {
        this._selectedKeysCount = count;
        this._notify('selectedKeysCountChanged', count);
    }

    setSelectedKeys(keys: TKey[]): void {
        this._$selectedKeys = keys;
        this._notify('selectionChanged', {
            selected: this._$selectedKeys,
            excluded: this._$excludedKeys,
        });
    }

    setExcludedKeys(keys: TKey[]): void {
        this._$excludedKeys = keys;
        this._notify('selectionChanged', {
            selected: this._$selectedKeys,
            excluded: this._$excludedKeys,
        });
    }

    getListActions(): IAction[] {
        return this._listActions;
    }

    openOperationsPanel(): void {
        if (!this._operationsPanelOpened) {
            this._operationsPanelOpened = true;
            this._notify('operationsPanelOpened');
        }
    }

    closeOperationsPanel(): void {
        if (this._operationsPanelOpened) {
            this._operationsPanelOpened = false;
            this._notify('operationsPanelClose');
        }
    }

    getSelectedKeysCount(): number {
        return this._selectedKeysCount;
    }

    getOperationsPanelVisible(): boolean {
        return this._isOperationsPanelVisible;
    }

    updateExcludedKeys(values: TKey[], added: TKey[], deleted: TKey[], listId: string): TKey[] {
        this._excludedKeysByList[listId] = values.slice();
        let result = this._updateListKeys(this._$excludedKeys, added, deleted);
        if (deleted.length && deleted[0] === null) {
            result = [];
        }
        this._$excludedKeys = result;
        return result;
    }

    updateSelectedKeysCount(
        count: number,
        allSelected: boolean,
        listId: string
    ): {
        count: number;
        isAllSelected: boolean;
    } {
        this._selectedKeysCountByList[listId] = { count, allSelected };

        let isAllSelected = true;
        let selectedCount = 0;
        for (const index in this._selectedKeysCountByList) {
            if (this._selectedKeysCountByList.hasOwnProperty(index)) {
                const item = this._selectedKeysCountByList[index];
                if (!item.allSelected) {
                    isAllSelected = false;
                }
                if (typeof item.count === 'number' && selectedCount !== null) {
                    selectedCount += item.count;
                } else {
                    selectedCount = null;
                }
            }
        }
        this._counterResult = {
            count: selectedCount,
            isAllSelected,
        };
        this._notify('counterChanged', this._counterResult);
        return this._counterResult;
    }

    getCounterConfig(): ISelectedKeyCountByList {
        return this._counterResult;
    }

    getSelectedKeysByLists(): IKeysByList {
        return this._selectedKeysByList;
    }

    getExcludedKeysByLists(): IKeysByList {
        return this._excludedKeysByList;
    }

    private _updateListKeys(listKeys: TKey[], added: TKey[], deleted: TKey[]): TKey[] {
        const result = listKeys.slice();

        if (added.length) {
            this._updateKeys(result, added, true);
        }
        if (deleted.length) {
            this._updateKeys(result, deleted, false);
        }
        return result;
    }

    private _updateKeys(listForUpdate: TKey[], changedIds: TKey[], insert: boolean): void {
        changedIds.forEach((key) => {
            const index = listForUpdate.indexOf(key);
            if (index === -1 && insert) {
                listForUpdate.push(key);
            } else if (index !== -1 && !insert) {
                listForUpdate.splice(index, 1);
            }
        });
    }

    private _getRegister(): RegisterClass {
        if (!this._selectedTypeRegister) {
            this._selectedTypeRegister = new RegisterClass({
                register: 'selectedTypeChanged',
            });
        }
        return this._selectedTypeRegister;
    }

    private _setListMarkedKey(key: TKey): TKey {
        if (this._isOperationsPanelVisible) {
            this._listMarkedKey = key;
            this._savedListMarkedKey = null;
        } else {
            this._savedListMarkedKey = key;
        }

        return this._listMarkedKey;
    }

    private static _getRoot(options: Partial<IOperationsControllerOptions>): TKey {
        return 'root' in options ? options.root : null;
    }
}

Object.assign(OperationsController.prototype, {
    _moduleName: 'Controls/operations:ControllerClass',
});
