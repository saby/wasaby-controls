/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import rk = require('i18n!Controls');
import BaseAction from 'Controls/_actions/BaseAction';
import { IActionOptions } from 'Controls/_actions/interface/IActionOptions';
import { IActionExecuteParams } from 'Controls/_actions/interface/IAction';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { ILoadDataResult } from 'Controls/dataSource';
import { object } from 'Types/util';
import { TKey, TSortingValue } from 'Controls/interface';
import { ListSlice } from 'Controls/dataFactory';

interface ISortingItem {
    id: string;
    title: string;
    value?: TSortingValue;
    icon?: string;
}

interface ISortAction extends IActionOptions {
    items: [ISortingItem];
    prefetchResult: ILoadDataResult;
    storeId: number | string;
}

interface IExecuteSortingParams extends IActionExecuteParams {
    toolbarItem: Model;
}

/**
 * Действие "Сортировка"
 * @extends Controls/_actions/BaseAction
 * @public
 */
export default class Sort<
    T extends ISortAction = ISortAction,
    V = IExecuteSortingParams
> extends BaseAction<T, V> {
    protected _items: RecordSet;
    protected _order: TSortingValue = 'DESC';
    protected _currentIcon: string = '';
    protected _value: [object];
    protected _selectedKey: string;

    constructor(options: ISortAction) {
        super(options);
        this._orderChanged = this._orderChanged.bind(this);
        this._validateOptions(options);
        if (options.storeId) {
            const slice = options.context[options.storeId] as ListSlice;
            this._value = slice.state.sorting[0];
            this._selectedKey = Object.keys(this._value)[0];
        } else if (options.prefetchResult) {
            // ? предустановленный сортинг
            this._value = options.prefetchResult[0];
            this._selectedKey = Object.keys(this._value)[0];
        }
        this._setItems(options.items);
    }

    private _orderChanged(e: unknown, item: Model): void {
        this.execute({
            toolbarItem: item,
        });
    }

    private _changeSorting(sorting: TSortingValue): void {
        let sourceController;
        if (this._options.storeId) {
            const slice = this._options.context[this._options.storeId] as ListSlice;
            if (slice['[ICompatibleSlice]']) {
                sourceController = slice.state.sourceController;
            } else {
                slice.setState({
                    sorting: [sorting],
                });
                return;
            }
        } else {
            sourceController = this._options.sourceController;
        }
        sourceController.setSorting([sorting]);
        sourceController.reload();
    }

    protected _validateOptions(options: ISortAction): void {
        if (options.storeId) {
            const slice = options.context[options.storeId] as ListSlice;
            if (!slice) {
                throw new Error(`SortingAction::Указан неверный storeId ${options.storeId}`);
            } else if (!slice['[IListSlice]']) {
                throw new Error(
                    `SortingAction::Слайс ${options.storeId} должен быть наследником cлайса списка`
                );
            }
        }
    }

    execute(options: V): void {
        const item = options.toolbarItem;

        if (item.get('parent') !== null) {
            this._selectedKey = item.getKey();
            this._setState(item);
            this._changeSorting({ [this._selectedKey]: this._order });
        }
    }

    getChildren(root: string): Promise<RecordSet> {
        Sort._addField('parent', 'string', this._items, root);
        this._items.unsubscribe('onCollectionItemChange', this._orderChanged);
        this._items.subscribe('onCollectionItemChange', this._orderChanged);

        return Promise.resolve(this._items);
    }

    getValue(): TKey[] {
        if (this._selectedKey !== undefined) {
            return [this._selectedKey];
        }
        return [];
    }

    destroy(): void {
        this._items?.unsubscribe('onCollectionItemChange', this._orderChanged);
        this._orderChanged = null;
    }

    private _getIcon(key?: TKey): string {
        if (this._currentIcon) {
            return this._currentIcon + (key !== null ? '_' + this._order : '');
        } else {
            if (this._order) {
                return 'Controls/sortIcons:arrow_' + this._order;
            }
        }
    }

    private _setItems(items: ISortingItem[]): void {
        const sortItems = object.clone(items);
        if (sortItems[0] && sortItems[0].id === undefined) {
            sortItems.forEach((item) => {
                item.id = item.paramName;
            });
        }

        this._items = new RecordSet({
            rawData: sortItems,
            keyProperty: 'id',
        });
        Sort._addField(
            'template',
            'string',
            this._items,
            'Controls/actions:SortingMenuItemTemplate'
        );
        Sort._addField('value', 'string', this._items);

        if (this._value) {
            const paramName = Object.keys(this._value)[0];
            const value = this._value[paramName];
            const item = this._items.getRecordById(paramName);
            item.set('value', value);
            this._setState(item);
        } else {
            const item = this._items.getRecordById(null);
            if (item) {
                this._setState(item);
            }
        }
    }

    private _setState(item: Model): void {
        this._order = item.get('value') || 'ASC';
        this._currentIcon = item.get('icon');
        this.icon = this._getIcon(item.getKey());
        this.tooltip = item.get('title');
    }

    private static _addField(name: string, type: string, items: RecordSet, value?: unknown): void {
        if (items.getFormat().getFieldIndex(name) === -1) {
            items.addField({ name, type }, undefined, value);
        }
    }
}

Object.assign(Sort.prototype, {
    id: 'sort',
    title: rk('Сортировка'),
    tooltip: rk('Сортировка'),
    icon: 'icon-TFDownload',
    iconStyle: 'secondary',
    'parent@': true,
});
