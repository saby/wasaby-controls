/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { Control, IControlOptions } from 'UI/Base';
import { RecordSet, List } from 'Types/collection';
import {
    default as LookupController,
    ILookupBaseControllerOptions,
    SelectedItems,
} from './BaseControllerClass';
import { SyntheticEvent } from 'Vdom/Vdom';
import { descriptor, Model } from 'Types/entity';
import { IStackPopupOptions } from 'Controls/_popup/interface/IStack';
import { TKey, TSourceOption } from 'Controls/interface';
import { IWorkByKeyboardOptions } from 'Controls/WorkByKeyboard/Context';
// @ts-ignore
import * as isEmpty from 'Core/helpers/Object/isEmpty';
import * as ArrayUtil from 'Controls/Utils/ArraySimpleValuesUtil';
import { getDefaultBorderVisibilityOptions } from 'Controls/input';
import 'css!Controls/lookup';
import 'css!Controls/CommonClasses';
import { ICrud, ICrudPlus, IData, PrefetchProxy } from 'Types/source';
import { isEqual } from 'Types/object';

type LookupReceivedState = SelectedItems | null;

export interface ILookupOptions
    extends ILookupBaseControllerOptions,
        IControlOptions {
    items?: RecordSet;
}

export default abstract class BaseLookup<
    T extends ILookupOptions
