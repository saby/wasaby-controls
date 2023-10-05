/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import rk = require('i18n!Controls');
import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filter/View/View';
import defaultItemTemplate from 'Controls/_filter/View/ItemTemplate';

import { detection, IoC } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';
import { RegisterUtil, UnregisterUtil } from 'Controls/event';
import { factory as CollectionFactory, RecordSet, List } from 'Types/collection';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { factory } from 'Types/chain';
import { Model, CancelablePromise } from 'Types/entity';
import { ICrud, ICrudPlus, QueryWhereExpression } from 'Types/source';
import Merge = require('Core/core-merge');
import { isLoaded, loadAsync, loadSync } from 'WasabyLoader/ModulesLoader';
import { instanceOfModule } from 'Core/core-instance';

import { NewSourceController as SourceController } from 'Controls/dataSource';
import { process } from 'Controls/error';
import { dropdownHistoryUtils as historyUtils } from 'Controls/dropdown';
import {
    StickyOpener,
    StackOpener,
    DialogOpener,
    DependencyTimer,
    IPopupOptions,
    IStickyPopupOptions,
} from 'Controls/popup';
import { getItemsWithHistory, getUniqItems } from 'Controls/_filter/MenuUtils';
import FilterDescription from './FilterDescription';
import { descriptor } from 'Types/entity';

import { IFilterItem, IEditorOptions, TKey, TNavigation } from './View/interface/IFilterItem';
import { IFilterView, IFilterViewOptions } from './View/interface/IFilterView';
import { Source as HistorySource } from 'Controls/history';
import 'css!Controls/filter';
import { TStoreImport } from 'Controls/interface';
import { IFilterViewProps } from './View/ViewReact';

interface IFilterReceivedState {
    configs: IFilterItemConfigs;
}

interface IFilterItemConfig extends IEditorOptions {
    emptyText: string;
    emptyKey: boolean | string | number;
    sourceController: SourceController;
    popupItems: RecordSet;
    items: RecordSet;
    initSelectorItems: RecordSet;
}

export interface IFilterItemConfigs {
    [key: string]: IFilterItemConfig;
}

interface IDisplayText {
    text?: string;
    hasMoreText?: string;
    title?: string;
}

interface IResultPopup {
    id: string;
    data: Model[];
    selectedItems?: RecordSet;
    selectedKeys?: TKey[];
    action: string;
    items?: IFilterItem[];
    history?: IFilterItem[];
    searchValue?: string;
}

const DEFAULT_FILTER_NAME = 'all_frequent';
const EMPTY_TEXT_FILTER_NAME = 'emptyTextTarget';

const DATE_MENU_EDITOR = 'Controls/filterPanel:DateMenuEditor';

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};

/**
 * Контрол "Объединённый фильтр".
 * Реализует UI для отображения и редактирования фильтра.
 * Представляет собой кнопку, при клике по которой выводится список возможных параметров фильтрации.
 * Используется в устаревшей схеме связывания через {@link Controls/browser:Browser} (например, в {@link /doc/platform/developmentapl/interface-development/controls/input-elements/directory/layout-selector-stack/ окнах выбора}).
 * В остальных случаях, чтобы связать фильтры со списком, используйте {@link Controls-ListEnv/filterConnected:View}.
 *
 * @remark
 * При клике на кнопку-иконку или строковое представления открывается панель фильтров, созданная на основе {@link Controls/filterPopup:DetailPanel}.
 * При клике на параметры быстрого фильтра открывается панель "Быстрых фильтров", созданная на основе {@link Controls/filterPopup:SimplePanel}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/#deprecated-c-controlsbrowserbrowser руководство разработчика по организации поиска и фильтрации в реестре}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_filter.less переменные тем оформления filter}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_filterPopup.less переменные тем оформления filterPopup}
 *
 * @class Controls/_filter/View
 * @public
 *
 * @demo Controls-ListEnv-demo/Filter/NotConnectedView/RichDemo/Index
 *
 * @see Controls/filterPopup:SimplePanel
 * @see Controls/filterPopup:DetailPanel
 * @see Controls/filter:ViewContainer
 */

/*
 * Control for data filtering. Consists of an icon-button, a string representation of the selected filter and fast filter parameters.
 * Clicking on a icon-button or a string opens the detail panel. {@link Controls/filterPopup:DetailPanel}
 * Clicking on fast filter parameters opens the simple panel. {@link Controls/filterPopup:SimplePanel}
 * Here you can see <a href="/materials/DemoStand/app/Controls-demo%2FFilterView%2FFilterView">demo-example</a>.
 *
 * @class Controls/_filter/View
 * @extends UI/Base:Control
 *
 * @public
 * @author Золотова Э.Е.
 * @see Controls/filterPopup:SimplePanel
 * @see Controls/filterPopup:DetailPanel
 * @see Controls/filter:FastContainer
 */

class FilterView extends Control<IFilterViewOptions, IFilterReceivedState> implements IFilterView {
    readonly '[Controls/_filter/View/interface/IFilterView]': boolean;
    protected _template: TemplateFunction = template;
    protected _viewProps: IFilterViewProps;
    protected _displayText: { [key: string]: IDisplayText };
    protected _filterText: string;
    protected _configs: IFilterItemConfigs;
    protected _source: IFilterItem[];
    protected _dateRangeItem: IFilterItem;
    protected _hasResetValues: boolean;
    private _idOpenSelector: string;
    private _dependenciesTimer: DependencyTimer;
    private _filterPopupOpener: StackOpener | StickyOpener;
    private _stackOpener: StackOpener;
    private _detailPanelTemplateName: string;
    private _openCallbackId: string;
    private _resetCallbackId: string;
    private _storeCtxCallbackId: string;
    private _loadPromise: CancelablePromise<any>;
    private _loadOperationsPanelPromise: Promise<unknown>;
    private _setEditorOptionsPromise: Promise<unknown>;
    private _collapsedFilters: string[] | number[] = null;
    private _isDetailPanelOpened: boolean = false;
    protected _editorsViewMode: string;

    constructor(options) {
        super(options);
        this._startLoadDependencies = this._startLoadDependencies.bind(this);
        this._openPanel = this._openPanel.bind(this);
        this._openDetailPanel = this._openDetailPanel.bind(this);
        this._resetFrequentItem = this._resetFrequentItem.bind(this);
        this.reset = this.reset.bind(this);
        this._resetFilterText = this._resetFilterText.bind(this);
        this._rangeTextChangedHandler = this._rangeTextChangedHandler.bind(this);
        this._rangeValueChangedHandler = this._rangeValueChangedHandler.bind(this);
    }

    openDetailPanel(name?: string): void {
        if (this._detailPanelTemplateName) {
            const isNewPanel = this._detailPanelTemplateName === 'Controls/filterPanelPopup:Sticky';
            let popupOptions: IStickyPopupOptions = {
                fittingMode: {
                    horizontal: 'overflow',
                    vertical: 'overflow',
                },
                actionOnScroll: 'close',
            };
            if (this._options.alignment === 'right') {
                popupOptions.targetPoint = {
                    vertical: 'top',
                    horizontal: 'right',
                };
                popupOptions.direction = {
                    horizontal: 'left',
                };
            }
            popupOptions = Merge(popupOptions, this._options.detailPanelPopupOptions || {});
            popupOptions.template = this._detailPanelTemplateName;
            popupOptions.className =
                (isNewPanel
                    ? 'controls-FilterPanelPopup-orientation-'
                    : 'controls-FilterButton-popup-orientation-') +
                (this._options.alignment === 'right' ? 'left' : 'right');
            popupOptions.templateOptions = this._options.detailPanelTemplateOptions || {};
            this._isDetailPanelOpened = true;
            this._open(this._source, popupOptions);
        } else {
            this._openPanel(null, name);
        }
    }

    reset(): void {
        FilterDescription.resetFilterDescription(this._source);
        this._notifyChanges(this._source);
        this._updateText(this._source, this._configs);
    }

