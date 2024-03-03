/**
 * @kaizen_zone 151eca3e-138d-4a14-b047-880c0aeecf79
 */
import rk = require('i18n!Controls');
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filterPopup/Panel/Panel';
import chain = require('Types/chain');
import Utils = require('Types/util');
import Clone = require('Core/core-clone');
import find = require('Core/helpers/Object/find');
import { isEqual } from 'Types/object';
import { factory, List, RecordSet } from 'Types/collection';
import { Logger } from 'UI/Utils';
import {
    HistoryUtils,
    FilterUtils,
    IFilterItem,
    isEqualItems,
    FilterHistory,
} from 'Controls/filter';
import { Controller, IValidateResult } from 'Controls/validate';
import 'Controls/form';
import {
    IFilterDetailPanelOptions,
    THistorySaveMode,
} from 'Controls/_filterPopup/interface/IFilterPanel';
import 'css!Controls/filterPopup';
import 'css!Controls/filterPanelPopup';

const getPropValue = Utils.object.getPropertyValue.bind(Utils);
const setPropValue = Utils.object.setPropertyValue.bind(Utils);
const DEFAULT_HEADING_CAPTION = rk('Отбираются');
const DEFAULT_HEADING_CAPTION_EXTENDED_ITEMS = rk('Можно отобрать');

/**
 * Контрол для отображения шаблона панели фильтров. Отображает каждый фильтр по заданным шаблонам.
 * Он состоит из трех блоков: Отбираются, Можно отобрать, Ранее отбирались.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_filter.less переменные тем оформления filter}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_filterPopup.less переменные тем оформления filterPopup}
 *
 * @class Controls/_filterPopup/DetailPanel
 * @extends UI/Base:Control
 * @mixes Controls/filterPopup:IFilterButton
 * @public
 *
 * @cssModifier controls-FilterPanel__width-s Маленькая ширина панели.
 * @cssModifier controls-FilterPanel__width-m Средняя ширина панели.
 * @cssModifier controls-FilterPanel__width-l Большая ширина панели.
 * @cssModifier controls-FilterPanel__width-xl Очень большая ширина панели.
 * @cssModifier controls-FilterPanel__DateRange Кастомизирует контрол DateRange для отображения на панели фильтров.
 * Необходимо навесить на шаблон фильтра DateRange.
 */

/*
 * Component for displaying a filter panel template. Displays each filters by specified templates.
 * It consists of three blocks: Selected, Also possible to select, Previously selected.
 * Here you can see <a href="/materials/DemoStand/app/Controls-demo%2FFilter%2FButton%2FPanelVDom">demo-example</a>.
 *
 *
 * @class Controls/_filterPopup/DetailPanel
 * @extends UI/Base:Control
 * @mixes Controls/filterPopup:IFilterButton
 * @public
 * @author Михайлов С.Е.
 *
 * @cssModifier controls-FilterPanel__width-s Маленькая ширина панели.
 * @cssModifier controls-FilterPanel__width-m Средняя ширина панели.
 * @cssModifier controls-FilterPanel__width-l Большая ширина панели.
 * @cssModifier controls-FilterPanel__width-xl Очень большая ширина панели.
 */
class FilterPanel extends Control<IFilterDetailPanelOptions, IFilterItem[] | List<IFilterItem[]>> {
    protected _template: TemplateFunction = template;
    protected _isChanged: boolean = false;
    protected _hasResetValue: boolean = false;
    protected _hasBasicItems: boolean = true;
    protected _hasAdditionalParams: boolean = false;
    protected _hasHistory: boolean = false;
    protected _keyProperty: string = null;
    protected _historySaveMode: THistorySaveMode = null;
    protected _items: IFilterItem[];
    protected _historyItems: RecordSet | List<IFilterItem[]>;
    protected _historyId: string;
    protected _headingCaption: string;

    protected _children: {
        formController: Controller;
    };

    protected _beforeMount(
        options: IFilterDetailPanelOptions
    ): Promise<IFilterItem[] | List<IFilterItem[]>> {
        this._resolveItems(options);
        this._keyProperty = this._getKeyProperty(this._items);
        this._isChanged = this._isChangedValue(this._items);
        this._hasAdditionalParams = this._hasAddParams(options);
        this._hasResetValue = FilterUtils.hasResetValue(this._items);
        this._hasBasicItems = this._hasBasicParams();
        this._headingCaption = this._getHeadingCaption(options);
        this._historySaveMode =
            options.orientation === 'horizontal' || options.historySaveMode === 'favorite'
                ? 'favorite'
                : 'pinned';
        return this._loadHistoryItems(
            options.historyId,
            this._historySaveMode,
            options.removeOutdatedFiltersFromHistory,
            this._items
        );
    }

