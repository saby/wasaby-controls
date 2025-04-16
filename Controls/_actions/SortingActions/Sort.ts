/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import rk = require('i18n!Controls');
import BaseAction from 'Controls/_actions/BaseAction';
import { IActionExecuteParams } from 'Controls/_actions/interface/IAction';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { object } from 'Types/util';
import { TKey, TSortingValue } from 'Controls/interface';
import type { ListSlice } from 'Controls/dataFactory';
import { isEqual } from 'Types/object';
import type { IMenuControlOptions } from 'Controls/menu';
import { ISortActionOptions, ISortingItem } from './interface/ISortingOptions';

/*
 * https://online.sbis.ru/opendoc.html?guid=34ed6526-9254-4f6f-a0ac-c43a001454a4&client=3
 * Шрифты для иконок сортировки добавляются на предзагрузке (см. saby-page, Page/_base/applicationHelpers.ts).
 * Но до момента отображения иконки нужно загрузить ещё и её CSS,
 * Иначе иконка мигает при обновлении страницы после сброса кеша.
 */
import 'css!Controls-icons/sort_s';
import 'css!Controls-icons/sort_m';
import 'css!Controls-icons/sort_sizes';

export interface ISourceSortingItem extends ISortingItem {
    template: string;
    parent: string;
}

/**
 * Действие 'Сортировка'
 * @extends Controls/_actions/BaseAction
 * @implements Controls/actions:ISortActionOptions
 * @demo Controls-ListEnv-demo/WI/Sort/Index
 * @public
 */
export default class Sort extends BaseAction<ISortActionOptions> {
    protected _items: RecordSet<ISourceSortingItem>;
    protected _order: TSortingValue = 'DESC';
    protected _currentIcon: string = '';
    protected _value: Record<string, TSortingValue>;
    protected _selectedKey: string;

    constructor(options: ISortActionOptions) {
        super(options);
        this._orderChanged = this._orderChanged.bind(this);
        this._validateOptions(options);
        let value;
        if (options.storeId) {
            const slice = options.context[options.storeId] as ListSlice;
            value = slice.state.sorting?.[0];
        } else if (options.prefetchResult) {
            // ? предустановленный сортинг
            value = options.prefetchResult[0];
        }

        if (value) {
            this._selectedKey = Object.keys(value)[0];
        }

        this._setItems(options.items, value);
    }

    private _orderChanged(e: unknown, item: Model<ISourceSortingItem>): void {
        this._changeSorting(item);
    }

    private _changeSorting(item: Model<ISourceSortingItem>): void {
        let sortingValue = null;

        if (item.getKey() !== null) {
            sortingValue = { [item.getKey()]: item.get('value') };
        }

        let sourceController;
        const sortItem = this._items.getRecordById(
            sortingValue ? Object.keys(sortingValue)[0] : null
        );
        const selectedItemChanged = sortItem?.getKey() !== this._selectedKey;
        const orderChanged = this._order !== sortItem?.get('value');

        if (selectedItemChanged || orderChanged) {
            this._setState(sortItem);
            const newSorting = sortingValue ? [sortingValue] : [];
            if (this._options.storeId) {
                const slice = this._options.context[this._options.storeId] as ListSlice;
                if (slice['[ICompatibleSlice]']) {
                    sourceController = slice.state.sourceController;
                } else {
                    slice.setState({
                        sorting: newSorting,
                    });
                    return;
                }
            } else {
                sourceController = this._options.sourceController;
            }
            sourceController.setSorting(newSorting);
            sourceController.reload();
        }
    }

    private _toggleCollectionChangeHandle(): void {
        this._items?.unsubscribe('onCollectionItemChange', this._orderChanged);
        this._items?.subscribe('onCollectionItemChange', this._orderChanged);
    }

