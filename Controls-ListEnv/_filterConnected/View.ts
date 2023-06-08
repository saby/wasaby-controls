/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UI/Vdom';
import * as template from 'wml!Controls-ListEnv/_filterConnected/View/View';
import { IFilterItem, View } from 'Controls/filter';
import { AbstractFilter, IInnerWidgetOptions } from 'Controls-ListEnv/filterBase';
import { ListSlice } from 'Controls/dataFactory';
import { isEqual } from 'Types/object';
import { Logger } from 'UI/Utils';
import { connectToDataContext } from 'Controls/context';

const LOAD_CUSTOM_LINK =
    '/doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-and-panel/';

export interface IFilterViewWidgetOptions extends IControlOptions, IInnerWidgetOptions {
    detailPanelWidth?: string;
    detailPanelTopTemplateName?: string;
    detailPanelTopTemplateOptions?: object;
    detailPanelOrientation?: 'horizontal' | 'vertical';
    detailPanelExtendedItemsViewMode?: 'column' | 'row';
}

/**
 * Контрол "Объединённый фильтр".
 * Реализует UI для отображения и редактирования фильтра с помощью контрола {@link Controls/filter:View}.
 * Может отображать окно фильтров или выступать в качестве быстрого фильтра.
 * @remark Строится по настройкам фильтрации, которые указаны в аргументах списочной фабрики. Подробнее можно прочитать в {@link /doc/platform/developmentapl/interface-development/controls/new-data-store/ статье}.
 *
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-view/ руководство разработчика по настройке контрола}
 * * {@link /doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/filter-config/ руководство разработчика по настроке фильтра на странице}
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/filter-and-search/ руководство разработчика по организации поиска и фильтрации в реестре}
 *
 * @public
 *
 * @class Controls-ListEnv/filterConnected:View
 * @extends Controls/filter:View
 * @mixes Controls/interface:IStoreId
 * @ignoreOptions detailPanelTemplateName detailPanelTemplateOptions source
 * @ignoreEvents filterChanged itemsChanged
 * @ignoreMethods openDetailPanel reset
 *
 * @mixes Controls-ListEnv/filterConnected:IFilterNames
 *
 * @demo Controls-ListEnv-demo/Filter/View/Index
 * @see Controls/filter:View
 * @see Controls-ListEnv/filterPanelConnected:Widget
 */
class FilterViewWidget extends AbstractFilter<IFilterViewWidgetOptions> {
    protected _template: TemplateFunction = template;
    protected _filterSource: IFilterItem[] = null;
    protected _showFiltersPopup: boolean = false;
    protected _detailPanelVisible: boolean = false;
    protected _resetButtonVisibility: string = 'hidden';
    protected _editorsViewMode: string;
    private _hasListItem: boolean = false;
    protected _children: {
        filterView: View;
    };

    protected _beforeMount(options: IFilterViewWidgetOptions): void {
        super._beforeMount(options);
        this._checkOptions(options);
        this._filterSourceChanged(this._widgetController.getFilterDescription());
        this._hasListItem = this._filterSource.some((item) => {
            return item.type === 'list';
        });
        this._initResetButtonVisibility();
    }

    protected _beforeUpdate(newOptions: IFilterViewWidgetOptions): void {
        super._beforeUpdate(newOptions);
        this._checkOptions(newOptions);
        if (this._getDetailPanelVisibleFromSlice(newOptions)) {
            if (!this._detailPanelVisible) {
                this._openDetailPanel();
            }
        } else {
            this._detailPanelVisible = false;
        }
    }

    protected _filterSourceChangedInternal(
        event: SyntheticEvent,
        filterSource: IFilterItem[]
    ): void {
        const isOnlyFrequentItemsChanged = this._isOnlyFrequentItemsChanged(filterSource);
        this._updateFilterSource(filterSource);
        this._filterSource = this._widgetController.getFilterDescription();

        // Если изменились только frequent фильтры - не обновляем
        if (!isOnlyFrequentItemsChanged) {
            this._updateResetButtonVisibility();
        }
        event.stopPropagation();
    }

    protected _filterSourceChanged(filterSource: IFilterItem[]): void {
        this._filterSource = filterSource;
        if (!this._isChangedFilterSource(filterSource, this._widgetController.getSearchParam())) {
            // Если фильтры изменили в окне, видимость кнопки "Сбросить" обновится в методе _filterSourceChangedInternal
            // Здесь обновляем видимость только в случае, если все фильтры сбросили из панели
            this._updateResetButtonVisibility();
        }
        this._showFiltersPopup = !!filterSource.find(({ viewMode }) => {
            return viewMode === 'basic' || viewMode === 'extended';
        });
    }