    protected _beforeUpdate(
        newOptions: IFilterDetailPanelOptions
    ): void | Promise<IFilterItem[] | List<IFilterItem[]>> {
        if (!isEqual(this._options.items, newOptions.items)) {
            this._resolveItems(newOptions);
        }
        this._keyProperty = this._getKeyProperty(this._items);
        this._isChanged = this._isChangedValue(this._items);
        this._hasAdditionalParams = this._hasAddParams(newOptions);
        this._hasResetValue = FilterUtils.hasResetValue(this._items);
        this._hasBasicItems = this._hasBasicParams();
        this._headingCaption = this._getHeadingCaption(newOptions);
        if (this._options.historyId !== newOptions.historyId) {
            return this._loadHistoryItems(
                newOptions.historyId,
                this._historySaveMode,
                newOptions.removeOutdatedFiltersFromHistory
            );
        }
    }

    protected _historyItemsChanged(): void {
        this._reloadHistoryItems(this._options.historyId);
    }

    protected _itemsChangedHandler(event: Event, items: IFilterItem[]): void {
        this._items = this._cloneItems(items);
        this._hasBasicItems = this._hasBasicParams();
        this._headingCaption = this._getHeadingCaption(this._options);

        this._notify('itemsChanged', [this._items]);
    }

    protected _applyHistoryFilter(event: Event, history: IFilterItem[]): void {
        const items = history.items || history;
        this._applyFilter(event, items, history);
    }

    protected _applyFilter(event: Event, items: IFilterItem[], history: IFilterItem[]): void {
        const curItems = items || this._items;

        const apply = (preparedItems) => {
            /*
            Due to the fact that a bar can be created as you like (the bar will be not in the root, but a bit deeper)
            and the popup captures the sendResult operation from the root node, bubbling must be set in true.
         */
            this._notify(
                'sendResult',
                [
                    {
                        filter: this._getFilter(preparedItems),
                        items: preparedItems,
                        history,
                    },
                ],
                { bubbling: true }
            );
            this._notify('close', [], { bubbling: true });
        };

        if (history) {
            this._notify('historyApply', [curItems]);
            apply(curItems);
        } else if (!this._hasBasicItems) {
            apply(this._prepareItems(curItems));
        } else {
            this._validate().then((result: IValidateResult) => {
                if (this._isPassedValidation(result)) {
                    apply(this._prepareItems(curItems));
                }
            });
        }
    }

    protected _getPopupBackgroundStyle(): string {
        if (this._options.orientation === 'horizontal') {
            return 'unaccented';
        } else if (this._options.isAdaptive) {
            return 'default';
        } else if (!this._hasBasicItems) {
            return 'unaccented';
        }
        return '';
    }

    protected _resetFilter(): void {
        this._items = this._cloneItems(this._options.items);
        FilterUtils.resetFilter(this._items);
        this._isChanged = false;
        this._notify('itemsChanged', [this._items]);
    }

    protected _isHistoryVisible(): boolean {
        return (
            this._options.historyId &&
            (this._historyItems.getCount() || this._options.emptyHistoryTemplate)
        );
    }

    private _getHeadingCaption({
        headingCaption,
        orientation,
        applyButtonCaption,
    }: IFilterDetailPanelOptions): string {
        if (orientation === 'horizontal') {
            return headingCaption;
        } else if (headingCaption !== DEFAULT_HEADING_CAPTION && !applyButtonCaption) {
            Logger.error(
                `Controls.filterPopup: Для окна фильтров с orientation = vertical задана опция headingCaption.
                          Опцию допустимо задавать только при горизонтальном отображении фильтра.`
            );
        }
        return this._hasBasicItems
            ? DEFAULT_HEADING_CAPTION
            : DEFAULT_HEADING_CAPTION_EXTENDED_ITEMS;
    }

    private _hasAddParams(options: IFilterDetailPanelOptions): boolean {
        let hasAdditional = false;
        if (options.additionalTemplate || options.additionalTemplateProperty) {
            chain.factory(this._items).each((item) => {
                if (getPropValue(item, 'visibility') === false) {
                    hasAdditional = true;
                }
            });
        }

        return hasAdditional;
    }

    private _hasBasicParams(): boolean {
        let hasBasic = false;
        chain.factory(this._items).each((item) => {
            if (getPropValue(item, 'visibility') !== false) {
                hasBasic = true;
            }
        });

        return hasBasic;
    }

    private _resolveItems(options: IFilterDetailPanelOptions): void {
        if (options.items) {
            this._items = this._cloneItems(options.items);
        } else {
            throw new Error('Controls/filterPopup:Panel::items option is required');
        }
    }

