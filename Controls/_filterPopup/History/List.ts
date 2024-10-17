/**
 * @kaizen_zone 7914d1d2-93e3-48b4-b91a-8062f9a41e69
 */
import { Control, TemplateFunction, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_filterPopup/History/List';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import { isEqual } from 'Types/object';
import { factory } from 'Types/chain';
import * as Utils from 'Types/util';
import * as Merge from 'Core/core-merge';
import * as Clone from 'Core/core-clone';
import { IFilterItem, FilterHistory } from 'Controls/filter';
import { IEditDialogResult, IEditDialogOptions } from './_EditDialog';
import { StickyOpener } from 'Controls/popup';
import { Store } from 'Controls/HistoryStore';
import 'css!Controls/filterPopup';

const MAX_NUMBER_ITEMS = 5;
const getPropValue = Utils.object.getPropertyValue.bind(Utils);

interface IHistoryListOptions extends IControlOptions {
    items: RecordSet;
    filterItems: IFilterItem[];
    saveMode: 'pinned' | 'favorite';
    historyId: string;
    orientation: 'vertical' | 'horizontal';
}

interface IHistoryText {
    [key: string]: string;
}

class HistoryList extends Control<IHistoryListOptions> {
    protected _template: TemplateFunction = template;
    protected _items: RecordSet;
    protected _arrowVisible: boolean;
    protected _isMaxHeight: boolean = true;
    protected _itemsText: IHistoryText = null;
    protected _historyCount: number = null;
    protected _swipeItem: Model = null;
    private _editItem: Model = null;
    private _stickyOpener: StickyOpener;
    private _resizeAfterUpdate: boolean = false;

    protected _beforeMount(options: IHistoryListOptions): void {
        if (options.items) {
            this._items = options.items.clone();
        }
        if (options.saveMode === 'favorite') {
            this._historyCount = FilterHistory.MAX_HISTORY_HORIZONTAL_WINDOW;
        } else {
            this._historyCount = FilterHistory.MAX_HISTORY;
        }
        this._itemsText = this._getText(this._items, options.filterItems);
    }

    protected _beforeUpdate(newOptions: IHistoryListOptions): void {
        if (!isEqual(this._options.items, newOptions.items)) {
            this._items = newOptions.items.clone();
            this._itemsText = this._getText(newOptions.items, newOptions.filterItems);
        }
    }

    protected _afterMount(): void {
        this._onResize();
    }

    protected _afterUpdate(): void {
        this._onResize();

        if (this._resizeAfterUpdate) {
            this._notify('controlResize', [], { bubbling: true });
            this._resizeAfterUpdate = false;
        }
    }

    protected _onPinClick(event: Event, item: Model): void {
        Store.togglePin(this._options.historyId, item.getKey());
        this._notify('historyChanged');
    }

    protected _onFavoriteClick(event: Event, item: Model, text: string): void {
        this._editItem = item;
        this._updateFavorite(item, text, event.target);
    }

    protected _editDialogResult(data: IEditDialogResult): void {
        if (data.action === 'save') {
            this._saveFavorite(data.record);
        } else if (data.action === 'delete') {
            this._deleteFavorite();
        }
    }

    protected _itemSwipe(event: SyntheticEvent<'swipe'>, item: Model): void {
        const direction = event.nativeEvent.direction;
        if (direction === 'left') {
            this._swipeItem = item;
        } else if (direction === 'right') {
            this._swipeItem = null;
        }
    }

    protected _clickHandler(event: Event, item: Model): void {
        const history = FilterHistory.getFilterHistoryItemData(item);
        this._notify('applyHistoryFilter', [history]);
    }

    protected _clickSeparatorHandler(): void {
        this._isMaxHeight = !this._isMaxHeight;
        this._resizeAfterUpdate = true;
    }

    private _getText(items: RecordSet, filterItems: IFilterItem[]): IHistoryText {
        const itemsText = {};
        // the resetValue is not stored in history, we take it from the current filter items
        const resetValues = this._mapByField(filterItems, 'resetValue');

        factory(items).each((item, index: number) => {
            let text = '';
            const history = FilterHistory.getFilterHistoryItemData(item);

            if (history) {
                text =
                    history.linkText ||
                    this._getStringHistoryFromItems(history.items || history, resetValues);
            }
            itemsText[index] = text;
        });
        return itemsText;
    }

    private _getItemId(item: Model | IFilterItem): string {
        let id;
        if (item.hasOwnProperty('id')) {
            id = getPropValue(item, 'id');
        } else {
            id = getPropValue(item, 'name');
        }
        return id;
    }

    private _getStringHistoryFromItems(items: RecordSet, resetValues: object): string {
        const textArr = [];
        let value;
        let resetValue;
        let textValue;
        let visibility;
        factory(items).each((elem) => {
            value = getPropValue(elem, 'value');
            resetValue = resetValues[this._getItemId(elem)];
            textValue = getPropValue(elem, 'textValue');
            visibility = getPropValue(elem, 'visibility');

            if (
                !isEqual(value, resetValue) &&
                (visibility === undefined || visibility) &&
                textValue
            ) {
                textArr.push(textValue);
            }
        });
        return textArr.join(', ');
    }

    private _mapByField(items: RecordSet | IFilterItem[], field: string): object {
        const result = {};
        let value;

        factory(items).each((item: Model) => {
            value = getPropValue(item, field);

            if (value !== undefined) {
                result[this._getItemId(item)] = getPropValue(item, field);
            }
        });

        return result;
    }

    private _onResize(): void {
        if (this._options.orientation === 'vertical') {
            const arrowVisibility = this._arrowVisible;
            this._arrowVisible = this._options.items.getCount() > MAX_NUMBER_ITEMS;

            if (arrowVisibility !== this._arrowVisible) {
                this._isMaxHeight = true;
            }
        }
    }

    private _minimizeHistoryItems(items: IFilterItem[]): void {
        factory(items).each((item) => {
            delete item.caption;
        });
    }

    private _getEditDialogOptions(
        item: Model,
        historyId: string,
        savedTextValue: string
    ): IEditDialogOptions {
        const history = FilterHistory.getFilterHistoryItemData(item);
        const captionsObject = this._mapByField(this._options.filterItems, 'caption');
        const historyItems = factory((history.items || history) as IFilterItem[]);
        const filterItems = this._options.filterItems;
        // Для потомков: в старом окне фильтров могли конвертировать структуру.
        // Т.е. в окне фильтров одна структура, а в Browser'e и в истории фильтров другая
        // Поэтому тут надо всегда смотреть не на опцию items (стркутуру фильтров окна), а на историю
        const favoriteDialogItems = historyItems
            .map((historyItem) => {
                const item = factory(filterItems)
                    .value()
                    .find(({ name }) => name === historyItem.name);
                return {
                    ...historyItem,
                    readOnly: item?.readOnly,
                    caption: captionsObject[this._getItemId(historyItem)],
                };
            })
            .value();

        return {
            items: favoriteDialogItems,
            editedTextValue: savedTextValue || '',
            isFavorite: item.get('pinned'),
        };
    }

    private _deleteFavorite(): void {
        Store.delete(this._options.historyId, this._editItem.getKey());
        this._stickyOpener.close();
        this._notify('historyChanged');
    }

    private _saveFavorite(record: Model): void {
        const itemKey = this._editItem.getKey();
        const editItemData = FilterHistory.getFilterHistoryItemData(this._editItem);
        const ObjectData = Merge(Clone(editItemData), record.getRawData(), {
            rec: false,
        });
        this._minimizeHistoryItems(ObjectData.items);
        Store.togglePin(this._options.historyId, itemKey, true);
        Store.update(this._options.historyId, itemKey, ObjectData);
        this._notify('historyChanged');
    }

    private _updateFavorite(item: Model, text: string, target: EventTarget): void {
        const templateOptions = this._getEditDialogOptions(item, this._options.historyId, text);
        const popupOptions = {
            template: 'Controls/_filterPopup/History/_EditDialog',
            opener: this,
            target,
            closeOnOutsideClick: true,
            targetPoint: {
                vertical: 'bottom',
                horizontal: 'left',
            },
            direction: {
                horizontal: 'left',
            },
            eventHandlers: {
                onResult: this._editDialogResult.bind(this),
            },
            templateOptions,
        };
        if (!this._stickyOpener) {
            this._stickyOpener = new StickyOpener();
        }
        this._stickyOpener.open(popupOptions);
    }
}

export default HistoryList;
