/**
 * @kaizen_zone 5bf318b9-a50e-48ab-9648-97a640e41f94
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_suggest/_InputController/_InputController';
import { descriptor, Model, CancelablePromise } from 'Types/entity';
import { getSwitcherStrFromData } from 'Controls/search';
import { isEqual } from 'Types/object';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IStackPopupOptions, Stack as StackOpener } from 'Controls/popup';
import type { SearchResolver as SearchResolverController } from 'Controls/search';
import { ISearchResolverOptions } from 'Controls/_search/SearchResolver';
import { NewSourceController as SourceController, ILoadDataConfig } from 'Controls/dataSource';
import { Loader, TDataConfigs, TConfigLoadResult } from 'Controls-DataEnv/dataLoader';
import { IListLoadResult } from 'Controls/dataFactory';
import { RecordSet } from 'Types/collection';
import { __ContentLayer, __PopupLayer } from 'Controls/suggestPopup';
import {
    IFilterOptions,
    INavigationOptions,
    INavigationSourceConfig,
    ISearchOptions,
    ISortingOptions,
    ISourceOptions,
    TSourceOption,
    IValidationStatusOptions,
} from 'Controls/interface';
import { PrefetchProxy, QueryWhereExpression } from 'Types/source';
import {
    ISuggest,
    IEmptyTemplateProp,
    ISuggestFooterTemplate,
    ISuggestTemplateProp,
} from 'Controls/interface';
import { IValueOptions } from 'Controls/input';
import * as ModulesLoader from 'WasabyLoader/ModulesLoader';
import { ErrorViewMode, ErrorViewConfig, ErrorController, process } from 'Controls/error';
import { Logger } from 'UI/Utils';

import Env = require('Env/Env');
import mStubs = require('Core/moduleStubs');
import clone = require('Core/core-clone');
import { Deferred } from 'Types/deferred';
import { TVisibility } from 'Controls/marker';
import { DependencyTimer } from 'Controls/popup';
import 'css!Controls/suggest';
import { detection } from 'Env/Env';

const CURRENT_TAB_META_FIELD = 'tabsSelectedKey';
const HISTORY_KEYS_FIELD = 'historyKeys';

/* if suggest is opened and marked key from suggestions list was changed,
   we should select this item on enter keydown, otherwise keydown event should be propagated as default. */
const ENTER_KEY = Env.constants.key.enter;

const PROCESSED_KEYDOWN_KEYS = {
    /* hot keys that should processed on input */
    INPUT: [Env.constants.key.esc],

    /* hot keys, that list (suggestList) will process,
   do not respond to the press of these keys when suggest is opened */
    SUGGESTIONS_LIST: [Env.constants.key.down, Env.constants.key.up, ENTER_KEY],
};

const DEPS = [
    'Controls/suggestPopup:_ListWrapper',
    'Controls/scroll:Container',
    'Controls/search:Misspell',
    'Controls/LoadingIndicator',
];

const DEFAULT_LOADER_ID = 'suggestLoader';

type Key = string | number | null;
type TState = boolean | null;
type HistoryKeys = string[] | number[] | null;
type CancelableError = Error & { canceled?: boolean };

interface IInputControllerOptions
    extends IControlOptions,
        IFilterOptions,
        ISearchOptions,
        IValidationStatusOptions,
        ISuggest,
        ISourceOptions,
        INavigationOptions<INavigationSourceConfig>,
        ISortingOptions,
        IValueOptions<string> {
    suggestState: boolean;
    autoDropDown?: boolean;
    searchErrorCallback?: Function;
    searchEndCallback?: Function;
    searchStartCallback?: Function;
    emptyTemplate?: IEmptyTemplateProp;
    historyId?: string | null;
    layerName: string;
    suggestTemplate: ISuggestTemplateProp | null;
    footerTemplate?: ISuggestFooterTemplate;
    searchValueTrim?: boolean;
    dataLoadCallback?: Function;
    setMarkerOnSearch: boolean;
    suggestListsOptions?: Record<string, ILoadDataConfig>;
    closeButtonVisible?: boolean;
}

type TSuggestDirection = 'up' | 'down';

/**
 * HOC для полей ввода с автодополнением.
 * В качестве поля ввода может использоваться любой контрол, который реализует интерфейс {@link Controls/interface:IValue}.
 * Примеры реализации вы можете посмотреть на примере контролов {@link Controls/SuggestInput поле ввода с автодополнением} и {@link Controls-ListEnv/SuggestSearch поле поиска с автодополнением}.
 *
 * @class Controls/_suggest/_InputController
 * @extends UI/Base:Control
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @mixes Controls/suggest:ISuggest
 * @implements Controls/interface:INavigation
 * @public
 *
 */

/*
 * Container for Input's that using suggest.
 *
 * @class Controls/_suggest/_InputController
 * @extends UI/Base:Control
 * @implements Controls/interface:ISearch
 * @implements Controls/interface:ISource
 * @implements Controls/interface:IFilterChanged
 * @mixes Controls/suggest:ISuggest
 * @implements Controls/interface:INavigation
 *
 * @private
 */
export default class InputContainer extends Control<IInputControllerOptions> {
    protected _template: TemplateFunction = template;

    private _inputSearchValue: string = '';
    private _searchValue: string = '';
    private _filter: QueryWhereExpression<unknown> = null;
    private _tabsSelectedKey: Key = null;
    private _historyKeys: HistoryKeys = null;
    private _searchResult: RecordSet = null;
    private _dependenciesDeferred: Promise<unknown> = null;
    private _historyLoad: Promise<unknown> = null;
    private _historyServiceLoad: Promise<unknown> = null;
    private _showContent: boolean = false;
    private _inputActive: boolean = false;
    private _suggestMarkedKey: Key = null;
    private _misspellingCaption: string = null;
    private _suggestDirection: TSuggestDirection = null;
    private _markerVisibility: TVisibility = 'onactivated';
    private _suggestOpened: boolean = null;

    private _errorController: ErrorController = null;
    private _errorConfig: ErrorViewConfig | void = null;
    private _pendingErrorConfig: ErrorViewConfig | void = null;