> extends Control<T, LookupReceivedState> {
    protected _lookupController: LookupController;
    protected _items: SelectedItems;
    private _source: TSourceOption;
    protected _highlightedOnFocus: boolean;

    constructor(...args) {
        super(...args);
        this._setWorkByKeyboard = this._setWorkByKeyboard.bind(this);
    }

    protected _beforeMount(
        options: ILookupOptions,
        context,
        receivedState: LookupReceivedState
    ): Promise<LookupReceivedState | Error> | void {
        const { items, selectedKeys } = options;
        this._source = BaseLookup._getSource(options, receivedState);
        this._lookupController = new LookupController(
            this._getLookupControllerOptions(options)
        );

        if (receivedState && !isEmpty(receivedState)) {
            options.dataLoadCallback?.(receivedState);
            this._setItems(receivedState);
            this._inheritorBeforeMount(options);
        } else if (items) {
            options.dataLoadCallback?.(items);
            if (selectedKeys?.length) {
                this._setItems(items);
            } else {
                this._items = items;
                this._lookupController.setItemsAndSelectedKeys(items);
            }
            this._inheritorBeforeMount(options);
        } else if (selectedKeys?.length && options.source) {
            const keysForLoad = this._lookupController.getKeysForLoad();
            return this._lookupController
                .loadItems(keysForLoad)
                .then((loadedItems) => {
                    this._setItems(loadedItems as SelectedItems);
                    this._inheritorBeforeMount(options);
                    return loadedItems;
                });
        } else {
            this._items = this._lookupController.getItems();
            this._inheritorBeforeMount(options);
        }
    }

    protected _beforeUpdate(
        newOptions: ILookupOptions
    ): Promise<SelectedItems> | void | boolean {
        const lookupController = this._lookupController;

        if (newOptions.source !== this._options.source) {
            this._source = newOptions.source;
        }
        const updateResult = lookupController.update(
            this._getLookupControllerOptions(newOptions)
        );
        const updateResultCallback = () => {
            this._itemsChanged((this._items = lookupController.getItems()));

            // Защита от зацикливания, если метод не вернул записей
            // или вернул больше/меньше записей, чем запрашивали
            if (
                newOptions.selectedKeys !== undefined &&
                !isEqual(
                    lookupController.getSelectedKeys(),
                    newOptions.selectedKeys
                )
            ) {
                this._notifyChanges(
                    newOptions,
                    lookupController.getSelectedKeys()
                );
            } else {
                this._notifyOnItemsChanged();
            }
        };

        if (updateResult instanceof Promise) {
            updateResult.then((items) => {
                if (newOptions.selectedKeys?.length) {
                    this._setItems(items);
                } else {
                    lookupController.setItemsAndSelectedKeys(items);
                }
                updateResultCallback();
            });
        } else if (updateResult) {
            updateResultCallback();
        }
        this._inheritorBeforeUpdate(newOptions);
        return updateResult;
    }

    protected _afterMount(): void {
        if (
            this._options.items &&
            this._options.hasOwnProperty('selectedKeys')
        ) {
            this._notifyChanges(this._options);
        }
    }

    protected _beforeUnmount(): void {
        this._lookupController.destroy();
    }

    protected _updateItems(items: RecordSet | List<Model>): void {
        this._lookupController.setItemsAndSelectedKeys(items);
        this._afterItemsChanged();
    }

    protected _addItem(item: Model): void {
        if (this._lookupController.addItem(item)) {
            this._afterItemsChanged();
        }
    }

    protected _removeItem(item: Model): void {
        if (this._lookupController.removeItem(item)) {
            this._afterItemsChanged();
        }
    }

    protected _showSelector(
        event: SyntheticEvent,
        popupOptions?: IStackPopupOptions
    ): Promise<void | boolean> {
        return this._loadUnloadedItems().then(() => {
            if (this._notify('showSelector', [event, popupOptions]) !== false) {
                return this.showSelector(popupOptions);
            }
            return false;
        });
    }

    protected _closeHandler(): void {
        this.activate();
    }

    protected _selectCallback(
        event: SyntheticEvent,
        result: SelectedItems | Promise<SelectedItems>
    ): void {
        const selectResult =
            this._notify('selectorCallback', [
                this._lookupController.getItems(),
                result,
            ]) || result;
        const selectCallback = (selectRes) => {
            this._lookupController.setItemsAndSaveToHistory(
                selectRes as SelectedItems
            );
            this._afterItemsChanged();
        };

        if (this._options.value) {
            this._notify('valueChanged', ['']);
        }
        if (selectResult instanceof Promise) {
            selectResult.then((items) => {
                selectCallback(items);
            });
        } else {
            selectCallback(selectResult);
        }
    }

    protected _getSelectedKeys(options: ILookupOptions): TKey[] {
        let selectedKeys;

        if (options.selectedKeys !== undefined) {
            selectedKeys = options.selectedKeys;
        } else {
            selectedKeys = this._lookupController.getSelectedKeys();
        }

        return selectedKeys;
    }

    protected _setWorkByKeyboard(workByKeyboard: IWorkByKeyboardOptions): void {
        this._highlightedOnFocus =
            workByKeyboard?.status && !this._options.readOnly;
    }

    private _afterItemsChanged(options?: ILookupOptions): void {
        this._itemsChanged((this._items = this._lookupController.getItems()));
        this._notifyChanges(options);
    }

    private _setItems(items: SelectedItems): void {
        this._items = items;
        this._lookupController.setItems(items);
    }

    _getSelectedItemsCount({
        lazyItemsLoading,
        selectedKeys,
    }: ILookupOptions): number {
        return lazyItemsLoading
            ? selectedKeys.length
            : this._getLoadedItemsCount();
    }

    _getLoadedItemsCount() {
        return this._items.getCount();
    }

    protected _joinItems(items: SelectedItems): void {
        this._items = this._lookupController.getItems();
        this._items.append(items);
        this._lookupController.setItems(this._items);
    }

    protected async _openInfoBox(): Promise<unknown> {
        const selectedKeys = this._lookupController
            ? this._lookupController.getSelectedKeys()
            : [];
        const loadedKeys = this._lookupController
            ? this._lookupController.getLoadedKeys()
            : [];
        let infoboxOptions;

        if (loadedKeys.length === selectedKeys.length) {
            infoboxOptions = { templateOptions: { items: this._items } };
            this._notify('openInfoBox', [infoboxOptions]);
            return Promise.resolve(infoboxOptions);
        }

        return this._loadUnloadedItems().then(() => {
            infoboxOptions = { templateOptions: { items: this._items } };
            this._notify('openInfoBox', [infoboxOptions]);
            return infoboxOptions;
        });
    }

    private _loadUnloadedItems(): Promise<unknown> {
        const selectedKeys = this._lookupController
            ? this._lookupController.getSelectedKeys()
            : [];
        const loadedKeys = this._lookupController
            ? this._lookupController.getLoadedKeys()
            : [];
        const keysForLoad = selectedKeys.filter((key) => {
            return !loadedKeys.includes(key);
        });

        if (this._options.source && keysForLoad.length) {
            return this._lookupController
                .loadItems(keysForLoad)
                .then((items) => {
                    this._joinItems(items as SelectedItems);
                    this._lookupController.setLoadedKeys([
                        ...loadedKeys,
                        ...keysForLoad,
                    ]);
                });
        } else {
            return Promise.resolve();
        }
    }

    private _getLookupControllerOptions(
        options: ILookupOptions
    ): ILookupBaseControllerOptions {
        return {
            ...options,
            source: this._source,
        };
    }

    protected _notifyChanges(
        options?: ILookupOptions,
        newSelectedKeys: TKey[] = this._lookupController.getSelectedKeys()
    ): void {
        const lookupOptions = options || this._options;
        const { added, removed } = ArrayUtil.getArrayDifference(
            this._getSelectedKeys(lookupOptions),
            newSelectedKeys
        );
        if (
            lookupOptions.selectedKeys === undefined ||
            added?.length ||
            removed?.length
        ) {
            this._notify('selectedKeysChanged', [
                newSelectedKeys,
                added,
                removed,
            ]);
            this._notifyOnItemsChanged();
        }
    }

    protected _notifyOnItemsChanged(): void {
        const controller = this._lookupController;
        this._notify('itemsChanged', [controller.getItems()]);
        this._notify('textValueChanged', [controller.getTextValue()]);
    }

    abstract showSelector(popupOptions?: IStackPopupOptions): void;

    protected abstract _inheritorBeforeMount(options: ILookupOptions): void;

    protected abstract _inheritorBeforeUpdate(options: ILookupOptions): void;

    protected abstract _itemsChanged(items: SelectedItems): void;

    private static _getSource(
        options: ILookupOptions,
        receivedState?: LookupReceivedState
    ): ICrudPlus | (ICrud & ICrudPlus & IData) {
        let source;

        if (options.source instanceof PrefetchProxy && receivedState) {
            source = options.source.getOriginal();
        } else {
            source = options.source;
        }

        return source;
    }

    static getDefaultOptions(): object {
        return {
            ...getDefaultBorderVisibilityOptions(),
            multiSelect: false,
            contrastBackground: false,
            lazyItemsLoading: false,
        };
    }

    static getOptionTypes(): object {
        return {
            multiSelect: descriptor(Boolean),
            selectedKeys: descriptor(Array),
        };
    }
}