    protected _beforeMount(options: IFilterViewOptions): Promise<IFilterReceivedState> {
        this._configs = {} as IFilterItemConfigs;
        this._displayText = {};
        this._detailPanelTemplateName = options.detailPanelTemplateName;
        this._editorsViewMode = options.editorsViewMode;
        let resultDef;

        if (options.source) {
            this._resolveItems(options.source);
            resultDef = this._reload(true, !!options.panelTemplateName);
        }

        this._viewProps = this._getViewProps(options);
        return resultDef;
    }

    protected _afterMount(options: IFilterViewOptions): void {
        if (options.useStore) {
            this._subscribeStoreCommands();
            this._storeCtxCallbackId = getStore().onPropertyChanged(
                '_contextName',
                () => {
                    getStore().unsubscribe(this._openCallbackId);
                    getStore().unsubscribe(this._resetCallbackId);
                    this._subscribeStoreCommands();
                },
                true
            );
        }
    }

    _subscribeStoreCommands(): void {
        this._openCallbackId = getStore().declareCommand(
            'openFilterDetailPanel',
            this.openDetailPanel.bind(this)
        );
        this._resetCallbackId = getStore().declareCommand('resetFilter', this.reset.bind(this));
    }

    protected _getViewProps(options: IFilterViewOptions): IFilterViewProps {
        return {
            ...options,
            alignment: options.isAdaptive ? 'right' : options.alignment,
            source: this._source,
            configs: this._configs,
            dateRangeItem: this._dateRangeItem,
            filterText: this._filterText,
            displayText: this._displayText,
            hasResetValues: this._hasResetValues,
            needShowDetailPanelTarget: this._needShowDetailPanelTarget(this._source, options),
            allChangedFilterTextValueInvisible: this._allChangedFilterTextValueInvisible(),
            isFastReseted: this._isFastReseted(),
            needShowFastFilter: this._needShowFastFilter(this._source),
            isFiltersReseted: this._isFiltersReseted(),

            startLoadDependencies: this._startLoadDependencies,

            textValueHandler: this._rangeTextChangedHandler,
            dateRangeHandler: this._rangeValueChangedHandler,

            resetFrequentItem: this._resetFrequentItem,
            resetFilter: this.reset,
            resetFilterText: this._resetFilterText,

            openPanel: this._openPanel,
            openDetailPanel: this._openDetailPanel,
        };
    }

    protected _getItemsForReload(
        oldItems: IFilterItem[],
        newItems: IFilterItem[],
        configs: IFilterItemConfigs
    ): IFilterItem[] {
        const optionsToCheck = ['source', 'filter', 'navigation'];
        const getOptionsChecker = (oldItem, newItem) => {
            return (changed, optName) => {
                return (
                    changed ||
                    !isEqual(oldItem.editorOptions?.[optName], newItem.editorOptions?.[optName])
                );
            };
        };
        const result = [];
        factory(newItems).each((newItem) => {
            const oldItem = this._getItemByName(oldItems, newItem.name);
            const newItemIsFrequent = this._isFrequentItem(newItem);
            const oldItemIsFrequent = oldItem && this._isFrequentItem(oldItem);
            const needHistoryReload =
                configs && configs[newItem.name] && !configs[newItem.name].sourceController;
            const valueChanged = oldItem && !isEqual(newItem.value, oldItem.value);
            if (
                newItemIsFrequent &&
                (!oldItem ||
                    !oldItemIsFrequent ||
                    optionsToCheck.reduce(getOptionsChecker(oldItem, newItem), false) ||
                    (valueChanged && configs && !configs[newItem.name]) ||
                    needHistoryReload)
            ) {
                const hasTextValue = newItem?.textValue;
                if (
                    !hasTextValue ||
                    (valueChanged && !isEqual(newItem.value, newItem.resetValue))
                ) {
                    result.push(newItem);
                } else if (configs && configs[newItem.name]) {
                    // Загрузим перед открытием
                    delete configs[newItem.name];
                }
            }
        });
        return result;
    }

    protected _resetDisplayText(
        oldItems: IFilterItem[],
        newItems: IFilterItem[],
        displayText: IDisplayText
    ): void {
        factory(newItems).each((newItem) => {
            const oldItem = this._getItemByName(oldItems, newItem.name);
            if (
                (!oldItem ||
                    (this._isFrequentItem(oldItem) && oldItem.viewMode !== newItem.viewMode)) &&
                displayText[newItem.name]
            ) {
                displayText[newItem.name] = {};
            }
        });
    }

    protected _beforeUpdate(newOptions: IFilterViewOptions): void {
        if (this._options.editorsViewMode !== newOptions.editorsViewMode) {
            this._editorsViewMode = newOptions.editorsViewMode;
        }
        if (newOptions.source && newOptions.source !== this._options.source) {
            let resultDef;
            this._resolveItems(newOptions.source);
            this._resetDisplayText(this._options.source, this._source, this._displayText);
            this._displayText = { ...this._displayText };
            this._detailPanelTemplateName = newOptions.detailPanelTemplateName;
            const itemsForReload = this._getItemsForReload(
                this._options.source,
                newOptions.source,
                this._configs
            );
            const hasAsyncRedraw = itemsForReload.length || !!this._loadPromise;
            const updateCallback = () => {
                this._updateText(this._source, this._configs);
                if (this._getFilterPopupOpener().isOpened() && this._isDetailPanelOpened) {
                    this.openDetailPanel();
                }
            };
            if (itemsForReload.length) {
                this._clearConfigs(this._source, this._configs);
                resultDef = this._reload(null, !!newOptions.panelTemplateName, itemsForReload);
            } else if (this._loadPromise) {
                resultDef = this._loadPromise.promise.then(() => {
                    return this._loadSelectedItems(this._source, this._configs).then(() => {
                        updateCallback();
                    });
                });
            } else {
                const loadPromises = this._loadSelectedItemsForFrequentFilters(
                    this._source,
                    this._configs
                );

                if (!loadPromises.length) {
                    updateCallback();
                } else {
                    resultDef = Promise.all(loadPromises).then(() => {
                        updateCallback();
                    });
                }
            }
            /* Если идет или будет асинхронная загруза, то будет висеть старый текст, пока не загрузим айтемы
               Нцжно научиться понимать, когда можем айтем сразу перерисовать и делать это точечно
               TODO: https://online.sbis.ru/opendoc.html?guid=bd378c3f-b1f8-41ff-a3c1-9344c720c3c7
            */
            if (hasAsyncRedraw && this._options.task1182866412) {
                this._updateText(this._source, this._configs);
            }
            this._viewProps = this._getViewProps(newOptions);
            return resultDef;
        }
        const newViewProps = this._getViewProps(newOptions);
        if (!isEqual(this._viewProps, newViewProps)) {
            this._viewProps = newViewProps;
        }
    }

    protected _beforeUnmount(): void {
        if (this._loadPromise) {
            this._loadPromise.cancel();
            this._loadPromise = null;
        }
        this._configs = null;
        this._displayText = null;
        UnregisterUtil(this, 'customscroll', { listenAll: true });
        if (this._filterPopupOpener) {
            this._filterPopupOpener.destroy();
        }
        if (this._stackOpener) {
            this._stackOpener.destroy();
        }
        if (this._dialogOpener) {
            this._dialogOpener.destroy();
        }
        if (this._options.useStore) {
            getStore().unsubscribe(this._openCallbackId);
            getStore().unsubscribe(this._resetCallbackId);
            getStore().unsubscribe(this._storeCtxCallbackId);
        }
    }

    protected _startLoadDependencies(): void {
        if (!this._options.readOnly) {
            if (!this._dependenciesTimer) {
                this._dependenciesTimer = new DependencyTimer();
            }
            this._dependenciesTimer.start(this._loadDependencies.bind(this));
        }
    }