    private _searchResolverController: SearchResolverController = null;
    private _loadResult: TConfigLoadResult = {};
    private _searchLibraryLoader: CancelablePromise<typeof import('Controls/search')> = null;
    private _suggestTemplate: ISuggestTemplateProp = null;
    private _suggestLoader: CancelablePromise<TConfigLoadResult> = null;
    private _footerTemplate: ISuggestFooterTemplate = null;

    private _dependenciesTimer: DependencyTimer = null;

    /**
     * three state flag
     * null - loading is not initiated
     * true - loading data now
     * false - data loading ended
     */
    private _loading: TState = null;

    private _moreCount: number;
    private _input: Control;
    private _emptyTemplate: IEmptyTemplateProp | string;

    protected _children: {
        layerOpener: typeof __ContentLayer | typeof __PopupLayer;
        indicator: any;
        inputKeydown: any;
    };

    private _suggestStateNotify(
        state: boolean,
        options: IInputControllerOptions = this._options
    ): void {
        if (options.suggestState !== state) {
            this._notify('suggestStateChanged', [state]);
        } else {
            this._forceUpdate();
        }
    }

    private _getFirstItemByOrder(loadResult: TConfigLoadResult): IListLoadResult {
        return Object.values(loadResult).sort((a, b) => {
            return a.order - b.order;
        })[0];
    }

    private _getSourceController(id = this._tabsSelectedKey): SourceController {
        if (this._loadResult) {
            return (this._loadResult[id] || this._loadResult[DEFAULT_LOADER_ID])?.sourceController;
        }
    }

    private _clearCachedData(): void {
        if (this._loadResult) {
            this._loadResult = Object.keys(this._loadResult).reduce((result, key) => {
                result[key] = { ...this._loadResult[key] };
                delete result[key].sourceController;
                return result;
            }, {});
        }
    }

    private _setCloseState(): void {
        this._showContent = false;
        this._loading = null;
        this._errorConfig = null;
        this._pendingErrorConfig = null;
        this._footerTemplate = this._getFooterTemplate();

        const sourceController = this._getSourceController();
        if (this._suggestLoader) {
            this._suggestLoader.cancel();
            this._suggestLoader = null;
        }
        if (sourceController) {
            sourceController.destroy();
        }

        this._clearSearchDelayTimer();

        if (this._isValueLengthLongerThenMinSearchLength(this._inputSearchValue, this._options)) {
            this._searchResolverController?.setSearchStarted(true);
        }

        this._loadResult = null;
        this._searchResult = null;

        if (this._tabsSelectedKey !== null) {
            this._tabsSelectedKey = null;
            this._setFilter(this._options.filter);
        }
        // when closing popup we reset the cache with recent keys
        this._historyLoad = null;
        this._historyKeys = null;
        this._suggestDirection = null;
        this._setMisspellingCaption(null);
        this._markerVisibility = 'onactivated';
        this._notify('suggestClose');
    }

    private _setSuggestMarkedKey(key: Key): void {
        const currentMarkedKey = this._suggestMarkedKey;
        this._suggestMarkedKey = key;

        if (currentMarkedKey !== this._suggestMarkedKey) {
            this._notify('suggestMarkedKeyChanged', [key]);
        }
    }

    private _close(options?: IInputControllerOptions): void {
        const depDef = this._dependenciesDeferred;
        this._setCloseState();
        this._suggestStateNotify(false, options);

        if (depDef && !depDef.isReady()) {
            depDef.cancel();
            this._dependenciesDeferred = null;
        }
    }

    private _open(): Promise<void> {
        return this._loadDependencies()
            .then(() => {
                // focus can be moved out while dependencies loading
                if (this._inputActive) {
                    this._suggestStateNotify(true);
                }
            })
            .catch((error) => {
                process({ error });
                return error;
            });
    }

    private _openSuggestPopup(): void {
        // Проверка нужна из-за асинхронщины, которая возникает при моментальном расфокусе
        // поля ввода, что вызывает setCloseState, но загрузка все равно выполняется
        // и появляется невидимый попап.
        if (this._inputActive) {
            this._suggestOpened = true;
            this._notify('suggestOpen');
        }
    }

    private _closePopup(): void {
        this._children.layerOpener?.close();
    }

    private _openWithHistory(): Promise<void> {
        const openSuggestIfNeeded = (): Promise<void> => {
            if (this._historyKeys.length || this._options.autoDropDown) {
                return this._open();
            }
        };

        if (!this._historyKeys) {
            return this._loadHistoryKeys().then(() => {
                return openSuggestIfNeeded();
            });
        } else {
            this._setFilter(this._options.filter, this._options);
            return openSuggestIfNeeded();
        }
    }

    private _needLoadHistory(): boolean {
        return this._options.historyId && !this._shouldSearch(this._inputSearchValue);
    }

    private _loadHistoryKeys(): Promise<HistoryKeys> {
        return this._getRecentKeys().then((keys: string[]) => {
            const filter: QueryWhereExpression<unknown> = clone(this._options.filter || {});

            this._historyKeys = keys || [];

            if (this._historyKeys.length) {
                filter[HISTORY_KEYS_FIELD] = this._historyKeys;
            }

            this._setFilter(filter, this._options);

            return this._historyKeys;
        });
    }

    private _suggestDirectionChangedCallback(direction: TSuggestDirection): void {
        // Проверка на _suggestOpened нужна, т.к. уже может быть вызвано закрытие саггеста,
        // но попап ещё не разрушился, и может стрелять событиями, звать callback'b
        const sourceController = this._getSourceController();
        if (this._suggestOpened && sourceController) {
            this._suggestDirection = direction;
            this._notify('suggestDirectionChanged', [direction]);
            if (direction === 'up') {
                this._setItems(sourceController.getItems());
            }
        }
    }

    private _isHistoryLoading(): boolean {
        return this._historyLoad && !this._historyLoad.isReady();
    }

