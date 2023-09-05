import { TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import * as template from 'wml!Controls-ListEnv/_filterPanelConnected/Widget';
import { IBackgroundStyle, IContrastBackground, TKey } from 'Controls/interface';
import { AbstractFilter, IInnerWidgetOptions } from 'Controls-ListEnv/filterBase';
import ViewModeController, { ViewModeType } from './ViewModeController';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { Logger } from 'UI/Utils';

const LOAD_CUSTOM_LINK =
    '/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-and-panel/';

export interface IFilterPanelWidgetOptions
    extends IContrastBackground,
        IBackgroundStyle,
        IInnerWidgetOptions {
    editorsViewMode?: ViewModeType;
}

/**
 * Контрол - "Панель фильтров". Реализует UI для отображения и редактирования фильтра в левой колонке мастера.
 * В основе виджета лежит интерфейсный контрол {@link Controls/filterPanel:View панель фильтров}
 * @remark Строится по настройкам фильтрации, которые указаны в аргументах списочной фабрики. Подробнее можно прочитать в {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ статье}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-panel/ руководство разработчика по настройке панели фильтров}
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настройке фильтров на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @class Controls-ListEnv/filterPanelConnected:View
 * @extends Controls/filterPanel:View
 * @mixes Controls/interface:IStoreId
 * @ignoreOptions source
 * @ignoreEvents filterChanged sourceChanged
 * @ignoreMethods resetFilter
 *
 * @mixes Controls-ListEnv/filterConnected:IFilterNames
 *
 * @public
 *
 * @demo Controls-ListEnv-demo/FilterPanel/View/Base/Index
 *
 * @see Controls/filterPanel:View
 * @see Controls-ListEnv/filterConnected:View
 * @see Controls-ListEnv/frequentFilterConnected:Tumbler
 */
export default class FilterPanelWidget extends AbstractFilter<IFilterPanelWidgetOptions> {
    protected _template: TemplateFunction = template;
    protected _filterPanelSource: IFilterItem[] = null;
    protected _editorsViewMode: ViewModeType = 'default';
    protected _resetButtonVisible: boolean = true;
    private _viewModeController: ViewModeController = null;

    protected _beforeMount(options: IFilterPanelWidgetOptions): void {
        super._beforeMount(options);
        this._checkOptions(options);
        this._initViewModeController(options);
        this._filterPanelSource = this._viewModeController.getFilterPanelSource();

        const editorsViewMode = this._getEditorsViewMode(options);
        if (editorsViewMode === 'popupCloudPanelDefault') {
            this._resetFilterPanelItemsOnMount();
        }
    }

    protected _beforeUpdate(options: IFilterPanelWidgetOptions): void {
        super._beforeUpdate(options);
        this._checkOptions(options);
        if (!isEqual(options.filterNames, this._options.filterNames)) {
            this._updateFilterPanelSource(options);
        }

        const viewMode = this._viewModeController.getViewMode();
        if (this._editorsViewMode !== viewMode) {
            if (viewMode === 'default') {
                this._filterPanelSource.forEach(({ name }) => {
                    this._widgetController.getFilterController()?.reloadFilterItem(name);
                });
            }
            this._editorsViewMode = viewMode;
        }
    }

    private _checkOptions(options: IFilterPanelWidgetOptions): void {
        if (options.useStore) {
            Logger.warn(
                `Controls-ListEnv/filterPanel:View не поддерживает опцию useStore. Настройте загрузку
             данных согласно статье: ${LOAD_CUSTOM_LINK} и передайте опцию storeId. При необходимости связи по Store
             используйте Controls.filterPanel:Container и Controls.filterPanel:View`,
                this
            );
        }
        if (options.storeId === undefined) {
            Logger.warn(
                'Для работы контрола Controls-ListEnv/filterPanel:View' +
                    ' необходимо указать опцию storeId'
            );
        }
    }

    protected _filterPanelSourceChanged(
        event: SyntheticEvent,
        filterPanelSource: IFilterItem[]
    ): void {
        const sourceController = this._widgetController.getSourceController();
        const parentProperty = sourceController.getParentProperty();
        const editorsViewMode = this._getEditorsViewMode(this._options);

        if (parentProperty) {
            const rootFilter = this._findItem(filterPanelSource, parentProperty);

            if (rootFilter) {
                sourceController.setRoot(rootFilter.value as TKey);
            }
        }

        if (editorsViewMode === 'popupCloudPanelDefault') {
            const changedFilterPanelItem = this._getChangedFilterPanelItem(
                this._filterPanelSource,
                filterPanelSource
            );
            this._filterPanelSource = filterPanelSource;
            if (changedFilterPanelItem.length) {
                this._updateFilterSource(changedFilterPanelItem);
            }
        } else {
            if (this._editorsViewMode === 'default') {
                this._filterPanelSource = this._viewModeController.setFilterPanelSource(
                    filterPanelSource,
                    editorsViewMode,
                    this._options.filterNames,
                    this._widgetController.getSearchParam()
                );
            }
            this._updateFilterSource(filterPanelSource);
        }
    }

    protected _filterSourceChanged(
        filterSource: IFilterItem[],
        { filterNames }: IFilterPanelWidgetOptions
    ): void {
        const editorsViewMode = this._getEditorsViewMode(this._options);
        if (
            editorsViewMode === 'popupCloudPanelDefault' &&
            isEqual(this._options.filterNames, filterNames)
        ) {
            this._updateEditorsOptions(filterSource);
            const changedFilterPanelItem = this._needResetFilterPanelItem(filterSource);
            if (changedFilterPanelItem) {
                this._resetFilterPanelItems();
            }
        } else {
            const filterItems = this._widgetController.getFullFilterDescription();
            const newFilterPanelItems = this._viewModeController.updateFilterPanelSource(
                filterItems,
                filterNames,
                this._widgetController.getSearchParam(),
                editorsViewMode
            );
            if (editorsViewMode === 'popupCloudPanelDefault') {
                // В итемах панели на состоянии viewMode элемента может отличаться от того, что находится в конфиге
                // Чтобы фильтры не улетели в "Можно отобрать" проставим viewMode из старых итемов.
                newFilterPanelItems.forEach((panelItem) => {
                    const item = this._findItem(this._filterPanelSource, panelItem.name);
                    panelItem.viewMode = item ? item.viewMode : panelItem.viewMode;
                });

                this._updateEditorsOptions(newFilterPanelItems);
            } else {
                this._filterPanelSource = newFilterPanelItems;
            }
        }
    }

    private _needResetFilterPanelItem(filterSource: IFilterItem[]): boolean {
        return !!filterSource.find((sourceItem) => {
            const item = this._findItem(this._filterPanelSource, sourceItem.name);
            if (item) {
                return (
                    !isEqual(item.value, sourceItem.value) && !isEqual(item.value, item.resetValue)
                );
            }
        });
    }

    private _getChangedFilterPanelItem(
        oldPanelSource: IFilterItem[],
        filterPanelSource: IFilterItem[]
    ): IFilterItem[] {
        const result = [];
        filterPanelSource.find((panelItem) => {
            const oldItem = this._findItem(oldPanelSource, panelItem.name);
            if (oldItem && !isEqual(oldItem.value, panelItem.value)) {
                result.push(panelItem);
            }
        });
        return result;
    }

    private _findItem(filterSource: IFilterItem[], itemName: string): IFilterItem {
        return filterSource.find(({ name }) => {
            return name === itemName;
        });
    }

    private _updateEditorsOptions(filterSource?: IFilterItem[]): void {
        const filterPanel = this._filterPanelSource
            .filter((item) => {
                return this._findItem(filterSource, item.name);
            })
            .map((item) => {
                return { ...item };
            });
        filterPanel.forEach((filterItem) => {
            filterItem.editorOptions = { ...filterItem.editorOptions };
        });
        filterPanel.forEach((item) => {
            item.editorOptions = this._findItem(filterSource, item.name).editorOptions;
        });
        this._filterPanelSource = filterPanel;
    }

    private _resetFilterPanelItemsOnMount(): void {
        const filterPanel = this._cloneItems(this._filterPanelSource);
        filterPanel.forEach((item) => {
            if (!item.doNotSaveToHistory) {
                item.value = item.editorOptions?.emptyKey || item.resetValue;
            }
        });
        this._filterPanelSource = filterPanel;
    }

    private _resetFilterPanelItems(): void {
        const filterPanel = this._cloneItems(this._filterPanelSource);
        filterPanel.forEach((item) => {
            item.value = item.editorOptions?.emptyKey || item.resetValue;
        });
        this._filterPanelSource = filterPanel;
    }

    private _cloneItems(filterSource: IFilterItem[]): IFilterItem[] {
        return filterSource.map((item) => {
            return { ...item };
        });
    }

    private _initViewModeController(options: IFilterPanelWidgetOptions): void {
        const filterButtonItems = this._widgetController.getFullFilterDescription();
        const viewMode = this._getEditorsViewMode(options);
        const filterNames = options.filterNames;

        this._viewModeController = new ViewModeController(
            filterButtonItems,
            viewMode,
            filterNames,
            this._widgetController.getSearchParam()
        );
        const controllerViewMode = this._viewModeController.getViewMode();
        if (controllerViewMode) {
            this._editorsViewMode = controllerViewMode;
        }
        this._resetButtonVisible =
            !!viewMode ||
            !this._viewModeController.hasFilterPopupItems(filterButtonItems, filterNames);
    }

    private _updateFilterPanelSource(options: IFilterPanelWidgetOptions): void {
        const filterButtonItems = this._widgetController.getFullFilterDescription();
        const viewMode = this._editorsViewMode as ViewModeType;
        const filterNames = options.filterNames;

        this._filterPanelSource = this._viewModeController.setFilterPanelSource(
            filterButtonItems,
            viewMode,
            filterNames,
            this._widgetController.getSearchParam()
        );
    }

    private _getEditorsViewMode(options: IFilterPanelWidgetOptions): ViewModeType {
        return options.editorsViewMode || this._widgetController.getEditorsViewMode();
    }
}

/**
 * @name Controls-ListEnv/filterPanelConnected/View#filterNames
 * @cfg {string[]} Фильтры, которые редактируются в виджете. Передаётся в виде массива имён фильтров.
 * @example
 * <pre>
 *    <Controls-ListEnv.filterPanelConnected:View filterNames="['Ответственный', 'Регион']" />
 * </pre>
 */
