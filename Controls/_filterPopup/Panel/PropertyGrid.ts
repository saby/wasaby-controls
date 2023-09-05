/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_filterPopup/Panel/PropertyGrid/PropertyGrid');
import * as Clone from 'Core/core-clone';
import { object } from 'Types/util';
import { factory } from 'Types/chain';
import { isEqual } from 'Types/object';
import { IFilterItem, isEqualItems } from 'Controls/filter';
import 'css!Controls/filterPopup';

const observableItemProps = ['value', 'textValue', 'visibility'];

interface IFilterPropertyGridOptions extends IControlOptions {
    items: IFilterItem[];
}

/**
 * Control PropertyGrid
 * Provides a user interface for browsing and editing the properties of an object.
 *
 * @extends UI/Base:Control
 * @implements Controls/interface/IPropertyGrid
 * @implements Controls/interface:ISource
 * @implements Controls/interface/IItemTemplate
 *
 * @private
 */
class PropertyGrid extends Control<IFilterPropertyGridOptions> {
    protected _template: TemplateFunction = template;
    protected _items: IFilterItem[];
    protected _lastVisibleIndex: number;
    protected _changedIndex: number;

    protected _beforeMount(options: IFilterPropertyGridOptions): void {
        this._items = this._getItemsWithSort(this._cloneItems(options.items));
        this._lastVisibleIndex = this._getLastVisibleItemIndex(this._items);
    }

    protected _afterMount(): void {
        this._observeItems(this._items);
    }

    protected _beforeUpdate(newOptions: IFilterPropertyGridOptions): void {
        if (!isEqual(newOptions.items, this._options.items)) {
            this._changedIndex = this._getIndexChangedVisibility(newOptions.items, this._items);

            // После выбора контрол из "Можно отобрать" будет удален,
            // система фокусов попытается восстановить потерянный фокус на extendedItems.
            // Во время перестроения часть панели может быть за пределами экрана, и фокусировка вызовет подскрол страницы.
            // Для того чтобы избежать потери фокуса зовем activate
            if (this._changedIndex !== -1) {
                this.activate();
            }
            this._setItems(this._cloneItems(newOptions.items));
        } else {
            this._changedIndex = -1;
        }
        this._lastVisibleIndex = this._getLastVisibleItemIndex(this._items);
    }

    protected _afterUpdate(): void {
        // Когда элемент перемещается из блока "Можно отобрать" в основной блок,
        // запоминаем индекс этого элемента в _changedIndex.
        // Когда основной блок перестроился, зовем activate, чтобы сфокусировать этот элемент.
        if (this._changedIndex !== -1) {
            this.activate();
            this._notify('controlResize', [], { bubbling: true });
        }
    }

    protected _isItemVisible(item: IFilterItem): boolean {
        return (
            object.getPropertyValue(item, 'visibility') === undefined ||
            object.getPropertyValue(item, 'visibility')
        );
    }

    protected _updateItem(index: number, field: string, value: unknown): void {
        const items = this._cloneItems(this._items);

        items[index][field] = value;
        this._setItems(items);
        this._itemsChanged();
    }

    protected _valueChangedHandler(event: Event, index: number, value: unknown): void {
        this._updateItem(index, 'value', value);
    }

    protected _rangeChangedHandler(event: Event, index: number, start: Date, end: Date): void {
        this._updateItem(index, 'value', [start, end]);
    }

    protected _textValueChangedHandler(event: Event, index: number, textValue: string): void {
        this._updateItem(index, 'textValue', textValue);
    }

    protected _visibilityChangedHandler(event: Event, index: number, visibility: boolean): void {
        if (!visibility) {
            this._items[index].value = this._items[index].resetValue;
        }
        this._updateItem(index, 'visibility', visibility);
    }

    private _cloneItems(items: IFilterItem[]): IFilterItem[] {
        if (items['[Types/_entity/CloneableMixin]']) {
            return items.clone();
        }
        return Clone(items);
    }

    private _getIndexChangedVisibility(newItems: IFilterItem[], oldItems: IFilterItem[]): number {
        let result = -1;
        factory(newItems).each((newItem, index: number) => {
            // The items could change the order or quantity, so we find the same element by id
            const visibility = object.getPropertyValue(newItem, 'visibility');

            if (visibility) {
                factory(oldItems).each((oldItem) => {
                    if (
                        isEqualItems(newItem, oldItem) &&
                        visibility !== object.getPropertyValue(oldItem, 'visibility')
                    ) {
                        result = index;
                    }
                });
            }
        });
        return result;
    }

    // Necessary for correct work of updating control, after update object in array.
    // Binding on object property in array does not update control, if this property is not versioned.
    private _observeProp(propName: string, obj: IFilterItem): void {
        let value = obj[propName];

        Object.defineProperty(obj, propName, {
            set: (newValue: unknown): void => {
                value = newValue;
                this._itemsChanged();
            },

            get(): unknown {
                return value;
            },
            // inputs notify valueChanged on afterMount, before "afterMount" hook of PG.
            // Therefore observeItems will be called again.
            configurable: true,
        });
    }

    private _observeItems(items: IFilterItem[]): void {
        factory(items).each((item) => {
            observableItemProps.forEach((propName) => {
                this._observeProp(propName, item);
            });
        });
    }

    private _setItems(items: IFilterItem[]): void {
        this._items = this._getItemsWithSort(items);
        this._observeItems(this._items);
    }

    private _getItemsWithSort(items: IFilterItem[]): IFilterItem[] {
        return items.sort((item1, item2) => {
            const isBasicViewMode1 = object.getPropertyValue(item1, 'viewMode') === 'basic';
            const hasExtCaption1 = object.getPropertyValue(item1, 'editorOptions')?.extendedCaption;
            const isBasicViewMode2 = object.getPropertyValue(item2, 'viewMode') === 'basic';
            const hasExtCaption2 = object.getPropertyValue(item2, 'editorOptions')?.extendedCaption;
            const isExtended1 = object.getPropertyValue(item1, 'visibility') !== undefined &&
                (!isBasicViewMode1 || hasExtCaption1);
            const isExtended2 = object.getPropertyValue(item2, 'visibility') !== undefined &&
                (!isBasicViewMode2 || hasExtCaption2);
            if (isExtended1 !== isExtended2) {
                return isExtended2 ? -1 : 1;
            }
            return 0;
        });
    }

    private _itemsChanged(): void {
        this._notify('itemsChanged', [this._items]);
    }

    private _getLastVisibleItemIndex(items: IFilterItem[]): number {
        let lastIndex = 0;
        items.forEach((item, i) => {
            if (
                object.getPropertyValue(item, 'visibility') === undefined ||
                object.getPropertyValue(item, 'visibility')
            ) {
                lastIndex = i;
            }
        });
        return lastIndex;
    }
}

export default PropertyGrid;
