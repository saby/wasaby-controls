/**
 * @kaizen_zone 8005b651-a210-459a-a90d-f6ec20a122ee
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanelPopup/sticky/Sticky';
import { SyntheticEvent } from 'Vdom/Vdom';
import {
    IFilterItem,
    updateFilterDescription,
    getFilterByFilterDescription,
} from 'Controls/filter';
import { View } from 'Controls/filterPanel';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import { factory } from 'Types/chain';
import FilterPanelPopupController from 'Controls/_filterPanelPopup/sticky/Controller';
import { Controller, IValidateResult } from 'Controls/validate';
import { NewSourceController, ISourceControllerOptions } from 'Controls/dataSource';
import { MAX_ITEMS_COUNT_WITHOUT_HISTORY } from 'Controls/_filterPanelPopup/Constants';
import { TFilter } from 'Controls/interface';
import { Logger } from 'UI/Utils';
import 'css!Controls/filterPanelPopup';
import 'css!Controls/filterPopup';

interface IStickyPopup extends IControlOptions {
    items: IFilterItem[];
    filter?: TFilter;
    historyId?: string;
    orientation: string;
    headingCaption?: string;
    width: string;
    applyButtonVisible: boolean;
    extendedItemsViewMode?: 'row' | 'column';
    topTemplate?: string;
    topTemplateOptions?: object;
}

/**
 * Шаблон стики окна для панели фильтра.
 * @extends UI/Base:Control
 *
 * @public
 */

export default class Sticky extends Control<IStickyPopup> {
    protected _template: TemplateFunction = template;
    protected _headingCaption: string;
    protected _resetButtonVisible: boolean;
    protected _items: IFilterItem[];
    protected _hasBasicItems: boolean;
    protected _panelController: FilterPanelPopupController;
    protected _applyButtonVisible: boolean = false;
    protected _children: {
        filterPanel: View;
        formController: Controller;
    };

    protected _beforeMount(options: IStickyPopup): void {
        this._items = this._cloneItems(options.items);
        this._panelController = new FilterPanelPopupController({
            items: this._items,
        });
        this._initStickyFilterPanelStates(options);
        this._applyButtonVisible = options.applyButtonVisible;
        this._checkHistory(options);
    }

    protected _beforeUpdate(newOptions: IStickyPopup): void {
        if (!isEqual(this._options.items, newOptions.items)) {
            this._updateDescriptionAndCallCallbacks(
                this._cloneItems(newOptions.items),
                this._updateFilterParams.bind(this)
            );
            this._applyButtonVisible = this._panelController.isInitialFilterChanged();
            this._checkHistory(newOptions);
        }
    }

    protected _sourceChangedHandler(event: SyntheticEvent, items: IFilterItem[]): void {
        this._updateDescriptionAndCallCallbacks(items, (newFilterItems) => {
            this._updateFilterParams(newFilterItems);
            this._applyButtonVisible = this._panelController.isInitialFilterChanged();
        });
    }

    protected _initStickyFilterPanelStates(options: IStickyPopup): void {
        this._hasBasicItems = this._panelController.hasBasicItemsOnMount();
        this._headingCaption = this._getHeadingCaption(options);
        this._resetButtonVisible = this._panelController.isFilterChanged();
    }

    protected _updateStickyFilterPanelStates(options: IStickyPopup): void {
        this._hasBasicItems = this._panelController.hasBasicItems();
        this._headingCaption = this._getHeadingCaption(options);
        this._resetButtonVisible = this._panelController.isFilterChanged();
    }

    protected _updateDescriptionAndCallCallbacks(
        items: IFilterItem[],
        callback: (newItems: IFilterItem[]) => void
    ): void {
        const currentFilter = getFilterByFilterDescription(this._options.filter, this._items);
        const updatedFilter = getFilterByFilterDescription(this._options.filter, items);
        updateFilterDescription(items, currentFilter, updatedFilter, callback);
    }

    protected _collapsedGroupsChanged(
        event: SyntheticEvent,
        collapsedFilters: string[] | number[]
    ): void {
        this._notify('sendResult', [{ action: 'collapsedFiltersChanged', collapsedFilters }], {
            bubbling: true,
        });
    }

    protected _historyItemClick(event: SyntheticEvent, historyItems: IFilterItem[]): void {
        // Не надо менять state фильтра при применении истории, чтобы не вызывать перерисовку панели
        // Достаточно отдать новый фильтр в событии sendResult
        this._updateDescriptionAndCallCallbacks(historyItems, (items) => {
            this._applyFilter(null, items, historyItems);
        });
    }

    protected _applyFilter(
        event?: SyntheticEvent,
        items: IFilterItem[] = this._items,
        history?: IFilterItem[]
    ): void {
        this._validate().then((result: IValidateResult) => {
            if (this._isPassedValidation(result)) {
                this._notify('sendResult', [{ items, history }], {
                    bubbling: true,
                });
                this._notify('close', [], { bubbling: true });
            }
        });
    }