    private _loadHistoryItems(
        historyId: string,
        historySaveMode: THistorySaveMode,
        removeOutdatedFiltersFromHistory: boolean,
        filterSource: IFilterItem[]
    ): Promise<IFilterItem[]> | void {
        if (historyId) {
            const config = FilterHistory.getHistorySourceOptions(
                historyId,
                filterSource,
                historySaveMode
            );
            return FilterHistory.loadFilterHistory(config).then(
                (historyData) => {
                    const historySource = FilterHistory.getFilterHistorySource(config);
                    let historyItems;

                    if (historySaveMode === 'favorite') {
                        historyItems = historySource.getItems();
                    } else {
                        historyItems = historyData?.items || historyData;
                    }
                    this._historyItems = this._filterHistoryItems(
                        historyId,
                        historyItems,
                        removeOutdatedFiltersFromHistory
                    );
                    this._hasHistory = !!this._historyItems.getCount();
                    return this._historyItems;
                },
                () => {
                    this._historyItems = new List({ items: [] });
                }
            );
        }
    }

    private _filterHistoryItems(
        historyId: string,
        items: RecordSet,
        removeOutdatedFiltersFromHistory: boolean = true
    ): RecordSet {
        let result;
        if (items) {
            const filteredItems = this._removeOutdatedFilters(
                items,
                removeOutdatedFiltersFromHistory
            );
            result = this._removeDublicateFilters(filteredItems, historyId);
        } else {
            result = items;
        }

        return result;
    }

    private _isItemsEqual(filterItems: IFilterItem[], compareFilterItems: IFilterItem[]): boolean {
        return (
            filterItems.length === compareFilterItems?.length &&
            filterItems.every((item) => {
                const compareFilterItem = compareFilterItems?.find((compareItem) => {
                    return isEqualItems(compareItem, item);
                });
                return compareFilterItem && isEqual(compareFilterItem.value, item.value);
            })
        );
    }

    private _removeDublicateFilters(items: RecordSet, historyId: string): RecordSet {
        const processedItemsArray = [];
        const historyForRemove = [];
        const resultItems = chain
            .factory(items)
            .filter((item) => {
                const objectData = JSON.parse(item.get('ObjectData'));

                if (objectData) {
                    const filterItems = objectData.items || objectData;
                    const isDuplicated = processedItemsArray.some((processedItems) => {
                        return this._isItemsEqual(processedItems, filterItems);
                    });

                    if (!isDuplicated && filterItems?.length) {
                        processedItemsArray.push(filterItems);
                        return objectData;
                    } else if (isDuplicated) {
                        historyForRemove.push(item.getKey());
                    }
                } else {
                    historyForRemove.push(item.getKey());
                }
            })
            .value(factory.recordSet, { adapter: items.getAdapter() });
        if (historyForRemove.length) {
            const historySource = HistoryUtils.getHistorySource({ historyId });
            historyForRemove.forEach((key) => {
                return historySource.destroy(key, { $_history: true });
            });
        }
        return resultItems;
    }