    protected _openDetailPanel(event?: SyntheticEvent<Event>, name?: string): Promise<void> {
        // загружаем зависимости, так как открыть панель могут не только по клику, но и из кода
        return this._loadDependencies().then(() => {
            // дожидаемся формирования editorOptions для фильтров с асинхронной функцией,
            // переданной в опцию editorOptionsName
            this._setEditorOptionsPromise.then(() => this.openDetailPanel(name));
        });
    }

    protected _openPanel(event?: SyntheticEvent<Event>, name?: string): Promise<void> | void {
        const isLoading = this._loadPromise && !this._loadPromise.promise.isReady();
        if (this._options.panelTemplateName && this._sourcesIsLoaded(this._configs) && !isLoading) {
            const clickOnFrequentItem = !!name;
            const target = clickOnFrequentItem && event?.currentTarget;
            const promises = [];
            promises.push(this._loadUnloadedFrequentItems(this._configs, this._source));
            promises.push(this._loadFrequentDependencies(this._source));
            return Promise.all(promises).then(
                () => {
                    this._loadItemsTemplates(this._configs, this._source).then(() => {
                        let popupConfig;
                        const filterItem = this._getItemByName(this._source, name);
                        if (filterItem?.type === 'dateMenu') {
                            popupConfig = [
                                this._getPopupItemConfig(filterItem, this._configs[name]),
                            ];
                        } else {
                            popupConfig = this._getPopupConfig(this._configs, this._source);
                        }
                        const items = new RecordSet({
                            rawData: popupConfig,
                        });
                        const popupOptions: IStickyPopupOptions = {
                            template: this._options.panelTemplateName,
                            fittingMode: {
                                horizontal: 'overflow',
                                vertical: 'adaptive',
                            },
                        };

                        if (clickOnFrequentItem) {
                            /*
                            В кейсе, когда переопределен itemTemplate, контейнера нет в _children
                            Нужно открыться от таргета, который закэширован перед запросом.
                         */
                            popupOptions.target =
                                this._children[name] ||
                                (target || this._container)?.getElementsByClassName(
                                    'js-controls-FilterView__target'
                                )[0];
                            popupOptions.className = 'controls-FilterView-SimplePanel-popup';
                        } else {
                            popupOptions.className =
                                'controls-FilterView-SimplePanel__buttonTarget-popup';
                        }
                        popupOptions.templateOptions = this._options.panelTemplateOptions || {};
                        this._isDetailPanelOpened = false;
                        this._open(items, popupOptions);
                    });
                },
                (error) => {
                    // Если во время загрузки данных произошла ошибка, то попытаемся догрузить при следующем открытии
                    this._configs = {};
                    process({ error });
                }
            );
        } else if (!this._options.panelTemplateName) {
            this._showSelector(name);
        }
    }

    protected _rangeTextChangedHandler(event: SyntheticEvent, textValue: string): void {
        const dateRangeItem = this._getDateRangeItem(this._source);
        dateRangeItem.textValue = textValue;
    }

    protected _rangeValueChangedHandler(event: SyntheticEvent, start: Date, end: Date): void {
        const dateRangeItem = this._getDateRangeItem(this._source);
        if (dateRangeItem.type === 'date') {
            dateRangeItem.value = start;
        } else {
            dateRangeItem.value = [start, end];
        }
        if (
            isEqual(dateRangeItem.value, dateRangeItem.resetValue) &&
            dateRangeItem.viewMode === 'basic' &&
            (dateRangeItem.extendedCaption || dateRangeItem.editorOptions?.extendedCaption)
        ) {
            dateRangeItem.viewMode = 'extended';
        }
        this._dateRangeItem = object.clone(dateRangeItem);
        this._notifyChanges(this._source);
        this._viewProps = { ...this._viewProps, dateRangeItem: this._dateRangeItem };
    }

    protected _allChangedFilterTextValueInvisible(): boolean {
        return this._source.every((item) => {
            return this._isItemChanged(item) ? item.textValueVisible === false : true;
        });
    }

    protected _isFastReseted(): boolean {
        let isReseted = true;
        factory(this._source).each((item) => {
            if (
                this._isFrequentItem(item) &&
                this._isItemChanged(item) &&
                item.textValueVisible !== false
            ) {
                isReseted = false;
            }
        });
        return isReseted;
    }

    protected _isFiltersReseted(): boolean {
        let isReseted = true;
        factory(this._source).each((item) => {
            if (!this._isDateItem(item) && this._isItemChanged(item)) {
                isReseted = false;
            }
        });
        return isReseted || (!this._filterText && this._isFastReseted());
    }

    protected _needShowFastFilter(source: IFilterItem[]): boolean {
        let needShowFastFilter = false;

        factory(source).each((item) => {
            if (!needShowFastFilter && this._isFrequentItem(item)) {
                needShowFastFilter = true;
            }
        });

        return needShowFastFilter;
    }

    protected _needShowDetailPanelTarget(
        source: IFilterItem[],
        options: IFilterViewOptions = this._options
    ): boolean {
        const isShowFast = this._needShowFastFilter(source);
        const isAdaptiveVisible =
            options.isAdaptive &&
            (!!options.detailPanelTemplateName || (isShowFast && !options.emptyText));
        return (
            (isAdaptiveVisible ||
                !!options.detailPanelTemplateName ||
                (this._isFastReseted() && isShowFast)) &&
            !options.readOnly
        );
    }

    protected _resetFrequentItem(event: Event, item: IFilterItem): void {
        const opener = this._getFilterPopupOpener();
        if (opener.isOpened()) {
            opener.close();
        }
        FilterDescription.resetFilterItem(item);
        this._notifyChanges(this._source);
        this._updateText(this._source, this._configs);
    }

    protected _resetFilterText(): void {
        const opener = this._getFilterPopupOpener();
        if (opener.isOpened()) {
            opener.close();
        }
        factory(this._source).each((item) => {
            // Быстрые фильтры и фильтр выбора периода
            // не должны сбрасываться по клику на крестик строки выбранных параметров
            if (
                !this._isFrequentItem(item) &&
                !this._isDateItem(item) &&
                item.textValueVisible !== false
            ) {
                FilterDescription.resetFilterItem(item);
            }
        });
        this._notifyChanges(this._source);
        this._updateText(this._source, this._configs);
    }

    // В диалоговых окнах отказались от отдельной темы для шапки,поэтому вырезаем тему шапки,которая берется из-за того,
    // что панель фильтров лежит в шапке стека.
    protected _prepareTheme(theme: string): string {
        const containHeader = theme.indexOf('header-');
        if (containHeader >= 0) {
            return theme.replace('header-', '');
        }
        return theme;
    }

    private _open(items: RecordSet, panelPopupOptions: IPopupOptions): void {
        if (this._options.readOnly) {
            return;
        }
        if (!detection.isMobileIOS) {
            RegisterUtil(this, 'customscroll', this._handleScroll.bind(this), {
                listenAll: true,
            });
        }
        const popupOptions = {
            opener: this,
            adaptiveOptions: {
                modal: true,
            },
            templateOptions: {
                items,
                collapsedGroups: this._collapsedFilters,
                historyId: this._options.historyId,
            },
            target: this._container[0] || this._container,
            className: 'controls-FilterView-popup',
            closeOnOutsideClick: true,
            eventHandlers: {
                onResult: this._resultHandler.bind(this),
                onClose: () => {
                    this._notify('detailPanelClose');
                },
            },
        };
        Merge(popupOptions, panelPopupOptions);
        const theme = this._prepareTheme(this._options.theme);
        popupOptions.className += ` controls_popupTemplate_theme-${theme} controls_filter_theme-${theme} controls_filterPopup_theme-${theme} controls_dropdownPopup_theme-${theme}`;
        this._getFilterPopupOpener().open(popupOptions);
    }

