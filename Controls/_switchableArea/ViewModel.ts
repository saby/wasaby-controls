/**
 * @kaizen_zone 6b2f7c09-87a5-4183-bd7c-59117d2711bc
 */
import { factory } from 'Types/chain';
import * as cClone from 'Core/core-clone';

export default class ViewModel {
    private _items: object;

    constructor(items, selectedKey, showAllItems: boolean = false) {
        this._updateItems(items, showAllItems);
        this._updateLoadStatus(selectedKey);
        this.updateVisibilityStatus(selectedKey);
    }

    getItems(): object {
        return this._items;
    }

    updateSelectedKey(selectedKey): void {
        this._updateLoadStatus(selectedKey);
    }

    updateItems(items, showAllItems: boolean = false): void {
        this._updateItems(items, showAllItems);
    }

    private _updateLoadStatus(selectedKey): void {
        this._items.find((item) => {
            return selectedKey === item.key;
        }).loaded = true;
    }

    updateVisibilityStatus(selectedKey): void {
        const visibilityItem = this._items.find((item) => {
            return selectedKey === item.key;
        });
        if (visibilityItem) {
            visibilityItem.visibility = true;
        }
    }

    getVisibilityStatus(selectedKey): boolean {
        return !!this._items.find((item) => {
            return selectedKey === item.key;
        })?.visibility;
    }

    private _updateItems(items, showAllItems): void {
        const loadedItems = [];

        // TODO https://online.sbis.ru/opendoc.html?guid=c206e7a9-9d96-4a20-b386-d44d0f8ef4dc.
        // Запоминаем все загруженные вкладки
        if (this._items) {
            factory(this._items).each((item) => {
                if (item.get) {
                    if (item.get('loaded') || item.get('visibility')) {
                        loadedItems.push(item.get('key'));
                    }
                } else {
                    if (item.loaded || item.visibility) {
                        loadedItems.push(item.key);
                    }
                }
            });
        }

        this._items = cClone(items);

        // TODO https://online.sbis.ru/opendoc.html?guid=c206e7a9-9d96-4a20-b386-d44d0f8ef4dc.
        //  Восстанавливаем все загруженные вкладки
        factory(this._items).each((item) => {
            if (item.get) {
                if (loadedItems.indexOf(item.get('key')) > -1 || showAllItems) {
                    item.set('loaded', true);
                    item.set('visibility', true);
                }
            } else {
                if (loadedItems.indexOf(item.key) > -1 || showAllItems) {
                    item.loaded = true;
                    item.visibility = true;
                }
            }
        });
    }
}
