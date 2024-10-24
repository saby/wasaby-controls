/**
 * @kaizen_zone 7914d1d2-93e3-48b4-b91a-8062f9a41e69
 */
import { Control, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanelPopup/History/History';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TemplateFunction } from 'UI/Base';
import { IFilterItem, HistoryUtils, FilterHistory } from 'Controls/filter';
import { TPanelOrientation } from 'Controls/filterPanel';
import { IEditDialogOptions, IEditDialogResult } from 'Controls/_filterPanelPopup/_EditDialog';
import { Model } from 'Types/entity';
import chain = require('Types/chain');
import Utils = require('Types/util');
import { StickyOpener } from 'Controls/popup';
import { factory, List, RecordSet } from 'Types/collection';
import { IItemPadding } from 'Controls/interface';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import * as rk from 'i18n!Controls';
import { MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS } from 'Controls/filterPanelExtendedItems';
import { Store } from 'Controls/HistoryStore';
import filterHistoryItems from './History/filterHistoryItems';
import getFilterItemsTextValue from './History/getFilterItemsTextValue';
import 'css!Controls/filterPanelPopup';

export type THistorySaveMode = 'favorite' | 'pinned';

const getPropValue = Utils.object.getPropertyValue.bind(Utils);
const getFilterHistoryItemData = FilterHistory.getFilterHistoryItemData;

interface IHistoryOptions extends IControlOptions {
    source: IFilterItem[];
    historyId: string;
    saveMode: THistorySaveMode;
    historyItems: List<IFilterItem[]>;
    orientation: TPanelOrientation;
}

/**
 * Контрол для работы с историей в окне панели фильтров.
 * @public
 * @extends UI/Base:Control
 * @control
 */
export default class History extends Control<IHistoryOptions> {
    protected _template: TemplateFunction = template;
    protected _loadedItems: RecordSet | List<IFilterItem[]>;
    protected _historyItems: RecordSet | List<IFilterItem[]>;
    protected _expandButtonVisible: boolean;
    protected _historyListExpanded: boolean;
    protected _notifyResizeAfterRender: boolean;
    protected _maxHistoryCount: number = MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS;
    protected _isFavoriteSaveMode: boolean;
    protected _editItem: Model;
    private _stickyOpener: StickyOpener;
    protected _itemActions: IItemAction[] = [];
    protected _itemPadding: IItemPadding = {
        top: 'null',
        bottom: 'null',
        left: 'null',
        right: 'null',
    };

    protected _beforeMount(options: IHistoryOptions): Promise<RecordSet | List<IFilterItem[]>> {
        this._itemActionVisibilityCallback = this._itemActionVisibilityCallback.bind(this);
        this._isFavoriteSaveMode = this._saveModeIsFavorite(options);
        this._itemActions = this._getItemActions(options.orientation);
        this._setMaxHistoryCount(options.isAdaptive);
        return this._processLoadHistoryItems(
            options.historyId,
            options.source,
            options.historyItems
        );
    }

    protected _beforeUpdate(options: IHistoryOptions): void {
        this._isFavoriteSaveMode = this._saveModeIsFavorite(options);
        if (options.historyId !== this._options.historyId) {
            this._processLoadHistoryItems(options.historyId, options.source, options.historyItems);
        }
    }

    protected _afterRender(options: IHistoryOptions): void {
        if (this._notifyResizeAfterRender) {
            this._notify('controlResize', [], { bubbling: true });
            this._notifyResizeAfterRender = false;
        }
    }

    /**
     * Метод получения списка действий над записью для истории.
     * @param orientation
     */
    protected _getItemActions(orientation: TPanelOrientation): IItemAction[] {
        const itemActions: IItemAction[] = [
            {
                id: 'PinOff',
                icon: 'icon-PinOff',
                iconSize: 's',
                iconStyle: 'label',
                tooltip: rk('Открепить'),
                showType: TItemActionShowType.TOOLBAR,
                handler: this._onPinClick.bind(this, null),
            },
            {
                id: 'PinNull',
                icon: 'icon-PinNull',
                iconSize: 's',
                iconStyle: 'label',
                tooltip: rk('Закрепить'),
                showType: TItemActionShowType.TOOLBAR,
                handler: this._onPinClick.bind(this, null),
            },
        ];
        if (orientation === 'horizontal') {
            itemActions.push({
                id: 'PrefetchHistory',
                icon: 'icon-TimeHistory',
                iconSize: 's',
                iconStyle: 'label',
                tooltip: rk('Построить из истории'),
                showType: TItemActionShowType.TOOLBAR,
                handler: this._prefetchHistoryClick.bind(this, null),
            });
        }
        return itemActions;
    }

    protected _itemActionVisibilityCallback(action: IItemAction, item: Model): boolean {
        switch (action.id) {
            case 'PinOff':
                return item.get('pinned');
            case 'PinNull':
                return !item.get('pinned');
            case 'PrefetchHistory':
                return this._options.orientation === 'horizontal';
            default:
                return false;
        }
    }

    protected _handleExpanderClick(): void {
        this._historyListExpanded = !this._historyListExpanded;
        this._setMaxHistoryCount(this._historyListExpanded);
        this._historyItems = this._getHistoryItemsList();
        this._notifyResizeAfterRender = true;
    }

    protected _onPinClick(event: SyntheticEvent, item: Model): void {
        if (this._isFavoriteSaveMode) {
            this._onFavoriteClick(event, item);
        } else {
            Store.togglePin(this._options.historyId, item.getKey());
            this._updateLoadedHistoryItems();
            this._updateHistoryItemsIfIndexChanged(item);
        }
    }

    protected _prefetchHistoryClick(event: SyntheticEvent, item: Model): void {
        this._handleHistoryItemClick(event, item, { isFilterFromHistory: true });
    }

    protected _onFavoriteClick(clickEvent: SyntheticEvent, item: Model): void {
        this._editItem = item;
        this._openEditDialog(item, event.target);
    }

    protected _handleHistoryItemClick(
        event: SyntheticEvent,
        filter: IFilterItem,
        params?: object
    ): void {
        const historyObject = getFilterHistoryItemData(filter);
        this._notify('historyItemClick', [historyObject.items || historyObject, params]);
    }

    /**
     * Метод получения списка истории фильтрации.
     */
    private _getHistoryItemsList(): RecordSet {
        return chain
            .factory(this._loadedItems)
            .filter((item, index) => {
                return index < this._maxHistoryCount;
            })
            .value(factory.recordSet, {
                adapter: this._loadedItems.getAdapter(),
                keyProperty: 'ObjectId',
            });
    }

    private _setMaxHistoryCount(historyListExpanded: boolean): void {
        if (historyListExpanded) {
            this._maxHistoryCount = this._isFavoriteSaveMode
                ? FilterHistory.MAX_HISTORY_HORIZONTAL_WINDOW
                : FilterHistory.MAX_HISTORY;
        } else {
            this._maxHistoryCount = MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS;
        }
    }

    private _processLoadHistoryItems(
        historyId: string,
        source: IFilterItem[],
        historyItems?: List<IFilterItem[]>
    ): Promise<List<IFilterItem[]>> {
        let historyLoadPromise;

        if (historyItems) {
            historyLoadPromise = Promise.resolve((this._loadedItems = historyItems));
        } else {
            historyLoadPromise = this._loadHistoryItems(historyId, source);
        }
        return historyLoadPromise.then(() => {
            this._expandButtonVisible =
                !this._options.isAdaptive &&
                this._loadedItems.getCount() > MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS;
            this._historyItems = this._getHistoryItemsList();
        });
    }

    /**
     * Метод получения элемента истории по идентификатору.
     * @param source
     * @param name
     */
    private _getSourceItemByName(source: IFilterItem[], name: string): IFilterItem {
        return source.find((item) => {
            return item.name === name;
        });
    }

    /**
     * Метод получения текстового значения элемента истории.
     * @param filterItem
     */
    private _getHistoryItemText(filterItem: IFilterItem): string {
        const historyObject = getFilterHistoryItemData(filterItem);
        const historyItems = (historyObject.items || historyObject) as IFilterItem[];

        return (
            historyObject.linkText || getFilterItemsTextValue(historyItems, this._options.source)
        );
    }

    /**
     * Метод загрузки элементов истории.
     * @param historyId
     * @param source
     */
    private _loadHistoryItems(historyId: string, source: IFilterItem[]) {
        if (historyId) {
            const config = {
                historyIds: HistoryUtils.getParamHistoryIds(source),
                historyId,
                recent: true,
                favorite: this._isFavoriteSaveMode,
            };
            return HistoryUtils.loadHistoryItems(config, source).then(
                (items) => {
                    this._loadedItems = filterHistoryItems(source, items, historyId);
                    return this._loadedItems;
                },
                () => {
                    this._loadedItems = new List({ items: [] });
                }
            );
        }
    }

    protected _editDialogResult(data: IEditDialogResult): void {
        if (data.action === 'save') {
            this._saveFavorite(data.record);
        } else if (data.action === 'delete') {
            this._deleteFavorite();
        }
    }

    private _openEditDialog(item: Model, target: EventTarget): void {
        const templateOptions = this._getEditDialogOptions(item);
        const editorTarget = target.closest('.controls-FilterViewPanel__history-editor-template');
        const popupOptions = {
            template: 'Controls/filterPanelPopup:_EditDialog',
            opener: this,
            target: editorTarget,
            closeOnOutsideClick: true,
            className: 'controls-FilterViewPanel-FavoriteEditDialog_popup',
            targetPoint: {
                vertical: 'top',
                horizontal: 'right',
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

    private _getEditDialogOptions(item: Model): IEditDialogOptions {
        const savedTextValue = this._getHistoryItemText(item);
        const history = getFilterHistoryItemData(item);
        let items = (history.items || history) as IFilterItem[];

        items = chain
            .factory(items)
            .map((historyItem) => {
                const sourceItem = this._getSourceItemByName(
                    this._options.source,
                    historyItem.name
                );
                historyItem.caption = getPropValue(sourceItem, 'caption');
                return historyItem;
            })
            .value();

        return {
            items,
            editedTextValue: savedTextValue || '',
            isFavorite: item.get('pinned'),
        };
    }

    /**
     * Метод удаления избранных элементов истории.
     */
    private _deleteFavorite(): void {
        Store.delete(this._options.historyId, this._editItem.getKey());
        this._updateHistoryItems();
        this._stickyOpener.close();
    }

    /**
     * Метод сохранения в избранные элемента истории.
     * @param record
     */
    private _saveFavorite(record: Model): void {
        const itemKey = this._editItem.getKey();
        const editItemData = getFilterHistoryItemData(this._editItem);
        const ObjectData = { ...editItemData, ...record.getRawData() };
        chain.factory(ObjectData.items).each((item) => {
            delete item.caption;
        });
        Store.togglePin(this._options.historyId, itemKey, true);
        Store.update(this._options.historyId, itemKey, ObjectData);
        this._updateHistoryItems();
    }

    /**
     * Метод обновления элементов истории.
     */
    private _updateHistoryItems(): void {
        this._updateLoadedHistoryItems();
        this._historyItems = this._getHistoryItemsList();
    }

    private _updateLoadedHistoryItems(): void {
        this._loadedItems = filterHistoryItems(
            this._options.source,
            FilterHistory.getItemsByHistory(
                this._options.historyId,
                this._options.saveMode === 'favorite'
                    ? FilterHistory.MAX_HISTORY_HORIZONTAL_WINDOW
                    : FilterHistory.MAX_HISTORY
            ),
            this._options.historyId
        );
    }

    private _updateHistoryItemsIfIndexChanged(item: Model): void {
        const keyProperty = this._loadedItems.getKeyProperty();
        const key = item.getKey();
        const newIndex = this._loadedItems.getIndexByValue(keyProperty, key);
        const oldIndex = this._historyItems.getIndexByValue(keyProperty, key);
        if (newIndex === oldIndex) {
            this._historyItems
                .at(newIndex)
                .set('pinned', this._loadedItems.at(newIndex).get('pinned'));
        } else {
            this._historyItems = this._getHistoryItemsList();
        }
    }

    /**
     * Метод определения режима запинивания элементов истории.
     */
    private _saveModeIsFavorite(options: IHistoryOptions): boolean {
        return options.saveMode === 'favorite';
    }

    static defaultProps: Partial<IHistoryOptions> = {
        saveMode: 'pinned',
    };
}