    private _handleScroll(): void {
        const opener = this._getFilterPopupOpener();
        if (opener.isOpened()) {
            opener.close();
        }
    }

    private _getFilterPopupOpener(): StickyOpener | StackOpener {
        if (!this._filterPopupOpener) {
            this._filterPopupOpener = new StickyOpener();
        }
        return this._filterPopupOpener;
    }

    private _getStackOpener(): StackOpener {
        if (!this._stackOpener) {
            this._stackOpener = new StackOpener();
        }
        return this._stackOpener;
    }

    private _getDialogOpener(): DialogOpener {
        if (!this._dialogOpener) {
            this._dialogOpener = new DialogOpener();
        }
        return this._dialogOpener;
    }

    private _resultHandler(result: IResultPopup): void {
        if (!result.action) {
            // В истории фильтра хранятся элементы структуры только с изменёнными значениями (value !== resetValue),
            // поэтому при применении фильтра из истории и мерже значений на панели останутся фильтры,
            // которые были применены до этого, чтобы такого не было, перед мержем надо сбросить текущую структуру
            const currentSource = this._source.map(
                // если элемент не сохраняется в истории,
                // то и при применении из истории он применяться не должен
                (item) => {
                    return item.doNotSaveToHistory && result.history
                        ? { ...item }
                        : FilterDescription.resetFilterItem({ ...item });
                }
            );
            this._resolveItems(
                FilterDescription.mergeFilterDescriptions(currentSource, result.items)
            );
            this._updateText(this._source, this._configs, true);
            this._isDetailPanelOpened = false;
        } else {
            switch (result.action) {
                case 'itemClick':
                    this._itemClick(result);
                    break;
                case 'applyClick':
                    this._applyClick(result);
                    break;
                case 'selectorResult':
                    this._selectorResult(result);
                    break;
                case 'moreButtonClick':
                    this._moreButtonClick(result);
                    break;
                case 'collapsedFiltersChanged':
                    this._collapsedFiltersChanged(result);
                    break;
            }
        }
        if (result.searchValue) {
            this._configs = {};
        }
        if (result.action !== 'moreButtonClick' && result.action !== 'collapsedFiltersChanged') {
            if (result.history) {
                this._notify('historyApply', [result.history]);
            }
            this._notifyChanges(this._source);
        }
        this._getFilterPopupOpener().close();
    }

    private _onSelectorTemplateResult(items: RecordSet): void {
        const config = this._configs[this._idOpenSelector];
        if (!config.items && items.getCount()) {
            config.items = factory(items).value(CollectionFactory.recordSet, {
                keyProperty: items.at(0).getKeyProperty(),
                adapter: items.at(0).getAdapter(),
                format: items.at(0).getFormat(),
            });
        }
        const resultSelectedItems =
            this._notify('selectorCallback', [
                this._configs[this._idOpenSelector].initSelectorItems,
                items,
                this._idOpenSelector,
            ]) || items;
        this._resultHandler({
            action: 'selectorResult',
            id: this._idOpenSelector,
            data: resultSelectedItems as Model[],
        });
    }

    private _openSelector(filterItem: IFilterItem, selectedKeys: string[]): Promise<void> {
        const selectedItems = [];
        const items =
            this._configs[filterItem.name]?.popupItems || this._configs[filterItem.name]?.items;
        factory(selectedKeys).each((key) => {
            if (key !== undefined && key !== null) {
                const index = items.getIndexByValue(
                    this._configs[filterItem.name].keyProperty,
                    key
                );
                if (index !== -1) {
                    selectedItems.push(items.at(index));
                }
            }
        });
        const selectorTemplate = filterItem.editorOptions.selectorTemplate;
        const templateOptions = object.clone(selectorTemplate.templateOptions) || {};
        templateOptions.multiSelect = filterItem.editorOptions.multiSelect;
        templateOptions.selectedItems = new List({
            items: selectedItems,
        });
        this._idOpenSelector = filterItem.name;
        this._configs[filterItem.name].initSelectorItems = templateOptions.selectedItems;
        return this._getStackOpener().open({
            opener: this,
            template: filterItem.editorOptions.selectorTemplate.templateName,
            templateOptions,
            eventHandlers: {
                onSelectComplete: (event, result): void => {
                    this._onSelectorTemplateResul(result);
                    this._getStackOpener().close();
                },
                onResult: this._onSelectorTemplateResult.bind(this),
            },
        });
    }

    private _showSelector(filterName?: string): Promise<void> {
        let item = null;
        if (
            filterName &&
            filterName !== DEFAULT_FILTER_NAME &&
            filterName !== EMPTY_TEXT_FILTER_NAME
        ) {
            item = this._getItemByName(this._source, filterName);
        } else {
            item = factory(this._source)
                .filter((filterItem) => {
                    return this._isFrequentItem(filterItem);
                })
                .first();
        }
        if (item) {
            const name = item.name;

            if (!this._configs[name]) {
                this._setConfigByItem(item);
            }
            if (item?.editorOptions.selectorTemplate) {
                const items = this._configs[name]?.popupItems || this._configs[name]?.items;
                const selectedKeys = item.editorOptions.multiSelect ? item.value : [item.value];
                if (items) {
                    return this._openSelector(item, selectedKeys);
                } else {
                    return this._loadItems(item).then(() => {
                        return this._openSelector(item, selectedKeys);
                    });
                }
            }
        }
    }

    private _getItemByName(items: IFilterItem[], name: string): IFilterItem {
        let result;
        factory(items).each((item) => {
            if (item.name === name) {
                result = item;
            }
        });
        return result;
    }

    private _isFrequentItem(item: IFilterItem): boolean {
        return item.viewMode === 'frequent' && !this._isDateItem(item);
    }

    private _isDateItem(item: IFilterItem): boolean {
        return item.type === 'dateRange' || item.type === 'date' || item.type === 'dateMenu';
    }

    private _resolveItems(items: IFilterItem[] = []): void {
        this._source = items.map((item) => {
            return { ...item };
        });
        this._hasResetValues = FilterDescription.hasResetValue(items);
    }

    private _sourcesIsLoaded(configs: IFilterItemConfigs): boolean {
        let result = true;
        factory(configs).each((config) => {
            if (config.sourceController && config.sourceController.isLoading()) {
                result = false;
            }
        });
        return result;
    }

    private _calculateStateSourceControllers(
        configs: IFilterItemConfigs,
        source: IFilterItem[]
    ): void {
        factory(source).each((item) => {
            const config = configs[item.name];
            if (this._isFrequentItem(item) && config?.items) {
                const sourceController = this._getSourceController(
                    configs[item.name],
                    item.editorOptions.source,
                    item.editorOptions.navigation
                );
                sourceController.setItems(configs[item.name].items);
            }
        });
    }

    private _getSourceController(
        config: IFilterItemConfig,
        source: ICrudPlus | HistorySource,
        navigation: TNavigation
    ): SourceController {
        if (!config.sourceController) {
            config.sourceController = new SourceController({
                source: source as ICrudPlus,
                navigation,
            });
        }
        return config.sourceController;
    }

    private _getDateRangeItem(items: IFilterItem[]): IFilterItem {
        let dateRangeItem;
        factory(items).each((item) => {
            const hasValue =
                !isEqual(item.value, item.resetValue) ||
                (item.resetValue instanceof Array ? !!item.resetValue.length : !!item.resetValue);
            if (
                this._isDateItem(item) &&
                (item.editorOptions?.emptyCaption || hasValue || item.emptyText)
            ) {
                dateRangeItem = item;
            }
        });
        if (
            dateRangeItem &&
            dateRangeItem.editorTemplateName === DATE_MENU_EDITOR &&
            dateRangeItem.textValue &&
            (dateRangeItem.editorOptions?.items || dateRangeItem.editorOptions?.dateMenuItems)
        ) {
            // Если сменили локализацию, в textValue подтянется значение из истории на старом языке,
            // меняем текст на актуальный из items
            const items =
                dateRangeItem.editorOptions?.dateMenuItems || dateRangeItem.editorOptions?.items;
            const item = items.getRecordById(dateRangeItem.value);
            if (item) {
                dateRangeItem.textValue = item.get(dateRangeItem.editorOptions.displayProperty);
            }
        }
        return dateRangeItem;
    }