    private _inputActivated(event?: SyntheticEvent): Promise<void | RecordSet> {
        const target = (event?.nativeEvent?.target || this._getActiveElement()) as HTMLElement;
        const opts = this._options;
        // Если позвать activate у поля ввода на Ipad'e, фокус будет установлен не на input, а на контейнер над ним,
        // поэтому проверяем для ipad'a, если фокус пришёл в контрол, но он не на input'e, а на обёртке над ним
        // то саггест всё равно показываем
        if (
            !opts.readOnly &&
            (target.tagName === 'INPUT' ||
                (detection.isMobileIOS && target.classList.contains('controls-InputBase__field')))
        ) {
            this._loadDependencies();
            if (
                (opts.autoDropDown || opts.historyId) &&
                !opts.suggestState &&
                (opts.source || opts.suggestListsOptions) &&
                !this._isLoading() &&
                !this._isHistoryLoading()
            ) {
                return this._loadSuggestDataWithHistory();
            }
        }
        return Promise.resolve();
    }

    private _setItems(recordSet: RecordSet): void {
        if (this._suggestDirection === 'up') {
            this._getSourceController().setItems(this._reverseData(recordSet));
        } else {
            this._getSourceController().setItems(recordSet);
        }
    }

    private _getActiveElement(): Element {
        return document.activeElement;
    }

    private _hideIndicator(): void {
        if (this._children.hasOwnProperty('indicator')) {
            this._children.indicator.hide();
        }
    }
    private _searchErrback(
        error: CancelableError & {
            isCancelled?: boolean;
        }
    ): void {
        if (this._options.searchErrorCallback) {
            this._options.searchErrorCallback();
        }
        // aborting of the search may be caused before the search start, because of the delay before searching
        if (this._loading !== null) {
            this._loading = false;
            this._forceUpdate();
        }
        if (!error?.canceled && !error?.isCancelled) {
            this._hideIndicator();

            if (this._options.searchErrorCallback) {
                this._options.searchErrorCallback(error);
            }

            this.getErrorController()
                .process({
                    error,
                    theme: this._options.theme,
                    mode: ErrorViewMode.include,
                })
                .then((errorConfig: ErrorViewConfig | void): ErrorViewConfig | void => {
                    if (errorConfig) {
                        this._pendingErrorConfig = errorConfig;
                        this._open();
                    }
                });
        }
    }

    // TODO remove?
    private _isValueLengthLongerThenMinSearchLength(
        value: string,
        options: IInputControllerOptions
    ): boolean {
        return value && value.length >= options.minSearchLength;
    }

    private _shouldShowSuggest(searchResult: RecordSet): boolean {
        const hasItems = searchResult && searchResult.getCount();
        const isSuggestHasTabs = this._tabsSelectedKey !== null;

        /* do not suggest if:
         * 1) loaded list is empty and empty template option is doesn't set
         * 2) loaded list is empty and list loaded from history, expect that the list is loaded from history, because input field is empty and historyId options is set  */
        return (
            !!(
                hasItems ||
                ((!this._options.historyId || this._inputSearchValue || isSuggestHasTabs) &&
                    this._options.emptyTemplate &&
                    searchResult)
            ) && !!this._options.suggestTemplate
        );
    }

    private _processResultData(data: RecordSet): void {
        this._searchResult = data;

        if (data) {
            const metaData = data && data.getMetaData();
            const result = metaData.results;

            this._setMisspellingCaption(getSwitcherStrFromData(data));

            if (!data.getCount()) {
                this._setSuggestMarkedKey(null);
            }

            if (
                !this._options.suggestListsOptions &&
                result &&
                result.get(CURRENT_TAB_META_FIELD)
            ) {
                this._tabsSelectedKey = result.get(CURRENT_TAB_META_FIELD);
            }

            if (
                this._inputSearchValue &&
                this._getSourceController().hasMoreData('down') &&
                typeof metaData.more === 'number'
            ) {
                this._moreCount = metaData.more - data.getCount();
            } else {
                this._moreCount = undefined;
            }
            this._errorConfig = null;
        }
        if (
            !this._shouldShowSuggest(data) &&
            (this._options.suggestListsOptions || this._options.source)
        ) {
            this._close();
        }
    }

    private _prepareFilter(
        filter: QueryWhereExpression<unknown>,
        searchParam: string,
        minSearchLength: number,
        tabId: Key = this._tabsSelectedKey,
        suggestListsOptions?: Record<string, ILoadDataConfig>
    ): QueryWhereExpression<unknown> {
        const preparedFilter = clone(filter) || {};
        const inputSearchValue = this._inputSearchValue;
        const historyKeys = this._historyKeys;
        if (!suggestListsOptions && tabId !== undefined && tabId !== null) {
            preparedFilter.currentTab = tabId;
        }
        if (inputSearchValue.length < minSearchLength && historyKeys && historyKeys.length) {
            preparedFilter[HISTORY_KEYS_FIELD] = historyKeys;
        }
        preparedFilter[searchParam] =
            inputSearchValue.length >= minSearchLength ? inputSearchValue : '';

        return preparedFilter;
    }

    private _setFilter(
        filter: QueryWhereExpression<unknown>,
        options: IInputControllerOptions = this._options,
        tabId: Key = this._tabsSelectedKey
    ): void {
        const listsOptions = options.suggestListsOptions;
        const resultId = listsOptions ? tabId : void 0;
        const suggestConfig = resultId && listsOptions ? listsOptions[resultId] : void 0;
        const currentFilter = suggestConfig ? suggestConfig.filter : filter;
        this._filter = this._prepareFilter(
            currentFilter,
            options.searchParam ?? this._options.searchParam,
            options.minSearchLength,
            tabId ?? this._tabsSelectedKey,
            listsOptions
        );
        this._getSourceController()?.setFilter(this._filter);
    }

    private _getEmptyTemplate(emptyTemplate: IEmptyTemplateProp): IEmptyTemplateProp | string {
        return emptyTemplate && emptyTemplate.templateName
            ? emptyTemplate.templateName
            : emptyTemplate;
    }

    private _reverseData(rs?: RecordSet): RecordSet {
        const sourceController: SourceController = this._getSourceController();
        const recordSet: RecordSet = rs ?? sourceController.getItems();

        if (recordSet) {
            for (let i = 0; i < recordSet.getCount(); i++) {
                recordSet.move(0, recordSet.getCount() - 1 - i);
            }
        }

        return recordSet;
    }