    protected _validateOptions(options: ISortActionOptions): void {
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

    canExecute(item: Model<ISourceSortingItem>): boolean {
        return item.getKey() !== this.id;
    }

    execute(options: ISortActionOptions & IActionExecuteParams): void {
        const item = options.toolbarItem;
        const currentOrder = item.get('value');
        const shouldChangeOrder =
            this._selectedKey === item.getKey() && this._items.getCount() === 1 && currentOrder;
        if (shouldChangeOrder) {
            const oppositeOrder = currentOrder === 'ASC' ? 'DESC' : 'ASC';
            item.set('value', oppositeOrder);
        }
        this._changeSorting(item);
    }

    getChildren(root: string): Promise<RecordSet> {
        Sort._addField('parent', 'string', this._items, root);
        this._toggleCollectionChangeHandle();

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

    updateContext(newContext: ISortActionOptions['context']) {
        if (this._options.storeId) {
            const slice = newContext[this._options.storeId] as ListSlice;
            const currentSorting = slice.state.sorting[0];
            if (
                currentSorting &&
                !slice['[ICompatibleSlice]'] &&
                !isEqual(this._value, currentSorting)
            ) {
                const sortItem = this._items.getRecordById(Object.keys(currentSorting)[0]);
                if (sortItem) {
                    this._setState(sortItem);
                }
            }
        }
    }

    private _getIcon(key?: TKey): string {
        const item = this._items.getRecordById(key);
        if (item?.get('paramName') === null) {
            return 'FONT:Controls-icons/sort:icon-NonSort';
        } else if (this._currentIcon) {
            return this._currentIcon + (key !== null ? '_' + this._order : '');
        } else {
            if (this._order) {
                return 'Controls-icons/sort:icon-Arrow_' + this._order;
            }
        }
    }

    protected _setItems(items: ISortingItem[], value?: Record<string, TSortingValue>): void {
        const sortItems = object.clone(items);
        const itemsChanged = !!this._items;
        const valueChanged = this._value !== undefined && value && !isEqual(this._value, value);

        sortItems.forEach((item) => {
            item.id = item.id ?? item.paramName;
            item.icon = !item.icon?.includes('Controls-icons/sort')
                ? item.icon
                : `FONT:${item.icon}`;
        });

        this._items = new RecordSet({
            rawData: sortItems,
            keyProperty: 'id',
        });

        if (itemsChanged) {
            this._toggleCollectionChangeHandle();
        }

        Sort._addField('value', 'string', this._items);
        this._value = value;

        if (value) {
            const paramName = Object.keys(this._value)[0];
            const value = this._value[paramName];
            const item = this._items.getRecordById(paramName);
            item.set('value', value);
            this._setState(item, valueChanged);
        } else {
            const item = this._items.getRecordById(null);
            if (item) {
                this._setState(item, valueChanged);
            }
        }
    }

    private _setState(item: Model<ISourceSortingItem>, isSortingChanged: boolean): void {
        this._selectedKey = item.getKey();
        this._order = item.get('value') || 'ASC';
        this._currentIcon = item.get('icon');
        this.icon = this._getIcon(item.getKey());
        const titleByOrder = this._order === 'DESC' ? item.get('titleDesc') : item.get('titleAsc');
        this.tooltip = titleByOrder || item.get('title');
        if (item.getKey()) {
            this._value = { [item.getKey()]: item.get('value') };
        }

        if (isSortingChanged) {
            this._changeSorting(item);
        }
    }

    private static _addField(name: string, type: string, items: RecordSet, value?: unknown): void {
        if (items.getFormat().getFieldIndex(name) === -1) {
            items.addField({ name, type }, undefined, value);
        }
    }

    getMenuOptions(): Partial<IMenuControlOptions> {
        return {
            itemTemplate: 'Controls/actions:SortingMenuItemTemplate',
            headingCaption: this._options?.headingCaption,
            markerPosition: 'left',
        };
    }
}

Object.assign(Sort.prototype, {
    id: 'sort',
    title: rk('Сортировка'),
    tooltip: rk('Сортировка'),
    iconStyle: 'secondary',
    'parent@': true,
});
/**
 * @name Controls/_actions/SortingActions/Sort#items
 * @cfg {string} Ключ выбранной записи
 */