    private _loadUnloadedFrequentItems(
        configs: IFilterItemConfigs,
        items: IFilterItem[]
    ): Promise<RecordSet[]> {
        const loadPromises = [];
        factory(items).each((item): void => {
            if (
                (this._isFrequentItem(item) || item.type === 'dateMenu') &&
                (!configs[item.name] ||
                    !configs[item.name].items ||
                    !configs[item.name].sourceController)
            ) {
                if (configs[item.name]) {
                    configs[item.name].items = null;
                }
                loadPromises.push(this._loadItems(item));
            }
        });
        return Promise.all(loadPromises).then(() => {
            return this._loadSelectedItems(this._source, this._configs);
        });
    }

    private _loadFrequentDependencies(items: IFilterItem[]): Promise<unknown> {
        const loadPromises = [];
        let useListRender = false;
        let hasSearch = false;
        factory(items).each((filterItem): void => {
            const itemTemplate = filterItem.editorOptions?.itemTemplate;
            if (
                this._isFrequentItem(filterItem) &&
                itemTemplate &&
                typeof itemTemplate === 'string' &&
                !isLoaded(itemTemplate)
            ) {
                loadPromises.push(loadAsync(itemTemplate));
            }
            if (filterItem.editorOptions?.useListRender) {
                useListRender = true;
            }
            if (filterItem.editorOptions?.searchParam) {
                hasSearch = true;
            }
        });
        if (useListRender) {
            loadPromises.push(loadAsync('Controls/list'));
        }
        if (hasSearch) {
            loadPromises.push(loadAsync('Controls/search'));
        }
        return Promise.all(loadPromises);
    }

    private _loadItemsTemplates(
        configs: IFilterItemConfigs,
        items: IFilterItem[]
    ): Promise<unknown> {
        const itemTemplates = [];
        factory(items).each((filterItem): void => {
            const itemTemplateProperty = filterItem.editorOptions?.itemTemplateProperty;

            if (itemTemplateProperty && this._isFrequentItem(filterItem)) {
                configs[filterItem.name].items?.forEach((item) => {
                    const itemTemplate = item.get(itemTemplateProperty);
                    if (
                        typeof itemTemplate === 'string' &&
                        !itemTemplates.includes(itemTemplate) &&
                        !isLoaded(itemTemplate)
                    ) {
                        itemTemplates.push(itemTemplate);
                    }
                });
            }
        });
        const loadPromises = itemTemplates.map((item) => {
            return loadAsync(item);
        });
        return Promise.all(loadPromises);
    }

    private _getPopupItemConfig(item: IFilterItem, config: IFilterItemConfig) {
        const popupItem = object.clonePlain(config);
        Merge(popupItem, item.editorOptions);
        popupItem.id = item.name;
        popupItem.selectedKeys = item.value instanceof Object ? item.value : [item.value];
        popupItem.resetValue =
            item.resetValue instanceof Object ? item.resetValue : [item.resetValue];
        popupItem.items = config.popupItems || popupItem.items;
        popupItem.selectorItems = config.items;
        popupItem.editorTemplateName = item.editorTemplateName;
        popupItem.viewMode = item.viewMode;
        if (item.editorOptions.source) {
            if (!config.source && (!config.loadDeferred || config.loadDeferred.isReady())) {
                // TODO https://online.sbis.ru/opendoc.html?guid=99e97896-1953-47b4-9230-8b28e50678f8
                popupItem.loadDeferred = this._loadItemsFromSource(
                    config,
                    item.editorOptions.source,
                    popupItem.filter,
                    item.editorOptions.navigation
                );
                config.loadDeferred = popupItem.loadDeferred;
            }
            if (!config.sourceController) {
                const sourceController = this._getSourceController(
                    config,
                    item.editorOptions.source,
                    item.editorOptions.navigation
                );
                sourceController.setItems(popupItem.items);
            } else {
                config.sourceController.setItems(popupItem.items);
            }
            popupItem.sourceController = config.sourceController;
            popupItem.selectorOpener = this._getStackOpener();
            popupItem.dialogOpener = this._getDialogOpener();
            popupItem.selectorDialogResult = this._onSelectorTemplateResult.bind(this);
            popupItem.opener = this;
        }
        return popupItem;
    }

    private _getPopupConfig(configs: IFilterItemConfigs, items: IFilterItem[]) {
        const popupItems = [];
        factory(items).each((item) => {
            if (this._isFrequentItem(item)) {
                popupItems.push(this._getPopupItemConfig(item, configs[item.name]));
            }
        });
        return popupItems;
    }

    private _getFolderIds(
        items: RecordSet,
        { nodeProperty, parentProperty, keyProperty }: IFilterItemConfig
    ): TKey[] {
        const folders = [];
        factory(items).each((item) => {
            if (item.get(nodeProperty) && !item.get(parentProperty)) {
                folders.push(item.get(keyProperty));
            }
        });
        return folders;
    }

    private _getHasMoreText(selection: TKey[]): string {
        return selection.length > 1 ? ', ' + rk('еще') + ' ' + (selection.length - 1) : '';
    }

    private _getParentText(selectedItem: Model, config: IFilterItemConfig): string {
        let text = '';
        let parentKey = selectedItem.get(config.parentProperty);
        while (parentKey !== undefined && parentKey !== null) {
            const parentItem = config.items.at(
                config.items.getIndexByValue(config.keyProperty, parentKey)
            );
            if (parentItem && parentItem.get(config.nodeProperty) === false) {
                text = `${object.getPropertyValue(parentItem, config.displayProperty)} ${text}`;
            }
            parentKey = parentItem?.get(config.parentProperty);
        }
        return text;
    }

    private _getTextFromItems(
        items: RecordSet,
        selectedKeys: string[],
        config: IFilterItemConfig
    ): string[] {
        const text = [];
        factory(selectedKeys).each((key) => {
            const selectedItem = config.items.at(
                config.items.getIndexByValue(config.keyProperty, key)
            );
            if (selectedItem) {
                const parentText = this._getParentText(selectedItem, config) || '';
                text.push(
                    parentText + object.getPropertyValue(selectedItem, config.displayProperty)
                );
            }
        });
        return text;
    }

    private _getFastText(
        config: IFilterItemConfig,
        selectedKeys: string[],
        item?: IFilterItem
    ): IDisplayText {
        let textArr = [];
        if (selectedKeys[0] === config.emptyKey && config.emptyText) {
            textArr.push(config.emptyText);
        } else if (config.items) {
            textArr = this._getTextFromItems(config.items, selectedKeys, config);
            if (!textArr.length && item?.textValue) {
                textArr.push(item.textValue);
            }
        } else if (item?.textValue) {
            textArr.push(item.textValue);
        }
        return {
            text: textArr[0] || '',
            title: textArr.join(', '),
            hasMoreText: this._getHasMoreText(textArr),
        };
    }

    private _checkEditorTextVisible(item: IFilterItem): boolean {
        const listEditor = 'Controls/filterPanel:ListEditor';

        const isMenuEditorValueVisible =
            item.editorTemplateName === DATE_MENU_EDITOR &&
            !item.editorOptions.dateMenuItems?.getRecordById(item.value);
        return (
            this._editorsViewMode === 'popupCloudPanelDefault' ||
            (item.editorTemplateName !== listEditor && item.type !== 'list') ||
            isMenuEditorValueVisible
        );
    }