    private _shouldSearch(value: string): boolean {
        return (
            this._inputActive && this._isValueLengthLongerThenMinSearchLength(value, this._options)
        );
    }

    private _updateSuggestState(isValueReseted: boolean = false, tabId?: string | number): boolean {
        const shouldSearch = this._shouldSearch(this._inputSearchValue);
        const shouldShowSuggest = this._shouldShowSuggest(this._getSourceController()?.getItems());
        let state = false;

        if (this._needLoadHistory() && !this._options.suggestState) {
            this._openWithHistory();
            state = true;
        } else if (
            (shouldSearch ||
                (this._options.autoDropDown && !this._options.suggestState) ||
                (!this._options.autoDropDown && this._options.suggestState && !isValueReseted)) &&
            shouldShowSuggest
        ) {
            if (!this._options.suggestListsOptions) {
                this._setFilter(this._options.filter, undefined, tabId);
            } else if (tabId) {
                this._setFilter(this._options.suggestListsOptions[tabId].filter, undefined, tabId);
            }
            this._open();
            state = true;
        } else if (!this._options.autoDropDown && (!shouldShowSuggest || !this._inputSearchValue)) {
            // autoDropDown - close only on Esc key or deactivate
            this._close();
        }

        return state;
    }

    private _getTemplatesToLoad(options: IInputControllerOptions): string[] {
        const templateNames = [...DEPS, options.layerName];
        const templatesToCheck = ['footerTemplate', 'suggestTemplate', 'emptyTemplate'];

        templatesToCheck.forEach((tpl) => {
            return templateNames.push(options[tpl]?.templateName);
        });
        if (options.suggestListsOptions) {
            const keys = Object.keys(options.suggestListsOptions);
            keys.forEach((key) => {
                templateNames.push(options.suggestListsOptions[key].footerTemplate?.templateName);
            });
        }
        return this._checkTemplateLoading(templateNames);
    }

    private _checkTemplateLoading(templateNames: string[]): string[] {
        const templatesToLoad = [];
        templateNames.forEach((templateName) => {
            if (templateName && !ModulesLoader.isLoaded(templateName)) {
                templatesToLoad.push(templateName);
            }
        });
        return templatesToLoad;
    }

    private _loadDependencies(options: IInputControllerOptions = this._options): Promise<unknown> {
        const templatesToLoad = this._getTemplatesToLoad(options);
        if (templatesToLoad.length) {
            this._dependenciesDeferred = mStubs.require(templatesToLoad);
        } else if (!this._dependenciesDeferred) {
            this._dependenciesDeferred = Promise.resolve();
        }
        return this._dependenciesDeferred;
    }

    private _setMisspellingCaption(value: string): void {
        this._misspellingCaption = value;
    }

    private _getHistoryService(): Promise<unknown> {
        if (!this._historyServiceLoad) {
            this._historyServiceLoad = new Deferred();
            import('Controls/suggestPopup').then(({ LoadService }) => {
                LoadService({
                    historyId: this._options.historyId,
                }).addCallback((result) => {
                    this._historyServiceLoad.callback(result);
                    return result;
                });
            });
        }
        return this._historyServiceLoad;
    }
    private _getRecentKeys(): Promise<unknown> {
        if (this._historyLoad) {
            return this._historyLoad;
        }

        this._historyLoad = new Deferred();

        // toDO Пока что делаем лишний вызов на бл, ждем доработки хелпера от Шубина
        this._getHistoryService().addCallback((historyService) => {
            historyService
                .query()
                .addCallback((dataSet) => {
                    if (this._isHistoryLoading()) {
                        const keys = [];
                        dataSet
                            .getRow()
                            .get('recent')
                            .each((item) => {
                                keys.push(item.get('ObjectId'));
                            });
                        this._historyLoad.callback(keys);
                    }
                })
                .addErrback(() => {
                    if (this._historyLoad) {
                        this._historyLoad.callback([]);
                    }
                });

            return historyService;
        });

        return this._historyLoad;
    }

    private async _openSelector(templateOptions: object): Promise<unknown> {
        if (
            (await this._notify('showSelector', [templateOptions, this._tabsSelectedKey])) !== false
        ) {
            // loading showAll templates_historyLoad
            return import('Controls/suggestPopup').then(() => {
                return StackOpener.openPopup(this._getSelectorOptions(templateOptions));
            });
        }
    }

    private _isInvalidValidationStatus(options: IInputControllerOptions): boolean {
        return (
            options.validationStatus === 'invalid' || options.validationStatus === 'invalidAccent'
        );
    }

    private _getSelectorOptions(templateOptions: object): IStackPopupOptions {
        const selectorTemplate = this._options.selectorTemplate;
        let selectorOptions = {
            opener: this as unknown as Control,
            template: 'Controls/suggestPopup:Dialog',
            closeOnOutsideClick: true,
            eventHandlers: {
                onResult: this._select.bind(this),
            },
            ...selectorTemplate?.popupOptions,
        };
        if (selectorTemplate) {
            selectorOptions.template = selectorTemplate.templateName;
            selectorOptions.templateOptions = selectorTemplate.templateOptions;
        } else {
            selectorOptions = { ...selectorOptions, ...templateOptions };
        }
        return selectorOptions;
    }

    private _getTemplateOptions(
        filter: QueryWhereExpression<unknown>,
        searchValue: string
    ): IStackPopupOptions {
        delete filter[HISTORY_KEYS_FIELD];
        return {
            templateOptions: {
                filter,
                searchValue,
                template: 'Controls/suggestPopup:_ListWrapper',
                templateOptions: {
                    filter,
                    templateName: this._options.suggestTemplate.templateName,
                    templateOptions: this._options.suggestTemplate.templateOptions,
                    emptyTemplate: this._emptyTemplate,
                    source: this._getSourceController().getSource(),
                    minSearchLength: this._options.autoDropDown ? 0 : this._options.minSearchLength,
                    sorting: this._options.sorting,
                    searchParam: this._options.searchParam,
                    navigation: this._options.navigation,
                    tabsSelectedKey: this._tabsSelectedKey,
                    layerName: this._options.layerName,
                    tabsSelectedKeyChangedCallback: this._tabsSelectedKeyChanged,
                    searchValue,
                    eventHandlers: {
                        onResult: this._select.bind(this),
                    },
                },
            },
        };
    }