    protected _getDetailPanelName(): string {
        return this._showFiltersPopup ? 'Controls/filterPanelPopup:Sticky' : '';
    }

    private _checkOptions(options: IFilterViewWidgetOptions): void {
        if (options.useStore) {
            Logger.warn(
                `Controls-ListEnv/filter:View не поддерживает опцию useStore. Настройте загрузку данных
             согласно статье: ${LOAD_CUSTOM_LINK} и передайте опцию storeId. При необходимости связи по Store
             используйте Controls.filter:ViewContainer и Controls.filter:View`,
                this
            );
        }
        if (options.storeId === undefined) {
            Logger.warn(
                'Для работы контрола Controls-ListEnv/filter:View необходимо указать опцию storeId'
            );
        }
    }

    private _getDetailPanelVisibleFromSlice(options: IFilterViewWidgetOptions): boolean {
        const slices = this._getSlices(options);
        return !!Object.keys(slices).find((storeName) => {
            return slices[storeName].filterDetailPanelVisible;
        });
    }

    private _getSlices({
        storeId,
        _dataOptionsValue,
    }: IFilterViewWidgetOptions): Record<string, ListSlice> {
        const storeIds = Array.isArray(storeId) ? storeId : [storeId];
        return _dataOptionsValue.getStoreData(storeIds);
    }

    private _initResetButtonVisibility(): void {
        this._editorsViewMode = this._widgetController.getEditorsViewMode();
        const isChangedFilterSource = this._hasListItem &&
            this._isChangedPopupFilterSource(this._filterSource, this._widgetController.getSearchParam());
        this._resetButtonVisibility = this._getResetButtonVisible(this._editorsViewMode, isChangedFilterSource);
    }

    private _updateResetButtonVisibility(): void {
        this._resetButtonVisibility = this._isResetButtonVisibility(this._filterSource);
    }

    private _isResetButtonVisibility(filterSource: IFilterItem[]): string {
        this._editorsViewMode = this._widgetController.getEditorsViewMode();
        const isChangedFilterSource = this._hasListItem &&
            this._isChangedFilterSource(filterSource, this._widgetController.getSearchParam());
        return this._getResetButtonVisible(this._editorsViewMode, isChangedFilterSource);
    }

    private _getResetButtonVisible(editorsViewMode: string, isChanged: boolean): string {
        let result;
        if (!editorsViewMode && isChanged) {
            result = 'visible';
        } else if (
            editorsViewMode &&
            editorsViewMode !== 'popupCloudPanelDefault' &&
            isChanged
        ) {
            result = 'withoutTextValue';
        } else {
            result = 'hidden';
        }
        return result;
    }

    private _isOnlyFrequentItemsChanged(newFilterSource: IFilterItem[]): boolean {
        return newFilterSource.every((newItem) => {
            const oldItem = this._findItem(this._filterSource, newItem.name);
            return isEqual(oldItem.value, newItem.value) || newItem.viewMode === 'frequent';
        });
    }

    private _findItem(filterSource: IFilterItem[], itemName: string): IFilterItem {
        return filterSource.find(({ name }) => {
            return name === itemName;
        });
    }

    private _isChangedFilterSource(filterSource: IFilterItem[], searchParam: string): boolean {
        return filterSource.some((item) => {
            return !isEqual(item.value, item.resetValue) && item.viewMode !== 'frequent' &&
                item.visibility !== false &&
                item.name !== searchParam;
        });
    }

    private _isChangedPopupFilterSource(filterSource: IFilterItem[], searchParam: string): boolean {
        return filterSource.some((item) => {
            return !isEqual(item.value, item.resetValue) && item.viewMode !== 'frequent' &&
                item.visibility !== false &&
                item.name !== searchParam &&
                item.type !== 'list';
        });
    }

    private _openDetailPanel(): void {
        this._children.filterView.openDetailPanel();
        this._detailPanelVisible = true;
    }

    protected _detailPanelClose(): void {
        const slices = this._getSlices(this._options);
        Object.keys(slices).forEach((storeId) => {
            slices[storeId].setState({
                filterDetailPanelVisible: false,
            });
        });
    }
}

export default connectToDataContext(FilterViewWidget);

/**
 * @name Controls-ListEnv/filterConnected/View#detailPanelOrientation
 * @cfg {String} Определяет ориентацию окна фильтров.
 * @variant vertical Вертикальная ориентация панели. Блок истории отображается внизу.
 * @variant horizontal Горизонтальная ориентация панели. Блок истории отображается справа.
 * @default vertical
 * @remark
 * Если указано значение "horizontal", но на панели нет истории фильтрации, контрол будет отображаться в одном столбце.
 * @example
 * В данном примере панель будет отображаться в две колонки.
 * <pre class="brush: html; highlight: [3]">
 * <Controls-ListEnv.filterConnected:View
 *    storeId="reports"
 *    detailPanelOrientation="horizontal"/>
 * </pre>
 */