    private _getFilterButtonText(items: IFilterItem[]): string {
        const textArr = [];
        let textValue;
        factory(items).each((item) => {
            const isBasicItem =
                (item.viewMode !== 'extended' &&
                    (!item.editorTemplateName || item.visibility !== false)) ||
                item.visibility === true ||
                item.visibility === undefined;

            if (
                item.textValueVisible !== false &&
                this._isItemChanged(item) &&
                !this._isFrequentItem(item) &&
                isBasicItem &&
                !this._isDateItem(item) &&
                // Временная проверка, пока не согласовано API отображения фильтров (панель/окно)
                (item.userVisibility === false || this._checkEditorTextVisible(item))
            ) {
                textValue = item.textValue;
                if (textValue) {
                    textArr.push(textValue);
                }
            }
        });
        return textArr.join(', ');
    }

    private _updateText(
        items: IFilterItem[],
        configs: IFilterItemConfigs,
        detailPanelHandler: boolean = false
    ): void {
        factory(items).each((item: IFilterItem) => {
            if (this._isFrequentItem(item) && item.textValueVisible !== false) {
                this._displayText[item.name] = {};
                if (this._isItemChanged(item)) {
                    if (configs[item.name]) {
                        const nodeProperty = configs[item.name].nodeProperty;
                        const selectedKeys =
                            configs[item.name].multiSelect || nodeProperty
                                ? item.value
                                : [item.value];

                        // [ [selectedKeysList1], [selectedKeysList2] ] in hierarchy list
                        const flatSelectedKeys = nodeProperty
                            ? factory(selectedKeys).flatten().value()
                            : selectedKeys;
                        const displayText = this._getFastText(
                            configs[item.name],
                            flatSelectedKeys,
                            item
                        );
                        this._displayText[item.name] = displayText;
                        if (!displayText.text && detailPanelHandler) {
                            // If method is called after selecting from detailPanel,
                            // then textValue will contains actual display value
                            displayText.text = item.textValue && item.textValue.split(', ')[0];
                            displayText.hasMoreText = this._getHasMoreText(flatSelectedKeys);
                        }
                        if (item.textValue !== undefined && !detailPanelHandler) {
                            item.textValue = displayText.title;
                        }
                    } else if (item.textValue) {
                        /* Сюда мы попадем только в случае, когда фильтр выбрали с панели фильтров,
                           но не открывали справочник и панель быстрых фильтров
                        */
                        const selectedKeys = item.editorOptions?.multiSelect
                            ? item.value
                            : [item.value];
                        this._displayText[item.name] = this._getFastText({}, selectedKeys, item);
                    }
                } else if (item.textValue && !detailPanelHandler) {
                    item.textValue = '';
                }
            }
        });
        this._filterText = this._getFilterButtonText(items);
        this._dateRangeItem = this._getDateRangeItem(items);
        this._displayText = { ...this._displayText };
        this._viewProps = this._getViewProps(this._options);
    }

    private _isItemChanged(item: IFilterItem): boolean {
        return !isEqual(
            object.getPropertyValue(item, 'value'),
            object.getPropertyValue(item, 'resetValue')
        );
    }

    private _getKeysUnloadedItems(
        config: IFilterItemConfig,
        value: TKey | TKey[],
        resetValue: TKey | TKey[]
    ): TKey[] {
        const selectedKeys = value instanceof Object ? value : [value];
        const flattenKeys = factory(selectedKeys).flatten().value();
        const newKeys = [];
        if (config.items) {
            factory(flattenKeys).each((key) => {
                const index = config.items.getIndexByValue(config.keyProperty, key);
                if (
                    key !== undefined &&
                    index === -1 &&
                    !(key === config.emptyKey && config.emptyText) &&
                    key !== resetValue
                ) {
                    newKeys.push(key);
                }
            });
        }
        return newKeys;
    }

    private _getPreparedItems(
        config: IFilterItemConfig,
        item: IFilterItem,
        newItems: Model[],
        folderId: TKey
    ): RecordSet {
        const getItemsByParentKey = (items: Model[] | RecordSet) => {
            return factory(items).filter((popupItem) => {
                return popupItem.get(config.parentProperty) === folderId;
            });
        };

        let folderItems: RecordSet = getItemsByParentKey(config.popupItems).value(
            CollectionFactory.recordSet,
            {
                adapter: config.popupItems.getAdapter(),
                keyProperty: config.popupItems.getKeyProperty(),
                format: config.popupItems.getFormat(),
                model: config.popupItems.getModel(),
            }
        );
        const newFolderItems = getItemsByParentKey(newItems).value();
        folderItems = getItemsWithHistory(
            folderItems,
            newFolderItems,
            config.sourceController,
            item.editorOptions.source,
            config.keyProperty,
            folderId
        );
        folderItems.prepend([config.popupItems.getRecordById(folderId)]);
        return folderItems;
    }

    private _setItems(config: IFilterItemConfig, item: IFilterItem, newItems: Model[]): void {
        let folders;
        if (config.nodeProperty) {
            config.popupItems = config.popupItems || config.items.clone();
            folders = this._getFolderIds(config.popupItems, config);
        }
        if (config.nodeProperty && folders.length) {
            let resultItems;
            factory(folders).each((folderId) => {
                if (!resultItems) {
                    resultItems = this._getPreparedItems(config, item, newItems, folderId);
                } else {
                    resultItems.append(this._getPreparedItems(config, item, newItems, folderId));
                }
            });
            config.popupItems.assign(resultItems);
            if (this._isHistorySource(item.editorOptions.source)) {
                config.popupItems = (item.editorOptions.source as HistorySource).prepareItems(
                    config.popupItems
                );
            }
        } else {
            config.popupItems = getItemsWithHistory(
                config.popupItems || config.items.clone(),
                newItems,
                config.sourceController,
                item.editorOptions.source,
                config.keyProperty
            );
        }
        config.items = getUniqItems(config.items, newItems, config.keyProperty);
    }

    private _loadSelectedItems(
        items: IFilterItem[],
        configs: IFilterItemConfigs
    ): Promise<RecordSet[]> {
        return Promise.all(this._loadSelectedItemsForFrequentFilters(items, configs));
    }

    private _loadSelectedItemsForFrequentFilters(
        items: IFilterItem[],
        configs: IFilterItemConfigs
    ): Promise<RecordSet>[] {
        const loadPromises = [];
        factory(items).each((item) => {
            if (this._isFrequentItem(item) && configs[item.name]) {
                const config = configs[item.name];
                const keys = this._getKeysUnloadedItems(
                    config,
                    item.value as TKey,
                    item.resetValue as TKey
                );
                const isDateMenuEditor = item.editorTemplateName === DATE_MENU_EDITOR;
                if (keys.length && !isDateMenuEditor) {
                    const editorOpts = {
                        source: item.editorOptions.source,
                        filter: { ...config.filter },
                    };

                    const keyProperty = config.keyProperty;
                    editorOpts.filter[keyProperty] = keys;
                    const result = this._loadItemsFromSource(
                        {},
                        editorOpts.source,
                        editorOpts.filter,
                        null,
                        // FIXME https://online.sbis.ru/opendoc.html?guid=b6ca9523-38ce-42d3-a3ec-36be075bccfe
                        item.editorOptions.dataLoadCallback,
                        false
                    ).then((newItems) => {
                        this._setItems(config, item, newItems);
                        return newItems;
                    });
                    loadPromises.push(result);
                }
            }
        });
        return loadPromises;
    }

    private _loadItemsFromSource(
        instance: object,
        source: ICrudPlus | HistorySource,
        filter: QueryWhereExpression<unknown>,
        navigation?: TNavigation,
        dataLoadCallback?: Function,
        withHistory: boolean = true
    ): Promise<RecordSet> {
        let queryFilter = Merge({}, filter);
        if (instance.nodeProperty) {
            queryFilter = Merge(queryFilter, { historyId: instance.historyId });
        }
        // As the data source can be history source, then you need to merge the filter
        queryFilter = withHistory ? historyUtils.getSourceFilter(queryFilter, source) : queryFilter;
        const sourceController = this._getSourceController(instance, source, navigation);
        sourceController.setFilter(queryFilter);

        return sourceController
            .load()
            .then((items: RecordSet) => {
                instance.items = items;
                if (dataLoadCallback) {
                    dataLoadCallback(items);
                }
                return items;
            })
            .catch((error) => {
                return error;
            });
    }