    protected _beforeMount(options: IInputControllerOptions): void {
        this._loadStart = this._loadStart.bind(this);
        this._loadEnd = this._loadEnd.bind(this);
        this._tabsSelectedKeyChanged = this._tabsSelectedKeyChanged.bind(this);
        this._suggestDirectionChangedCallback = this._suggestDirectionChangedCallback.bind(this);
        this._emptyTemplate = this._getEmptyTemplate(options.emptyTemplate);
        this._inputSearchValue = options.value || '';
        this._suggestOpened = options.suggestState;
        this._suggestTemplate = this._getSuggestTemplate(options);
        this._setFilter(options.filter, options);
        this._footerTemplate = this._getFooterTemplate(options);
    }

    protected _beforeUnmount(): void {
        this._clearSearchDelayTimer();
        if (this._dependenciesDeferred && !this._dependenciesDeferred.isReady()) {
            this._dependenciesDeferred.cancel();
        }
        this._dependenciesDeferred = null;
        const sourceController = this._getSourceController();
        if (sourceController) {
            sourceController.destroy();
        }
        if (this._searchLibraryLoader) {
            this._searchLibraryLoader.cancel();
            this._searchLibraryLoader = null;
        }
        this._searchResult = null;
        this._loadStart = null;
        this._loadEnd = null;
    }

    protected _afterMount(): void {
        if (this._inputSearchValue && this._options.suggestState) {
            this._resolveSearch(this._inputSearchValue, this._options);
        }
    }

    protected _beforeUpdate(newOptions: IInputControllerOptions): void {
        const valueChanged = this._options.value !== newOptions.value;
        const valueCleared =
            valueChanged && !newOptions.value && typeof newOptions.value === 'string';
        const suggestTemplateChanged = !isEqual(
            this._options.suggestTemplate,
            newOptions.suggestTemplate
        );
        const searchByMinSearchValue = this._isValueLengthLongerThenMinSearchLength(
            newOptions.value,
            newOptions
        );
        const needSearchOnValueChanged = valueChanged && searchByMinSearchValue;
        const emptyTemplateChanged = !isEqual(
            this._options.emptyTemplate,
            newOptions.emptyTemplate
        );
        const footerTemplateChanged = !isEqual(
            this._options.footerTemplate,
            newOptions.footerTemplate
        );
        const filterChanged = !isEqual(this._options.filter, newOptions.filter);
        const sourceChanged = this._options.source !== newOptions.source;
        const suggestListsOptionsChanged = !isEqual(
            this._options.suggestListsOptions,
            newOptions.suggestListsOptions
        );
        const needUpdateSearchValue =
            (needSearchOnValueChanged || valueCleared) &&
            this._inputSearchValue !== newOptions.value;
        const isSuggestOpened = newOptions.suggestState;

        let updateResult;

        if (
            !(filterChanged || needSearchOnValueChanged || sourceChanged) &&
            suggestTemplateChanged
        ) {
            this._suggestTemplate = newOptions.suggestTemplate;
        }

        if (needUpdateSearchValue) {
            this._inputSearchValue = newOptions.value;
            this._searchResolverController?.setSearchStarted(searchByMinSearchValue);
        }

        if (needSearchOnValueChanged || valueCleared || filterChanged) {
            this._setFilter(newOptions.filter, newOptions);
        }

        if (
            isSuggestOpened !== this._options.suggestState ||
            (isSuggestOpened && needUpdateSearchValue)
        ) {
            if (isSuggestOpened) {
                if (needUpdateSearchValue) {
                    this._updateSuggestState();
                }
                const preparePromise = Promise.all([
                    this._loadDependencies(newOptions),
                    this._needLoadHistory() && this._loadHistoryKeys(),
                ]);
                if (
                    (!this._searchResult || needUpdateSearchValue) &&
                    !this._errorConfig &&
                    !this._pendingErrorConfig &&
                    this._hasSource()
                ) {
                    this._clearSearchDelayTimer();
                    updateResult = preparePromise.then(() => {
                        // Во время загрузки зависимостей мог быть запущен поиск
                        if (!this._isSearchDelayTimerStarted()) {
                            return this._resolveLoad(this._inputSearchValue, newOptions)
                                .then((result) => {
                                    if (!(result instanceof Error)) {
                                        this._openSuggestPopup();
                                    }
                                })
                                .catch((error) => {
                                    this._searchErrback(error);
                                });
                        }
                    });
                } else {
                    updateResult = preparePromise.then(() => {
                        this._openSuggestPopup();
                    });
                }
            } else {
                this._suggestOpened = isSuggestOpened;
                this._setCloseState();
                this._setSuggestMarkedKey(null);
            }
        }

        if ((sourceChanged || filterChanged) && (this._showContent || this._isLoading())) {
            this._clearCachedData();
            if (this._inputSearchValue) {
                this._resolveSearch(this._inputSearchValue, newOptions);
            } else {
                this._resolveLoad(null, newOptions);
            }
        }

        if (suggestListsOptionsChanged) {
            this._clearCachedData();
        }

        if (emptyTemplateChanged) {
            this._emptyTemplate = this._getEmptyTemplate(newOptions.emptyTemplate);
        }

        if (emptyTemplateChanged && isSuggestOpened) {
            this._loadDependencies(newOptions);
        }

        if (footerTemplateChanged) {
            this._loadDependencies(newOptions);
            this._footerTemplate = this._getFooterTemplate(newOptions);
        }

        if (
            this._options.searchDelay !== newOptions.searchDelay &&
            this._searchResolverController
        ) {
            this._searchResolverController.updateOptions(
                this._getSearchResolverOptions(newOptions)
            );
        }

        if (
            this._options.validationStatus !== newOptions.validationStatus &&
            this._isInvalidValidationStatus(newOptions) &&
            !this._isInvalidValidationStatus(this._options) &&
            !this._inputSearchValue
        ) {
            this._close(newOptions);
        }

        return updateResult;
    }