    private _removeOutdatedFilters(
        items: RecordSet,
        removeOutdatedFiltersFromHistory: boolean
    ): RecordSet {
        const getOriginalItem = (historyItem: IFilterItem): IFilterItem => {
            return find(this._items, (origItem) => {
                return (
                    isEqualItems(origItem, historyItem) &&
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
                let objectData = JSON.parse(item.get('ObjectData'));
                if (objectData) {
                    let history = objectData.items || objectData;

                    if (!Array.isArray(history)) {
                        history = [history];
                    }
                    const historyText = [];
                    const historyItems = history.filter((item) => {
                        const textValue = getPropValue(item, 'textValue');
                        const hasTextValue =
                            textValue !== '' && textValue !== undefined && textValue !== null;
                        const value = getPropValue(item, 'value');

                        if (hasTextValue) {
                            historyText.push(textValue);
                        }

                        // 0 and false is valid
                        if (hasTextValue || !removeOutdatedFiltersFromHistory) {
                            originalItem = getOriginalItem(item);
                            hasResetValue =
                                originalItem && originalItem.hasOwnProperty('resetValue');

                            return (
                                (!removeOutdatedFiltersFromHistory || originalItem) &&
                                (!hasResetValue ||
                                    (hasResetValue &&
                                        !isEqual(value, getPropValue(originalItem, 'resetValue'))))
                            );
                        }
                    });
                    if (objectData.items) {
                        objectData.items = historyText.join(', ') ? historyItems : [];
                    } else {
                        objectData = historyItems;
                    }
                    item.set('ObjectData', JSON.stringify(objectData));
                    return item;
                }
            })
            .value();
        return items;
    }

    private _reloadHistoryItems(historyId: string): void {
        this._historyItems = this._filterHistoryItems(
            historyId,
            HistoryUtils.getHistorySource({ historyId }).getItems(),
            this._options.removeOutdatedFiltersFromHistory
        );
        this._hasHistory = !!this._historyItems.getCount();
    }

    private _cloneItems(items: object) {
        if (items['[Types/_entity/CloneableMixin]']) {
            return items.clone();
        }
        return Clone(items);
    }

    private _getFilter(items: IFilterItem[]): object {
        const filter = {};
        chain.factory(items).each((item) => {
            if (
                !isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue')) &&
                (getPropValue(item, 'visibility') === undefined || getPropValue(item, 'visibility'))
            ) {
                filter[item.name] = getPropValue(item, 'value');
            }
        });
        return filter;
    }

    private _isChangedValue(items: IFilterItem[]): boolean {
        let isChanged = false;
        chain.factory(items).each((item) => {
            if (
                (getPropValue(item, 'resetValue') !== undefined &&
                    !isEqual(getPropValue(item, 'value'), getPropValue(item, 'resetValue')) &&
                    getPropValue(item, 'visibility') === undefined) ||
                (getPropValue(item, 'visibility') &&
                    item.viewMode === 'extended' &&
                    !item.editorTemplateName)
            ) {
                isChanged = true;
            }
        });
        return isChanged;
    }

    private _validate(): Promise<IValidateResult | Error> {
        return this._children.formController.submit();
    }

    private _isPassedValidation(result: IValidateResult): boolean {
        let isPassedValidation = true;
        chain.factory(result).each((value) => {
            if (value) {
                isPassedValidation = false;
            }
        });
        return isPassedValidation;
    }

    private _getKeyProperty(items: IFilterItem[]): string {
        const firstItem = chain.factory(items).first();
        return firstItem.hasOwnProperty('name') ? 'name' : 'id';
    }

    private _prepareItems(items: IFilterItem[]): IFilterItem[] {
        let value;
        let isValueReseted;
        chain.factory(items).each((item) => {
            value = getPropValue(item, 'value');
            if (item.hasOwnProperty('resetValue')) {
                isValueReseted = isEqual(value, getPropValue(item, 'resetValue'));
            } else {
                // if the missing resetValue field, by value field we determine that the filter should be moved
                isValueReseted = !value || value.length === 0;
            }
            if (getPropValue(item, 'visibility') === true && isValueReseted) {
                setPropValue(item, 'visibility', false);
            }
        });
        return items;
    }

    static getDefaultOptions(): IFilterDetailPanelOptions {
        return {
            headingCaption: DEFAULT_HEADING_CAPTION,
            headingStyle: 'primary',
            headingFontSize: 'xl',
            orientation: 'vertical',
            applyButtonStyle: 'success',
            additionalPanelTemplate: 'Controls/filterPopup:AdditionalPanelTemplate',
            removeOutdatedFiltersFromHistory: true,
        };
    }
}

export default FilterPanel;

/**
 * @name Controls/_filterPopup/DetailPanel#topTemplate
 * @cfg {String|TemplateFunction} Шаблон отображения заголовка на Панели фильтров.
 */

/**
 * @name Controls/_filterPopup/DetailPanel#historySaveMode
 * @cfg {String} Режим работы с историей фильтров.
 * @variant pinned По ховеру на элемент появляется команда закрепления записи.
 * @variant favorite По ховеру на элемент появляется команда добавления записи в избранное.
 */

/**
 * @typedef {Object} SendResultParams
 * @property {Object} filter Объект фильтра {'filter_id': 'filter_value'}.
 * @property {Object} items Набор элементов.
 * @property {Object} history Набор элементов с учетом истории. Появляется только при клике по элементу блока "Ранее отбирались".
 */

/**
 * @event sendResult Происходит при клике по кнопке "Отобрать".
 * @name Controls/_filterPopup/DetailPanel#sendResult
 * @param {UI/Events:SyntheticEvent} event Объект события.
 * @param {SendResultParams} SendResultParams Параметры sendResult.
 */

/*
 * @event Happens when clicking the button "Select".
 * @name Controls/_filterPopup/DetailPanel#sendResult
 * @param {Object} filter Filter object view {'filter_id': 'filter_value'}
 * @param {Object} items items
 */

/**
 * @event historyApply Происходит при применении фильтра из истории фильтров.
 * @name Controls/_filterPopup/DetailPanel#historyApply
 * @param {UI/Events:SyntheticEvent} event Объект события.
 * @param {Controls/_filter/View/interface/IFilterItem#source} source Конфигурация фильтра.
 */