    private _setConfigByItem(item: IFilterItem): void {
        const options = item.editorOptions;
        this._configs[item.name] = Merge(
            this._configs[item.name] || {},
            object.clonePlain(options),
            { ignoreRegExp: /dataLoadCallback/ }
        );
        this._configs[item.name].emptyText = item.emptyText;
        this._configs[item.name].emptyKey = item.hasOwnProperty('emptyKey') ? item.emptyKey : null;
        this._configs[item.name].sourceController = null;
        this._configs[item.name].popupItems = null;
    }

    private _loadItems(item: IFilterItem): Promise<void | RecordSet> {
        const options = item.editorOptions;
        this._setConfigByItem(item);
        if (options.source) {
            return this._loadItemsFromSource(
                this._configs[item.name],
                options.source,
                options.filter,
                options.navigation,
                options.dataLoadCallback
            );
        } else {
            return Promise.resolve();
        }
    }

    private _notifyChanges(items: IFilterItem[]): void {
        this._notify('filterChanged', [this._getFilter(items)]);
        this._notify('itemsChanged', [items]);
    }

    private _getFilter(items: IFilterItem[]): QueryWhereExpression<unknown> {
        const filter = {};
        factory(items).each((item) => {
            if (this._isItemChanged(item)) {
                filter[item.name] = item.value;
            }
        });
        return filter;
    }

    private _clearConfigs(source: IFilterItem[], configs: IFilterItemConfigs): void {
        const newConfigs = object.clonePlain(configs);
        factory(newConfigs).each((config, name: string) => {
            const item = this._getItemByName(source, name);
            if (!item || !this._isFrequentItem(item)) {
                delete configs[name];
            }
        });
    }

    private _reload(
        onlyChangedItems: boolean = false,
        hasSimplePanel: boolean = true,
        items?: IFilterItem[]
    ): Promise<IFilterReceivedState> | void {
        const loadPromises = [];
        factory(items || this._source).each((item) => {
            if (this._isFrequentItem(item)) {
                if (!onlyChangedItems || this._isItemChanged(item)) {
                    if (hasSimplePanel) {
                        if (!item.textValue) {
                            const result = this._loadItems(item);
                            loadPromises.push(result);
                        } else {
                            this._setConfigByItem(item);
                        }
                    } else {
                        this._setConfigByItem(item);
                        const frequentFiltersPromises = this._loadSelectedItemsForFrequentFilters(
                            [item],
                            this._configs
                        );
                        if (frequentFiltersPromises.length) {
                            loadPromises.push(Promise.all(frequentFiltersPromises));
                        }
                    }
                }
            }
        });

        if (loadPromises.length) {
            this._loadPromise = new CancelablePromise(Promise.all(loadPromises));

            // At first, we will load all the lists in order not to cause blinking of the interface and many redraws.
            return this._loadPromise.promise
                .then(() => {
                    return this._loadSelectedItems(this._source, this._configs).then(() => {
                        this._updateText(this._source, this._configs);
                        this._loadPromise = null;
                        return {
                            configs: this._deleteHistorySourceFromConfig(this._configs),
                        };
                    });
                })
                .catch((error) => {
                    return error;
                });
        } else {
            this._updateText(this._source, this._configs);
        }
    }

    private _isHierarchyFilter(config: IFilterItemConfig): boolean {
        let result = false;
        if (config.nodeProperty) {
            result = !!this._getFolderIds(config.popupItems || config.items, config).length;
        }
        return result;
    }

    private _setValue(selectedKeys: TKey | TKey[], name: string): void {
        const config = this._configs[name];
        const item = this._getItemByName(this._source, name);
        const resetValue: TKey = object.getPropertyValue(item, 'resetValue');

        if (this._isHierarchyFilter(config)) {
            selectedKeys = this._prepareHierarchySelection(selectedKeys, config, resetValue);
        }
        let value;
        if (
            selectedKeys instanceof Array &&
            (!selectedKeys.length ||
                selectedKeys.includes(resetValue) ||
                isEqual(selectedKeys, resetValue) ||
                // empty item is selected, but emptyKey not set
                (item.emptyText && !item.hasOwnProperty('emptyKey') && selectedKeys.includes(null)))
        ) {
            value = object.getPropertyValue(item, 'resetValue');
        } else if (this._configs[name].multiSelect || this._configs[item.name].nodeProperty) {
            value = selectedKeys;
        } else {
            value = selectedKeys[0];
        }
        object.setPropertyValue(item, 'value', value);
    }

    private _getNewItems(selectedItems: Model[], config: IFilterItemConfig): Model[] {
        const newItems = [];
        const keyProperty = config.keyProperty;

        factory(selectedItems).each((item) => {
            if (item.has(keyProperty)) {
                newItems.push(item);
            }
        });
        return newItems;
    }

    private _getSelectedKeys(items: Model[], config: IFilterItemConfig): TKey[] | object {
        let selectedKeys;

        const getHierarchySelectedKeys = () => {
            // selectedKeys - { folderId1: [selected keys for folder] , folderId2: [selected keys for folder], ... }
            const folderIds = this._getFolderIds(config.items, config);
            factory(folderIds).each((folderId, index) => {
                selectedKeys[folderId] = [];
                factory(items).each((item) => {
                    if (
                        folderId === item.get(config.keyProperty) ||
                        folderId === item.get(config.parentProperty)
                    ) {
                        selectedKeys[folderId].push(item.get(config.keyProperty));
                    }
                });
            });
        };

        if (config.nodeProperty) {
            selectedKeys = {};
            getHierarchySelectedKeys();
        } else {
            selectedKeys = [];
            factory(items).each((item) => {
                selectedKeys.push(object.getPropertyValue(item, config.keyProperty));
            });
        }
        return selectedKeys;
    }

    private _getSelectedItems(items: RecordSet, selectedKeys: TKey[]): Model[] {
        const selectedItems = [];
        const flatKeys = factory(selectedKeys).flatten().value();

        factory(flatKeys).each((selectedKey) => {
            if (items.getRecordById(selectedKey)) {
                selectedItems.push(items.getRecordById(selectedKey));
            }
        });
        return selectedItems;
    }

    private _itemClick(result: IResultPopup): void {
        this._setValue(result.selectedKeys, result.id);
        if (result.textValue) {
            const item = this._getItemByName(this._source, result.id);
            item.textValue = result.textValue;
        }
        this._updateText(this._source, this._configs);
        this._updateHistory(result.id, result.data, result.selectedKeys);
    }

    private _prepareHierarchySelection(
        selectedKeys: TKey[],
        curConfig: IFilterItemConfig,
        resetValue: unknown
    ): object {
        const folderIds = this._getFolderIds(curConfig.items, curConfig);
        let isEmptySelection = true;
        let onlyFoldersSelected = true;

        let resultSelectedKeys = {};
        folderIds.forEach((parentKey, index) => {
            // selectedKeys - { folderId1: [selected keys for folder] , folderId2: [selected keys for folder], ... }
            const nodeSelectedKeys = selectedKeys[parentKey] || [];
            // if folder is selected, delete other keys
            if (nodeSelectedKeys.includes(parentKey)) {
                resultSelectedKeys[parentKey] = [parentKey];
            } else {
                onlyFoldersSelected = false;
                resultSelectedKeys[parentKey] = nodeSelectedKeys;
            }
            if (nodeSelectedKeys.length && !nodeSelectedKeys.includes(curConfig.emptyKey)) {
                isEmptySelection = false;
            }
        });
        if (isEmptySelection || onlyFoldersSelected) {
            resultSelectedKeys = resetValue;
        }
        return resultSelectedKeys;
    }

