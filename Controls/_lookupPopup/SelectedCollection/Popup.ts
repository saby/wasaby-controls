/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import template = require('wml!Controls/_lookupPopup/SelectedCollection/Popup');
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import 'css!Controls/lookup';

/**
 *
 * Показывает коллекцию элементов в две колонки в всплывающем окне.
 * Используется в Controls/lookup:Input, Controls/lookup:Button
 *
 * @class Controls/_lookupPopup/SelectedCollection/Popup
 * @extends UI/Base:Control
 * @mixes Controls/_lookup/SelectedCollection/SelectedCollectionStyles
 *
 * @public
 */

interface ISelectedCollectionPopupOptions extends IControlOptions {
    items: RecordSet;
    clickCallback: (eventName: 'itemClick' | 'crossClick', item: Model) => void;
}

export default class SelectedCollectionPopup extends Control<ISelectedCollectionPopupOptions> {
    protected _template: TemplateFunction = template;
    protected _width: number;
    private _items: RecordSet;
    private _maxItemsCountForOneColumn: number = 7;

    protected _beforeMount(options: ISelectedCollectionPopupOptions): void {
        // Clone in order to delete items from the list when clicking on the cross.
        this._items = options.items.clone();
    }

    protected _afterMount(): void {
        // Фиксируем ширину после открытия, чтобы окно не прыгало, когда меняется набор записей
        this._width = this._container.getBoundingClientRect().width;
    }

    protected _afterUpdate(): void {
        if (!this._width) {
            this._width = this._container.getBoundingClientRect().width;
        }
    }

    protected _itemClick(event: SyntheticEvent, item: Model): void {
        this._options.clickCallback('itemClick', item);
        this._notify('close', [], { bubbling: true });
    }

    protected _crossClick(event: SyntheticEvent, item: Model): void {
        this._items.remove(item);
        this._options.clickCallback('crossClick', item);
        const layoutModeChanged =
            this._items.getCount() === this._maxItemsCountForOneColumn;
        if (layoutModeChanged) {
            this._width = null;
        }
    }
}