    protected _afterUpdate(): void {
        if (this._showContent && this._pendingErrorConfig) {
            this._errorConfig = this._pendingErrorConfig;
            this._pendingErrorConfig = null;
        }
        if (this._options.suggestState && !this._loading && !this._showContent) {
            this._showContent = true;
        }
    }

    protected _hasSource(): boolean {
        return !!this._options.suggestListsOptions || !!this._options.source;
    }

    // TODO Нужно удалить после https://online.sbis.ru/opendoc.html?guid=403837db-4075-4080-8317-5a37fa71b64a
    inputReadyHandler(_: Event, input: Control): void {
        this._input = input;
    }

    private _getFooterTemplate(
        options: IInputControllerOptions = this._options,
        tabId?: Key
    ): ISuggestFooterTemplate {
        if (options.suggestListsOptions) {
            const key = tabId || Object.keys(options.suggestListsOptions)[0];
            return options.suggestListsOptions[key].footerTemplate || options.footerTemplate;
        } else {
            return options.footerTemplate;
        }
    }

    private _isDefaultFooter(): boolean {
        return this._options.footerTemplate.templateName === 'Controls/suggestPopup:FooterTemplate';
    }

    private _getSuggestTemplate({
        suggestTemplate,
    }: IInputControllerOptions): ISuggestTemplateProp {
        if (suggestTemplate && typeof suggestTemplate.templateName !== 'string') {
            Logger.error(
                "В контрол 'Controls/suggest' передано некорректное значение опции " +
                    'suggestTemplate. Значение поля templateName должно быть строкой.',
                this
            );
        } else {
            return suggestTemplate;
        }
    }

    protected _closeHandler(event: SyntheticEvent): void {
        event.stopPropagation();
        this.activate();
        this._close();
    }

    protected _changeValueHandler(event: SyntheticEvent, value: string): Promise<void> {
        value = value || '';
        this._inputSearchValue = value;
        this._setFilter(this._filter);
        if (this._options.suggestTemplate) {
            return this._resolveSearch(value);
        }
        return Promise.resolve();
    }

    protected _inputCompletedHandler(event: SyntheticEvent, value: string): void {
        this._notify('inputCompleted', [value]);
    }

    protected _getSuggestPopupStyles(suggestWidth: number): string {
        const suggestPopupOptions = this._options.suggestPopupOptions;
        const maxWidth = suggestPopupOptions?.maxWidth;
        if (maxWidth) {
            return `min-width: ${suggestWidth}px; max-width: ${maxWidth}px`;
        } else {
            const width = suggestPopupOptions?.width || suggestWidth;
            return `width: ${width}px;`;
        }
    }

    private _resolveSearch(value: string, options?: IInputControllerOptions): Promise<void> {
        if (this._searchResolverController) {
            this._searchResolverController.resolve(value);
            return Promise.resolve();
        } else {
            return this._getSearchResolver(options)
                .then((searchResolver) => {
                    return searchResolver.resolve(value);
                })
                .catch((error) => {
                    return error;
                });
        }
    }

    private _getSearchLibrary(): Promise<typeof import('Controls/search')> {
        if (!this._searchLibraryLoader) {
            this._searchLibraryLoader = new CancelablePromise(import('Controls/search'));
        }
        return this._searchLibraryLoader.promise;
    }

    private _getSearchResolver(
        options?: IInputControllerOptions
    ): Promise<SearchResolverController> {
        let result;

        if (!this._searchResolverController) {
            if (this._searchLibraryLoader) {
                this._searchLibraryLoader.cancel();
                this._searchLibraryLoader = null;
            }
            result = this._getSearchLibrary()
                .then((searchLibrary) => {
                    const opts = options ?? this._options;
                    this._searchResolverController = new searchLibrary.SearchResolver(
                        this._getSearchResolverOptions(opts)
                    );
                    this._searchResolverController.setSearchStarted(
                        this._isValueLengthLongerThenMinSearchLength(this._searchValue, opts)
                    );
                    return this._searchResolverController;
                })
                .catch((error) => {
                    return error;
                });
        } else {
            result = Promise.resolve(this._searchResolverController);
        }

        return result;
    }

    private async _setFilterAndLoad(
        filter: QueryWhereExpression<unknown>,
        options: IInputControllerOptions = this._options,
        tabId?: Key
    ): Promise<RecordSet | void> {
        this._clearSearchDelayTimer();
        this._setFilter(filter, options, tabId);
        return this._resolveLoad(undefined, undefined, tabId);
    }

    private _getOriginalSource(source: TSourceOption): TSourceOption {
        if (source instanceof PrefetchProxy) {
            return source.getOriginal();
        } else {
            return source;
        }
    }

    private _getLoaderConfig(options: IInputControllerOptions = this._options): TDataConfigs {
        const suggestListsOptions = options.suggestListsOptions;
        const suggestOptions = options.suggestListsOptions || {
            [DEFAULT_LOADER_ID]: options,
        };
        const loaders: TDataConfigs = {};

        Object.values(suggestOptions).forEach((listOptions) => {
            const searchParam = listOptions.searchParam || options.searchParam;
            const id = listOptions.id || DEFAULT_LOADER_ID;
            // Надо переделать
            // Когда для каждой вкладки задают свой загрузчик, в фильтр активную вкладку передавать не надо
            // но когда вкладки реализованы через 1 загрузчик (просто задают source в опциях саггеста),
            // то в фильтре надо отправлять id активной вкладки
            const filter = suggestListsOptions
                ? this._prepareFilter(
                      listOptions.filter,
                      searchParam,
                      options.minSearchLength,
                      undefined,
                      suggestListsOptions
                  )
                : this._filter;
            const dataFactoryArguments = {
                ...listOptions,
                source: this._getOriginalSource(listOptions.source),
                sourceController: this._getSourceController(id),
                searchValue: this._inputSearchValue,
                historyId: null,
                filter,
                searchParam,
                minSearchLength: options.minSearchLength,
                sliceOwnedByBrowser: true,
            };

            loaders[id] = {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments,
            };
        });

        return loaders;
    }

    private _getItemByLoadResult(result: TConfigLoadResult, tabId: Key): IListLoadResult {
        let resultItem;
        if (tabId) {
            resultItem = result[tabId];
        } else if (this._options.suggestListsOptions) {
            resultItem = this._getFirstItemByOrder(result);
        }
        if (!resultItem) {
            resultItem = result[DEFAULT_LOADER_ID];
        }
        return resultItem;
    }

