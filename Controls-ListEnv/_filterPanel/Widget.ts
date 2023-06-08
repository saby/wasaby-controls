import { TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import * as template from 'wml!Controls-ListEnv/_filterPanel/Widget';
import {
    IBackgroundStyle,
    IContrastBackground,
    TKey,
} from 'Controls/interface';
import {
    AbstractFilter,
    IInnerWidgetOptions,
} from 'Controls-ListEnv/filterBase';
import ViewModeController, { ViewModeType } from './ViewModeController';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { Logger } from 'UI/Utils';

const LOAD_CUSTOM_LINK =
    '/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-and-panel/';

export interface IFilterPanelWidgetOptions
    extends IContrastBackground,
        IBackgroundStyle,
        IInnerWidgetOptions {
    editorsViewMode?: string;
}

/**
 * Виджет - "Панель фильтров". Реализует UI для отображения и редактирования фильтра в левой колонке мастера.
 * В основе виджета лежит интерфейсный контрол {@link Controls/filterPanel:View панель фильтров}
 * @remark Строится по настройкам фильтрации, которые указаны в настройках страницы (SabyPage).
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настроке фильтров на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @class Controls-ListEnv/filterPanel:View
 * @extends Controls/filterPanel:View
 * @mixes Controls/interface:IStoreId
 * @ignoreOptions source
 * @ignoreEvents filterChanged sourceChanged
 * @ignoreMethods resetFilter
 *
 * @mixes Controls-ListEnv/filter:IFilterNames
 *
 * @public
 *
 * @demo Engine-demo/Controls-widgets/filterPanel/Base/Index
 *
 * @see Controls/filterPanel:View
 * @see Controls-ListEnv/filter:View
 * @see Controls-ListEnv/frequentFilter:Tumbler
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
        this._filterPanelSource =
            this._viewModeController.getFilterPanelSource();
        if (options.editorsViewMode === 'popupCloudPanelDefault') {
            this._resetFilterPanelItems();
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
                    this._widgetController
                        .getFilterController()
                        ?.reloadFilterItem(name);
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

        if (parentProperty) {
            const rootFilter = this._findItem(
                filterPanelSource,
                parentProperty
            );

            if (rootFilter) {
                sourceController.setRoot(rootFilter.value as TKey);
            }
        }

        if (this._options.editorsViewMode === 'popupCloudPanelDefault') {
            const changedFilterPanelItem = this._getChangedFilterPanelItem(
                this._filterPanelSource,
                filterPanelSource
            );
            this._filterPanelSource = filterPanelSource;
            if (changedFilterPanelItem.length) {
                this._updateFilterSource(changedFilterPanelItem);
            }
        } else {
            this._updateFilterSource(filterPanelSource);
        }

        if (this._editorsViewMode === 'default') {
            this._filterPanelSource =
                this._viewModeController.setFilterPanelSource(
                    this._widgetController.getFullFilterDescription(),
                    (this._widgetController.getEditorsViewMode() ||
                        this._options.editorsViewMode) as ViewModeType,
                    this._options.filterNames
                );
        }
    }

    protected _filterSourceChanged(
        filterSource: IFilterItem[],
        { filterNames }: IFilterPanelWidgetOptions
    ): void {
        if (
            this._options.editorsViewMode === 'popupCloudPanelDefault' &&
            isEqual(this._options.filterNames, filterNames)
        ) {
            this._updateEditorsOptions(filterSource);
            const changedFilterPanelItem =
                this._needResetFilterPanelItem(filterSource);
            if (changedFilterPanelItem) {
                this._resetFilterPanelItems();
            }
        } else {
            const filterItems =
                this._widgetController.getFullFilterDescription();
            this._filterPanelSource =
                this._viewModeController.updateFilterPanelSource(
                    filterItems,
                    filterNames,
                    this._options.editorsViewMode
                );
        }
    }

    private _needResetFilterPanelItem(filterSource: IFilterItem[]): boolean {
        return !!filterSource.find((sourceItem) => {
            const item = this._findItem(
                this._filterPanelSource,
                sourceItem.name
            );
            if (item) {
                return (
                    !isEqual(item.value, sourceItem.value) &&
                    !isEqual(item.value, item.resetValue)
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

    private _findItem(
        filterSource: IFilterItem[],
        itemName: string
    ): IFilterItem {
        return filterSource.find(({ name }) => {
            return name === itemName;
        });
    }

    private _updateEditorsOptions(filterSource?: IFilterItem[]): void {
        const filterPanel = object.clonePlain(this._filterPanelSource);
        filterPanel.forEach((item) => {
            item.editorOptions = this._findItem(
                filterSource,
                item.name
            ).editorOptions;
        });
        this._filterPanelSource = filterPanel;
    }

    private _resetFilterPanelItems(): void {
        const filterPanel = object.clonePlain(this._filterPanelSource);
        filterPanel.forEach((item) => {
            if (!item.doNotSaveToHistory) {
                item.value = item.editorOptions?.emptyKey || item.resetValue;
            }
        });
        this._filterPanelSource = filterPanel;
    }

    private _initViewModeController(options: IFilterPanelWidgetOptions): void {
        const filterButtonItems =
            this._widgetController.getFullFilterDescription();
        const viewMode =
            (options.editorsViewMode as ViewModeType) ||
            this._widgetController.getEditorsViewMode();
        const filterNames = options.filterNames;

        this._viewModeController = new ViewModeController(
            filterButtonItems,
            viewMode,
            filterNames
        );
        const controllerViewMode = this._viewModeController.getViewMode();
        if (controllerViewMode) {
            this._editorsViewMode = controllerViewMode;
        }
        this._resetButtonVisible =
            !!viewMode ||
            !this._viewModeController.hasFilterPopupItems(
                filterButtonItems,
                filterNames
            );
    }

    private _updateFilterPanelSource(options: IFilterPanelWidgetOptions): void {
        const filterButtonItems =
            this._widgetController.getFullFilterDescription();
        const viewMode = this._editorsViewMode as ViewModeType;
        const filterNames = options.filterNames;

        this._filterPanelSource = this._viewModeController.setFilterPanelSource(
            filterButtonItems,
            viewMode,
            filterNames
        );
    }
}

/**
 * @name Controls-ListEnv/filterPanel:View#filterNames
 * @cfg {string[]} Фильтры, которые редактируются в виджете. Передаётся в виде массива имён фильтров.
 * @example
 * <pre>
 *    <Controls-ListEnv.filterPanel:View filterNames="['Ответственный', 'Регион']" />
 * </pre>
 */