    protected _resetFilter(event: SyntheticEvent): void {
        this._children.filterPanel.resetFilter();
    }

    private _checkHistory({ items, historyId }: IStickyPopup): void {
        if (items.length >= MAX_ITEMS_COUNT_WITHOUT_HISTORY && !historyId) {
            Logger.error(
                `Controls.filterPanelPopup:Sticky: При большом количестве фильтров необходимо добавить историю,
                          указав опцию historyId в конфигурации предзагрузки данных. 
                          Подробнее: https://wi.sbis.ru/doc/platform/developmentapl/interface-development/application-configuration/create-page/accordion/content/prefetch-config/.`
            );
        }
    }

    private _getHeadingCaption({ headingCaption, orientation }: IStickyPopup): string {
        if (headingCaption) {
            if (orientation === 'horizontal') {
                return headingCaption;
            }
            Logger.error(
                `Controls.filterPanelPopup:Sticky: Для окна фильтров с orientation = vertical задана опция headingCaption.
                          Опцию допустимо задавать только при горизонтальном отображении фильтра.`
            );
        }
        return this._panelController.getHeadingCaption(this._hasBasicItems);
    }

    private _validate(): Promise<IValidateResult | Error> {
        return this._children.formController.submit();
    }

    private _isPassedValidation(result: IValidateResult): boolean {
        let isPassedValidation = true;
        factory(result).each((value) => {
            if (value) {
                isPassedValidation = false;
            }
        });
        return isPassedValidation;
    }

    private _updateFilterParams(newItems: IFilterItem[]): void {
        this._items = this._panelController.setItems(newItems);
        this._updateStickyFilterPanelStates(this._options);
    }

    private _cloneItems(items: IFilterItem[]): IFilterItem[] {
        return items.map((item) => {
            const newItem = { ...item };
            const sourceController = item.editorOptions?.sourceController;

            // При выборе на окне фильтров не должны меняться записи в панели фильтра в мастере
            // Т.к. sourceController в editorOptions передаётся по ссылке, он будет одинаковым и в окне и в мастере
            // поэтому для окна рвём ссылку и создаём новый sourceController
            if (sourceController) {
                const scItems = object.clonePlain(sourceController.getItems());
                if (newItem.editorOptions.task1190262194) {
                    newItem.editorOptions = { ...newItem.editorOptions };
                }
                newItem.editorOptions.sourceController = new NewSourceController({
                    ...(sourceController.getState() as ISourceControllerOptions),
                    items: scItems,
                });
            }

            return newItem;
        });
    }

    static defaultProps: Partial<IStickyPopup> = {
        orientation: 'vertical',
        width: 'default',
        applyButtonVisible: false,
        filter: {},
    };
}

/**
 * @name Controls/_filterPanelPopup/Sticky#items
 * @cfg {Array.<Controls/filter:IFilterItem>} Устанавливает список полей окна фильтра и их конфигурацию.
 * В числе прочего, по конфигурации определяется визуальное представление поля фильтра в составе контрола. Обязательно должно быть указано поле editorTemplateName.
 */

/**
 * @name Controls/_filterPanelPopup/Sticky#applyButtonCaption
 * @cfg {String} Текст для кнопки применения в шапке окна.
 */

/**
 * @name Controls/_filterPanelPopup/Sticky#orientation
 * @cfg {String} Ориентация панели фильтров.
 * @variant vertical Вертикальная ориентация панели. Блок истории отображается внизу.
 * @variant horizontal Горизонтальная ориентация панели. Блок истории отображается справа.
 * @default vertical
 */

/**
 * @name Controls/_filterPanelPopup/Sticky#width
 * @cfg {Controls/_popup/interface/IStackOpener/BaseSizes.typedef} Размер панели фильтров. Поддерживается стандартная линейка размеров диалоговых окон.
 * @demo Controls-ListEnv-demo/FilterPanelPopup/Sticky/Width/Index
 */

/**
 * @name Controls/_filterPanelPopup/Sticky#headingCaption
 * @cfg {String} Текст шапки окна панели фильтров.
 */

/**
 * @name Controls/_filterPanelPopup/Sticky#applyButtonVisible
 * @cfg {boolean} Настраивает видимость кнопки применения фильтров при открытии окна.
 * @default false
 */

/**
 * @name Controls/_filterPanelPopup/Sticky#topTemplate
 * @cfg {string} Путь до шабона, в котором выводится пользовательский контент, выводящийся справа от заголовка.
 * В шаблоне в опиции filterDescription будет доступна структара фильтров
 */

/**
 * @name Controls/_filterPanelPopup/Sticky#topTemplateOptions
 * @cfg {Object} Опции для контрола, который передан в {@link topTemplate}.
 */