    private _resolveLoad(
        value?: string,
        options?: IInputControllerOptions,
        tabId: Key = this._tabsSelectedKey
    ): Promise<RecordSet | void> {
        this._loadStart();
        if (value) {
            this._inputSearchValue = value;
            return this._makeLoad(options)
                .then((result) => {
                    const resultItem = this._getItemByLoadResult(result, tabId);

                    if (resultItem.error) {
                        this._hideIndicator();
                        this._searchErrback(resultItem.error);
                        return resultItem.error;
                    }

                    if (
                        !this._tabsSelectedKey &&
                        resultItem.id &&
                        this._options.suggestListsOptions
                    ) {
                        this._tabsSelectedKey = resultItem.id;
                    }
                    const recordSet = resultItem.data;
                    this._loadEnd(recordSet);

                    if (
                        recordSet instanceof RecordSet &&
                        this._shouldShowSuggest(recordSet) &&
                        (this._inputActive || this._tabsSelectedKey !== null)
                    ) {
                        this._setItems(recordSet);
                        this._setFilter(this._options.filter);
                        this._open();
                        if (this._options.setMarkerOnSearch) {
                            this._markerVisibility = 'visible';
                        }
                    }

                    return recordSet;
                })
                .catch((error) => {
                    this._hideIndicator();
                    this._searchErrback(error);
                    return error;
                });
        } else {
            return this._performLoad(options, tabId);
        }
    }

    private _performLoad(
        options?: IInputControllerOptions,
        tabId?: Key
    ): Promise<RecordSet | void> {
        const scopeOptions = options ?? this._options;
        this._loadStart();
        return this._makeLoad(scopeOptions)
            .then((result) => {
                const { id, data, error } = this._getItemByLoadResult(
                    result,
                    tabId || this._tabsSelectedKey
                );

                if (!this._tabsSelectedKey && id && this._options.suggestListsOptions) {
                    this._tabsSelectedKey = id;
                }
                this._hideIndicator();

                if (this._inputActive || this._tabsSelectedKey !== null) {
                    // DataLoader при вызове метода load вернёт promise, который всегда зарезолвится,
                    // даже если запрос был отменён. Приходится проверять результат
                    if (data instanceof RecordSet || error) {
                        this._loadEnd(data);
                    }

                    if (data instanceof RecordSet && this._shouldShowSuggest(data)) {
                        this._setItems(data);
                        this._updateSuggestState(false, tabId);
                        return data;
                    } else if (error) {
                        this._searchErrback(error);
                        return error;
                    }
                }
                return data;
            })
            .catch((error) => {
                this._hideIndicator();
                this._searchErrback(error);
                return error;
            });
    }

    _makeLoad(options: IInputControllerOptions): Promise<TConfigLoadResult> {
        this._clearCachedData();
        const loadPromise = Loader.load(
            this._getLoaderConfig(options)
        ) as Promise<TConfigLoadResult>;
        this._suggestLoader = new CancelablePromise<TConfigLoadResult>(loadPromise);
        return this._suggestLoader.promise.then((result) => {
            this._suggestLoader = null;
            return (this._loadResult = result);
        });
    }

    _loadSuggestDataWithHistory(): Promise<RecordSet | void> {
        if (this._needLoadHistory()) {
            return this._loadHistoryKeys().then(() => {
                if (!this._destroyed) {
                    return this._performLoad(this._options);
                }
            });
        }

        return this._performLoad(this._options).then();
    }

    private _isLoading(): boolean {
        return this._loading;
    }

    private _clearSearchDelayTimer(): void {
        this._searchResolverController?.clearTimer();
    }

    private _isSearchDelayTimerStarted(): boolean {
        return !!this._searchResolverController?.isDelayTimerStarted();
    }

    private _getSearchResolverOptions(options: IInputControllerOptions): ISearchResolverOptions {
        return {
            searchDelay: options.searchDelay,
            minSearchLength: options.minSearchLength,
            searchValueTrim: options.searchValueTrim,
            searchCallback: (validatedValue: string) => {
                return this._resolveLoad(validatedValue);
            },
            searchResetCallback: this._searchResetCallback.bind(this),
        };
    }

    private _searchResetCallback(): Promise<void> {
        if (this._updateSuggestState(true) || this._options.autoDropDown) {
            const filter = clone(this._filter) || {};
            delete filter[this._options.searchParam];
            this._setFilter(filter);
            return this._loadSuggestDataWithHistory()
                .then((recordSet) => {
                    if (recordSet instanceof RecordSet) {
                        this._setItems(recordSet);
                        this._loadEnd(recordSet);
                    }
                })
                .catch((e) => {
                    if (!e.isCanceled) {
                        return e;
                    }
                })
                .finally(() => {
                    this._searchValue = '';
                    this._loading = false;
                });
        } else if (this._showContent) {
            this._close();
        }
    }

    protected _inputActivatedHandler(event: SyntheticEvent): Promise<void | RecordSet> {
        this._inputActive = true;
        if (!this._isInvalidValidationStatus(this._options) && !this._options.openSuggestOnClick) {
            return this._inputActivated();
        }
        return Promise.resolve();
    }

    protected _inputDeactivated(): void {
        this._inputActive = false;
    }

    protected _inputClicked(event: SyntheticEvent<MouseEvent>): Promise<void> {
        this._inputActive = true;
        if (!this._options.suggestState || this._options.openSuggestOnClick) {
            return this._inputActivated(event);
        }
        return Promise.resolve();
    }

    protected _inputMouseEnterHandler(event: SyntheticEvent): void {
        if (this._options.autoDropDown) {
            if (!this._options.readOnly) {
                if (!this._dependenciesTimer) {
                    this._dependenciesTimer = new DependencyTimer();
                }
                this._dependenciesTimer.start(this._loadDependencies.bind(this));
            }

            if (!this._filter) {
                this._resolveLoad();
            }
        }
    }

    protected _inputMouseLeaveHandler(): void {
        this._dependenciesTimer?.stop();
    }

