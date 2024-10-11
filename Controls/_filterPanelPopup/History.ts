/**
 * @kaizen_zone 7914d1d2-93e3-48b4-b91a-8062f9a41e69
 */
import { Control, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanelPopup/History/History';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TemplateFunction } from 'UI/Base';
import { IFilterItem, HistoryUtils, FilterHistory } from 'Controls/filter';
import { IEditDialogOptions, IEditDialogResult } from 'Controls/_filterPanelPopup/_EditDialog';
import { Serializer } from 'UICommon/State';
import { Model } from 'Types/entity';
import chain = require('Types/chain');
import Utils = require('Types/util');
import { StickyOpener } from 'Controls/popup';
import { factory, List, RecordSet } from 'Types/collection';
import { isEqual } from 'Types/object';
import { IItemPadding } from 'Controls/interface';
import { IItemAction, TItemActionShowType } from 'Controls/itemActions';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import * as rk from 'i18n!Controls';
import { FilterHistory } from 'Controls/filter';
import { MAX_COLLAPSED_COUNT_OF_VISIBLE_ITEMS } from 'Controls/filterPanelExtendedItems';
import { Store } from 'Controls/HistoryStore';
import 'css!Controls/filterPanelPopup';

export type THistorySaveMode = 'favorite' | 'pinned';

const getPropValue = Utils.object.getPropertyValue.bind(Utils);

interface IHistoryOptions extends IControlOptions {
    source: IFilterItem[];
    historyId: string;
    saveMode: THistorySaveMode;
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
        this._itemActions = this._getItemActions(this._isFavoriteSaveMode);
        this._setMaxHistoryCount(options.isAdaptive);
        return this._processLoadHistoryItems(options.historyId, options.source);
    }

    protected _beforeUpdate(options: IHistoryOptions): void {
        this._isFavoriteSaveMode = this._saveModeIsFavorite(options);
        if (options.historyId !== this._options.historyId) {
            this._processLoadHistoryItems(options.historyId, options.source);
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
     * @param isFavoriteSaveMode
     */
    protected _getItemActions(isFavoriteSaveMode: boolean): IItemAction[] {
        if (isFavoriteSaveMode) {
            return [
                {
                    id: 'Favorite',
                    icon: 'icon-Favorite',
                    iconSize: 's',
                    iconStyle: 'label',
                    tooltip: rk('Убрать из избранного'),
                    showType: TItemActionShowType.TOOLBAR,
                    handler: this._onFavoriteClick.bind(this, null),
                },
                {
                    id: 'Unfavorite',
                    icon: 'icon-Unfavorite',
                    iconSize: 's',
                    iconStyle: 'label',
                    tooltip: rk('Добавить в избранное'),
                    showType: TItemActionShowType.TOOLBAR,
                    handler: this._onFavoriteClick.bind(this, null),
                },
            ];
        }
        return [
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
    }

    protected _itemActionVisibilityCallback(action: IItemAction, item: Model): boolean {
        if (item.get('pinned')) {
            return this._isFavoriteSaveMode ? action.id === 'Favorite' : action.id === 'PinOff';
        }
        return this._isFavoriteSaveMode ? action.id === 'Unfavorite' : action.id === 'PinNull';
    }

    protected _handleExpanderClick(): void {
        this._historyListExpanded = !this._historyListExpanded;
        this._setMaxHistoryCount(this._historyListExpanded);
        this._historyItems = this._getHistoryItemsList();
        this._notifyResizeAfterRender = true;
    }

    protected _onPinClick(event: SyntheticEvent, item: Model): void {
        Store.togglePin(this._options.historyId, item.getKey());
        this._updateLoadedHistoryItems();
        this._updateHistoryItemsIfIndexChanged(item);
    }

    protected _onFavoriteClick(clickEvent: SyntheticEvent, item: Model): void {
        this._editItem = item;
        this._openEditDialog(item, event.target);
    }

    protected _handleHistoryItemClick(event: SyntheticEvent, filter: IFilterItem): void {
        const historyObject = this._getHistoryObject(filter);
        this._notify('historyItemClick', [historyObject.items || historyObject]);
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
        source: IFilterItem[]
    ): Promise<List<IFilterItem[]>> {
        return this._loadHistoryItems(historyId, source).then(() => {
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
     * Метод получения объекта элемента истории.
     * @param filterItem
     */
    private _getHistoryObject(filterItem: IFilterItem): object {
        return FilterHistory.getFilterHistoryItemData(filterItem);
    }

    /**
     * Метод получения текстового значения элемента истории.
     * @param filterItem
     */
    private _getHistoryItemText(filterItem: IFilterItem): string {
        const historyObject = this._getHistoryObject(filterItem);
        const historyItems = (historyObject.items || historyObject) as IFilterItem[];

        if (historyObject.linkText) {
            return historyObject.linkText as string;
        } else {
            return this._getFilterItemsTextValue(historyItems);
        }
    }

    private _getFilterItemsTextValue(items: IFilterItem[]): string {
        const textArr = [];

        items.forEach((elem) => {
            const sourceItem = this._getSourceItemByName(this._options.source, elem.name);
            const value = elem.value;
            let textValue = elem.textValue;

            if (!isEqual(value, sourceItem.resetValue) && textValue) {
                if (
                    sourceItem.editorTemplateName === 'Controls/filterPanelEditors:DateMenu' &&
                    !sourceItem.editorOptions?.dateMenuItems &&
                    !sourceItem.editorOptions?.items
                ) {
                    const getTextValue = loadSync(
                        'Controls/filterPanelEditors:GetDateMenuTextValue'
                    );
                    textValue =
                        getTextValue(sourceItem.editorOptions, null, elem.value) || elem.textValue;
                }

                if (sourceItem.historyCaption) {
                    textValue = `${sourceItem.historyCaption}: ${textValue}`;
                }
                textArr.push(textValue);
            }
        });

        return textArr.join(', ');
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
                    this._loadedItems = this._filterHistoryItems(items, source);
                    return this._loadedItems;
                },
                () => {
                    this._loadedItems = new List({ items: [] });
                }
            );
        }
    }

    /**
     * Метод фильтрации элементов истории.
     * @param items
     * @param source
     */
    private _filterHistoryItems(items: RecordSet, source: IFilterItem[]): RecordSet {
        let result;
        if (items) {
            const filteredItems = this._removeOutdatedFilters(items, source);
            result = this._removeDublicateFilters(filteredItems, source);
        } else {
            result = items;
        }

        return result;
    }

    /**
     * Метод удаления устаревших значений среди элементов истории.
     * @param items
     * @param source
     */
    private _removeOutdatedFilters(items: RecordSet, source: IFilterItem[]): RecordSet {
        const getOriginalItem = (historyItem: IFilterItem): IFilterItem => {
            return source.find((origItem) => {
                return (
                    origItem.name === historyItem.name &&
                    (historyItem.historyId === origItem.historyId ||
                        !historyItem.historyId ||
                        !origItem.historyId)
                );
            });
        };
        let originalItem;
        let hasResetValue;
        chain
            .factory(items)
            .map((item) => {
                let objectData = this._getHistoryObject(item);
                if (objectData) {
                    let history = objectData.items || objectData;

                    if (!Array.isArray(history)) {
                        history = [history];
                    }
                    const historyText = [];
                    const historyItems = history.filter((hItem) => {
                        const textValue = hItem.textValue;
                        const hasTextValue =
                            textValue !== '' && textValue !== undefined && textValue !== null;
                        const value = hItem.value;

                        // 0 and false is valid
                        originalItem = getOriginalItem(hItem);
                        hasResetValue = originalItem && originalItem.hasOwnProperty('resetValue');
                        const checkResult =
                            hasTextValue &&
                            originalItem &&
                            (!hasResetValue ||
                                (hasResetValue && !isEqual(value, originalItem.resetValue)));

                        if (checkResult) {
                            historyText.push(textValue);
                        }

                        return checkResult;
                    });
                    if (objectData.items) {
                        objectData.items = historyText.join(', ') ? historyItems : [];
                    } else {
                        objectData = historyItems;
                    }
                    item.set('ObjectData', JSON.stringify(objectData, new Serializer().serialize));
                    return item;
                }
            })
            .value();
        return items;
    }

    /**
     * Метод удаления повторяющихся значений среди элементов истории.
     * @param items
     */
    private _removeDublicateFilters(items: RecordSet, source: IFilterItem): RecordSet {
        const processedItemsArray = [];
        const historyForRemove = [];
        const resultItems = chain
            .factory(items)
            .filter((item) => {
                const objectData = this._getHistoryObject(item);

                if (objectData) {
                    const filterItems = objectData.items || objectData;
                    const isDuplicated = processedItemsArray.some((processedItems) => {
                        return this._isItemsEqual(processedItems, filterItems);
                    });

                    if (!isDuplicated && filterItems?.length) {
                        processedItemsArray.push(filterItems);
                        return objectData;
                    } else if (isDuplicated || !filterItems?.length) {
                        historyForRemove.push(item.getKey());
                    }
                } else {
                    historyForRemove.push(item.getKey());
                }
            })
            .value(factory.recordSet, { adapter: items.getAdapter(), keyProperty: 'ObjectId' });
        if (historyForRemove.length && !this._hasHistoryIdOnItems(source)) {
            historyForRemove.forEach((key) => {
                Store.delete(this._options.historyId, key);
            });
        }

        return resultItems;
    }

    /**
     * Метод сравенения элементов истории.
     * @param filterItems
     * @param compareFilterItems
     */
    private _isItemsEqual(
        filterItems: IFilterItem[],
        compareFilterItems: IFilterItem[] = []
    ): boolean {
        const isEqualByValue = filterItems.every((item) => {
            const compareFilterItem = compareFilterItems.find((compareItem) => {
                return compareItem.name === item.name;
            });
            return compareFilterItem && isEqual(compareFilterItem.value, item.value);
        });
        const isEqualByTextValue =
            this._getFilterItemsTextValue(filterItems) ===
            this._getFilterItemsTextValue(compareFilterItems);

        return (
            filterItems.length === compareFilterItems?.length &&
            (isEqualByValue || isEqualByTextValue)
        );
    }

    protected _editDialogResult(data: IEditDialogResult): void {
        if (data.action === 'save') {
            this._saveFavorite(data.record);
        } else if (data.action === 'delete') {
            this._deleteFavorite();
        }
    }

    protected _hasHistoryIdOnItems(source: IFilterItem): boolean {
        return !!source.find((filterItem) => {
            return filterItem.historyId !== undefined;
        });
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
        const history = this._getHistoryObject(item);
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
        const editItemData = this._getHistoryObject(this._editItem);
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
        this._loadedItems = this._filterHistoryItems(
            FilterHistory.getItemsByHistory(
                this._options.historyId,
                this._options.saveMode === 'favorite'
                    ? FilterHistory.MAX_HISTORY_HORIZONTAL_WINDOW
                    : FilterHistory.MAX_HISTORY
            ),
            this._options.source
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