/**
 * @name Controls-ListEnv/filterConnected/View#detailPanelWidth
 * @cfg {String} Определяет ширину окна фильтров
 * @remark Поддерживается стандартная линейка размеров диалоговых окон.
 * @example
 * <pre class="brush: html; highlight: [3]">
 *    <Controls-ListEnv.filterConnected:View
 *       storeId="reports"
 *       detailPanelWidth="e"/>
 * </pre>
 */

/**
 * @name Controls-ListEnv/filterConnected/View#detailPanelExtendedItemsViewMode
 * @cfg {string} Определяет компоновку фильтров в области "Можно отобрать".
 * @variant row Все фильтры размещаются в строку. При недостатке места, фильтр будет перенесён на следующую строку.
 * @variant column Все фильтры размещаются в двух колонках. При недостатке места, фильтр обрезается троеточием.
 * @default column
 * @remark Вариант компоновки <b>row</b> рекомендуется использовать, когда набор фильтров в области "Можно отобрать" определяется динамически (например набор фильтров определяет пользователь).
 * @demo Controls-ListEnv-demo/Filter/View/DetailPanelExtendedItemsViewMode/Index
 * @demo Controls-ListEnv-demo/Filter/View/ViewMode/Extended/Index
 */

/**
 * @name Controls-ListEnv/filterConnected/View#detailPanelTopTemplateName
 * @cfg {string} Путь до шаблона, в котором выводится пользовательский контент, выводящийся справа от заголовка
 */

/**
 * @name Controls-ListEnv/filterConnected/View#detailPanelHistorySaveMode
 * @cfg {string} Режим работы с историей фильтров
 * @variant pinned По ховеру на элемент появляется команда закрепления записи.
 * @variant favorite По ховеру на элемент появляется команда добавления записи в избранное.
 */

/**
 * @name Controls-ListEnv/filterConnected/View#detailPanelTopTemplateOptions
 * @cfg {Object} Опции для контрола, который передан в {@link detailPanelTopTemplateName}.
 */

/**
 * @name Controls-ListEnv/filterConnected/View#detailPanelExtendedTemplateName
 * @cfg {Object} Путь до шаблона для области "Можно отобрать", подробнее {@link Controls/filterPanel:View#extendedTemplateName}.
 * @remark Контрол, который лежит в области "Можно отобрать" должен поддерживать следующий контракт:
 * - принимать опцию typeDescription, в которой передаётся структура фильтров
 * - принимать опцию editingObject, в которой передаётся объект фильтра
 * - при изменении фильтров стрелять событием edinigObjectChanged
 *
 * Для реализации блока "Можно отобрать" рекомендуется использовать {@link Controls/filterPanel:DefaultExtendedTemplate раскладку},
 * которая реализует отображение заголовка блока и правильные отступы.
 * @example
 * <pre class="brush: html">
 *     <Controls-ListEnv.filterConnected:View
 *                 storeId="0"
 *                 detailPanelExtendedTemplateName="MyModule/CustomExtendedTemplate"/>
 * </pre>
 *
 * MyModule/CustomExtendedTemplate.wml
 * <pre class="brush: html">
 *     <Controls.filterPanel:DefaultExtendedTemplate headingCaption="{{_options.headingCaption}}">
 *         <ws:bodyContentTemplate>
 *            <ws:for data="item in _options.typeDescription">
 *                <ws:if data="{{_isExtendedItem(item)}}">
 *                    <ws:partial template="{{item.extendedTemplateName}}"
 *                                on:click="_notifyChanges(item.name)"
 *                    />
 *                </ws:if>
 *            </for>
 *         </ws:bodyContentTemplate>
 *     </Controls.filterPanel:DefaultExtendedTemplate>
 * </pre>
 *
 * MyModule/CustomExtendedTemplate.ts
 * <pre class="brush: js">
 *      private _notifyChanges(event, filterName: string, filterValue: IExtendedPropertyValue): void {
 *           const newEditingObject = {...this._options.editingObject};
 *           newEditingObject[filterName] = {
 *               value: filterValue,
 *               viewMode: 'basic',
 *               textValue: this._getTextValue(filterValue)
 *           };
 *           this._notify('editingObjectChanged', [newEditingObject]);
 *      }
 * </pre>
 * @demo Controls-ListEnv-demo/Filter/View/DetailPanelExtendedTemplateName/Index
 * @see Controls/filterPanel:DefaultExtendedTemplate
 */