    protected _tabsSelectedKeyChanged(tabId: Key): Promise<void | RecordSet> | void {
        const changeTabCallback = () => {
            // move focus from tabs to input, after change tab
            this.activate();

            /* because activate() does not call _forceUpdate and _tabsSelectedKeyChanged is callback function,
            we should call _forceUpdate, otherwise child controls (like suggestionsList) does not get new filter */
            this._forceUpdate();
        };
        this._setSuggestMarkedKey(null);

        // change only filter for query, tabSelectedKey will be changed after processing query result,
        // otherwise interface will blink
        if (this._tabsSelectedKey !== tabId) {
            if (this._options.suggestListsOptions) {
                if (!this._isLoading() && !this._isSearchDelayTimerStarted()) {
                    this._tabsSelectedKey = tabId;
                    this._footerTemplate = this._getFooterTemplate(this._options, tabId);
                    this._processResultData(this._loadResult[this._tabsSelectedKey].data);
                }

                changeTabCallback();
            } else {
                this._clearCachedData();
                this._showIndicator();
                this._setFilterAndLoad(this._options.filter, this._options, tabId).finally(() => {
                    changeTabCallback();
                    this._tabsSelectedKey = tabId;
                });
            }
        } else {
            changeTabCallback();
        }
    }

    protected _select(event: SyntheticEvent, item: Model): void {
        const newItem = item || event;
        const tabsSelectedKey = this._tabsSelectedKey;

        this._close();
        this._closePopup();
        this._notify('choose', [newItem, tabsSelectedKey]);

        if (this._options.historyId) {
            this._getHistoryService().addCallback((historyService) => {
                historyService.update(newItem, { $_history: true });
                historyService.destroy();
                this._historyServiceLoad = null;
                return historyService;
            });
        }
    }

    protected _markedKeyChangedHandler(event: SyntheticEvent, key: string): void {
        this._setSuggestMarkedKey(key);
    }

    protected _loadStart(): void {
        this._loading = true;
        if (this._options.searchStartCallback) {
            this._options.searchStartCallback();
        }
    }

    protected _loadEnd(result?: RecordSet | Error): void {
        if (this._loading) {
            this._loading = false;

            // _searchEnd may be called synchronously, for example, if local source is used,
            // then we must check, that indicator was created
            if (this._children.hasOwnProperty('indicator')) {
                this._children.indicator.hide();
            }
        }
        if (!result?.isCanceled) {
            this._searchValue = this._inputSearchValue;
        }
        this._processResultData(result);
        if (this._options.searchEndCallback) {
            this._options.searchEndCallback();
        }
        this._suggestTemplate = this._options.suggestTemplate;
    }

    _showIndicator(): void {
        if (this._children.hasOwnProperty('indicator')) {
            this._children.indicator.hide();
            this._children.indicator.show();
        }
    }

    getErrorController(): ErrorController {
        if (!this._errorController) {
            this._errorController = new ErrorController({});
        }
        return this._errorController;
    }

    protected _showAllClick(): void {
        const filter = clone(this._filter) || {};

        filter[this._options.searchParam] = '';
        this._openSelector(this._getTemplateOptions(filter, ''));
        this._close();
    }

    protected _moreClick(): void {
        this._openSelector(this._getTemplateOptions(this._filter, this._inputSearchValue));
        this._close();
    }

    protected _misspellClick(): Promise<void> {
        // Return focus to the input field by changing the keyboard layout
        this.activate();
        this._notify('valueChanged', [this._misspellingCaption]);
        return this._changeValueHandler(null, this._misspellingCaption).then(() => {
            this._setMisspellingCaption('');
        });
    }

    protected _keydown(event: SyntheticEvent<KeyboardEvent>): void {
        const eventKeyCode = event.nativeEvent.keyCode;
        const isInputKey = PROCESSED_KEYDOWN_KEYS.INPUT.indexOf(eventKeyCode) !== -1;
        const isListKey =
            eventKeyCode === ENTER_KEY
                ? this._suggestMarkedKey !== null
                : PROCESSED_KEYDOWN_KEYS.SUGGESTIONS_LIST.indexOf(eventKeyCode) !== -1;

        if (this._options.suggestState) {
            if (isListKey || isInputKey) {
                event.preventDefault();
                event.stopPropagation();
            }

            if (!this._loading) {
                if (isListKey) {
                    if (this._children.inputKeydown) {
                        this._children.inputKeydown.start(event);

                        // The container with list takes focus away to catch "enter", return focus to the input field.
                        // toDO https://online.sbis.ru/opendoc.html?guid=66ae5218-b4ba-4d6f-9bfb-a90c1c1a7560
                        if (this._input) {
                            this._input.activate();
                        } else {
                            this.activate();
                        }
                    }
                } else if (isInputKey) {
                    if (eventKeyCode === Env.constants.key.esc) {
                        this._close();
                    }
                }
            }
        }
    }

    closeSuggest(): void {
        this._close();
    }

    static getOptionTypes(): object {
        return {
            searchParam: descriptor(String).required(),
        };
    }

    static getDefaultOptions(): object {
        return {
            emptyTemplate: {
                templateName: 'Controls/suggestPopup:EmptyTemplate',
            },
            footerTemplate: {
                templateName: 'Controls/suggestPopup:FooterTemplate',
            },
            suggestStyle: 'default',
            suggestState: false,
            minSearchLength: 3,
            searchDelay: 500,
            setMarkerOnSearch: true,
            openSuggestOnClick: false,
            closeButtonVisible: true,
        };
    }
}

/**
 * @name Controls/_suggest/_InputController#content
 * @cfg {UI/Base:TemplateFunction} Поле ввода, для которого надо показать автодополнение.
 * @remark Контрол, переданный в опцию content должен реализовывать интерфейс {@link Controls/interface:IValue}
 * @example
 * WML:
 * <pre>
 *    <Controls.suggest:_InputController source="{{_source}}" searchParam="name">
 *        <Controls.input:Text/>
 *    </Controls.suggest:_InputController>
 * </pre>
 * @see suggestTemplate
 * @see Controls/SuggestInput
 * @see Controls-ListEnv/SuggestSearch
 */