    private _applyClick(result: IResultPopup): void {
        factory(result.selectedKeys).each((sKey, index: string) => {
            if (sKey) {
                const curConfig = this._configs[index];
                this._setValue(sKey, index);

                const selectedItems = this._getSelectedItems(curConfig.items, sKey);
                this._updateHistory(index, selectedItems);
            }
        });

        this._updateText(this._source, this._configs);
    }

    private _selectorResult(result: IResultPopup): void {
        const curConfig = this._configs[result.id];
        const curItem = this._getItemByName(this._source, result.id);
        const newItems = this._getNewItems(result.data, curConfig);

        if (this._options.panelTemplateName) {
            this._updateHistory(result.id, factory(result.data).toArray());
        }
        this._setItems(curConfig, curItem, newItems);
        if (this._isHistorySource(curItem.editorOptions.source) && newItems.length) {
            curConfig.sourceController = null;
        }
        if (curItem.editorTemplateName && curItem.editorOptions.sourceController) {
            const items = this._getRecordSetBySelectorResult(
                result.data,
                curItem.editorOptions.source
            );

            if (items) {
                curItem.editorOptions.sourceController.setItems(items);
            }
        }
        const selectedKeys = this._getSelectedKeys(result.data, curConfig);
        this._setValue(selectedKeys, result.id);
        this._updateText(this._source, this._configs);
    }

    private _getRecordSetBySelectorResult(
        items: List<Model> | RecordSet,
        source: ICrudPlus | (ICrud & ICrudPlus) | HistorySource
    ): RecordSet {
        if (items instanceof RecordSet) {
            return items;
        } else if (items.getCount()) {
            const newItems = new RecordSet({
                adapter: source.getAdapter(),
                model: source.getModel(),
                format: items.at(0).getFormat(),
                keyProperty: source.keyProperty,
            });
            newItems.assign(items);
            return newItems;
        }
    }

    private _moreButtonClick(result: IResultPopup): void {
        this._idOpenSelector = result.id;
        this._configs[result.id].initSelectorItems = result.selectedItems;
    }

    private _collapsedFiltersChanged(result: object): void {
        this._collapsedFilters = result.collapsedFilters;
    }

    private _updateHierarchyHistory(
        currentFilter: IFilterItemConfig,
        selectedItems: Model[],
        source: HistorySource
    ): void {
        const folderIds = this._getFolderIds(currentFilter.items, currentFilter);

        const getNodeItems = (parentKey) => {
            const nodeItems = [];

            factory(selectedItems).each((item) => {
                if (item.get(currentFilter.parentProperty) === parentKey) {
                    nodeItems.push(item);
                }
            });
            return nodeItems;
        };

        factory(folderIds).each((parentKey) => {
            const nodeHistoryItems = getNodeItems(parentKey);
            if (nodeHistoryItems.length) {
                source.update(
                    nodeHistoryItems,
                    Merge(historyUtils.getMetaHistory(), { parentKey })
                );
            }
        });
    }

    private _updateHistory(name: string, items: Model[], selectedKeys?: TKey[]): void {
        const source = this._getItemByName(this._source, name).editorOptions
            .source as HistorySource;
        if (this._isHistorySource(source)) {
            const currentFilter = this._configs[name];
            let selectedItems = items;
            if (selectedKeys) {
                selectedItems = this._getSelectedItems(currentFilter.items, selectedKeys);
            }
            if (currentFilter.nodeProperty) {
                this._updateHierarchyHistory(currentFilter, selectedItems, source);
            } else {
                source.update(selectedItems, historyUtils.getMetaHistory());
            }
            if (currentFilter.sourceController && source.getItems) {
                currentFilter.items = source.getItems();
            }
        }
    }

    private _loadDependencies(): Promise<unknown> {
        try {
            const popupLibrary = 'Controls/filterPopup';
            const detailPanelTemplateName = this._detailPanelTemplateName;
            const detailPanelTopTemplateName = this._options.detailPanelTopTemplateName;
            const extendedTemplateName =
                this._options.detailPanelTemplateOptions?.extendedTemplateName;

            if (!this._loadOperationsPanelPromise) {
                this._loadOperationsPanelPromise = Promise.all([
                    import(popupLibrary),
                    // load потому-что в detailPanelTemplateName могут
                    // передаваться значения вида Controls/filter:Popup, что не поддерживает import()
                    detailPanelTemplateName && typeof detailPanelTemplateName === 'string'
                        ? loadAsync(detailPanelTemplateName)
                        : null,
                    detailPanelTopTemplateName && typeof detailPanelTopTemplateName === 'string'
                        ? loadAsync(detailPanelTopTemplateName)
                        : null,
                    extendedTemplateName && typeof extendedTemplateName === 'string'
                        ? loadAsync(extendedTemplateName)
                        : null,
                    this._loadEditorOptions(),
                ]);
            }
            return this._loadOperationsPanelPromise.then(() => {
                return this._setEditorOptionsForFilterDescription();
            });
        } catch (e) {
            IoC.resolve('ILogger').error('_filter:View', e);
        }
    }

    private _setEditorOptionsForFilterDescription(): Promise<void> | void {
        // TODO: обработать кейсы, когда _setEditorOptionsPromise уже есть (вернуть его),
        // или если фильтры поменялись, то _setEditorOptionsPromise нужно сбросить
        this._setEditorOptionsPromise = Promise.all(
            this._source.map((item) => {
                return item.editorOptionsName ? this._getEditorOptions(item) : undefined;
            })
        );
        return this._setEditorOptionsPromise.then((editorOptions) => {
            this._source.forEach((item, index) => {
                if (item.editorOptionsName) {
                    item.editorOptions = editorOptions[index];
                    if (this._isFrequentItem(item)) {
                        this._setConfigByItem(item);
                    }
                }
            });
        });
    }

    private _getEditorOptions(item: IFilterItem): Promise<IEditorOptions> {
        const editorOptions = item.editorOptions || {};
        let resultEditorOptions;
        const loadedEditorOptions = loadSync<Function | object>(item.editorOptionsName);

        if (loadedEditorOptions instanceof Function) {
            resultEditorOptions = loadedEditorOptions(editorOptions);
            if (resultEditorOptions instanceof Promise) {
                return resultEditorOptions.then((loadedOptions) => {
                    return {
                        ...editorOptions,
                        ...loadedOptions,
                    };
                });
            } else {
                return {
                    ...editorOptions,
                    ...resultEditorOptions,
                };
            }
        } else {
            resultEditorOptions = Promise.resolve({ ...editorOptions, ...loadedEditorOptions });
        }
        return resultEditorOptions;
    }

    private _loadEditorOptions(): Promise<unknown> {
        return Promise.all<[Promise<unknown>]>(
            this._source.reduce((modules, { editorOptionsName }) => {
                if (editorOptionsName && !isLoaded(editorOptionsName)) {
                    modules.push(loadAsync(editorOptionsName));
                }
                return modules;
            }, [])
        );
    }

    private _isHistorySource(source): boolean {
        return instanceOfModule(source, 'Controls/history:Source');
    }

    private _deleteHistorySourceFromConfig(initConfig: IFilterItemConfigs): IFilterItemConfigs {
        const configs = object.clonePlain(initConfig);
        factory(configs).each((config) => {
            if (this._isHistorySource(config.source)) {
                delete config.source;
            }
        });
        return configs;
    }

    static getDefaultOptions(): Partial<IFilterViewOptions> {
        return {
            panelTemplateName: 'Controls/filterPopup:SimplePanel',
            alignment: 'right',
            itemTemplate: defaultItemTemplate,
            source: [],
            resetButtonVisibility: 'hidden',
        };
    }

    static getOptionTypes(): object {
        return {
            source: descriptor(Array),
        };
    }
}

export default FilterView;
