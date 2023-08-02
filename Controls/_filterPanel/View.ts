/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanel/View/View';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TemplateFunction } from 'UI/Base';
import { GroupItem, IItemPadding } from 'Controls/display';
import { IFilterItem, isEqualItems, resetFilterItem } from 'Controls/filter';
import { IItemActionsOptions } from 'Controls/itemActions';
import { default as ViewModel, IFilterViewModelOptions } from './View/ViewModel';
import { object } from 'Types/util';
import * as coreClone from 'Core/core-clone';
import { Logger } from 'UI/Utils';
import { StickyOpener } from 'Controls/popup';
import {
    IPropStorageOptions,
    IItemsContainerPaddingOption,
    TStoreImport,
} from 'Controls/interface';
import FilterConfigurationController from './View/Configuration/Controller';
import * as extendedTemplate from 'Controls/_filterPanel/ExtendedItems';
import 'css!Controls/filterPanel';
import { loadSync } from 'WasabyLoader/ModulesLoader';
import { isEqual } from 'Types/object';
import type {PropertyGrid} from 'Controls/propertyGrid';

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};
/**
 * Контрол "Панель фильтра с набираемыми параметрами".
 * @class Controls/_filterPanel/View
 * @extends UI/Base:Control
 * @demo Controls-ListEnv-demo/FilterPanel/View/Index
 * @cssModifier controls-FilterPanel__air Добавляет стандартный отступ сверху для панели фильтров.
 *
 * @public
 */

/**
 * @name Controls/_filterPanel/View#source
 * @cfg {Array.<Controls/filter:IFilterItem>} Устанавливает список полей фильтра и их конфигурацию.
 * В числе прочего, по конфигурации определяется визуальное представление поля фильтра в составе контрола. Обязательно должно быть указано поле editorTemplateName.
 * @demo Controls-ListEnv-demo/FilterPanel/View/Index
 */

/**
 * Значения для режима отображения редакторов на панели фильтров.
 * @typedef {String} TEditorsViewMode
 * @variant cloud Отображение в виде облачков
 * @variant default Отображение в виде списков
 * @variant popupCloudPanelDefault В области отобранных параметров редакторы отображаются в виде списков, в области дополнительных параметров ("Можно отобрать") в виде облачков
 */

/**
 * @name Controls/_filterPanel/View#editorsViewMode
 * @cfg {TEditorsViewMode} Режим отображения редакторов на панели фильтров.
 */

/**
 * @name Controls/_filterPanel/View#useScroll
 * @cfg {boolean} Устанавливает наличие скролла в панели фильтров.
 * @default true
 */

/**
 * @name Controls/_filterPanel/View#extendedItemsViewMode
 * @cfg {string} Определяет компоновку фильтров в области "Можно отобрать".
 * @variant row Все фильтры размещаются в строку. При недостатке места, фильтр будет перенесён на следующую строку.
 * @variant column Все фильтры размещаются в двух колонках. При недостатке места, фильтр обрезается троеточием.
 * @default column
 * @remark Вариант компоновки <b>row</b> рекомендуется использовать, когда набор фильтров в области "Можно отобрать" определяется динамически (например набор фильтров определяет пользователь).
 * @demo Engine-demo/Controls-widgets/FilterView/ExtendedItemsViewMode/Index
 */

/**
 * @name Controls/_filterPanel/View#orientation
 * @cfg {String} Ориентация панели фильтрации.
 * @variant vertical Вертикальная ориентация панели. Блок истории отображается внизу.
 * @variant horizontal Горизонтальная ориентация панели. Блок истории отображается справа.
 * @default vertical
 * @remark
 * Если указано значение "horizontal", но на панели нет истории фильтрации, контрол будет отображаться в одном столбце.
 * @example
 * В данном примере панель будет отображаться в две колонки.
 * <pre class="brush: html; highlight: [3]">
 * <Controls.filterPanel:View
 *    source="{{_source}}"
 *    orientation="horizontal"
 *  />
 * </pre>
 */

/**
 * @name Controls/_filterPanel/View#extendedTemplateName
 * @cfg {String} Имя шаблона для области "Можно отобрать" {@link Controls/filterPanel:IExtendedItems}.
 * @remark Контрол, который лежит в области "Можно отобрать" должен поддерживать следующий контракт:
 * - принимать опцию typeDescription, в которой передаётся структура фильтров
 * - принимать опцию editingObject, в которой передаётся объект фильтра
 * - при изменении фильтров стрелять событием edinigObjectChanged
 *
 * Для реализации блока "Можно отобрать" рекомендуется использовать {@link Controls/filterPanel:DefaultExtendedTemplate раскладку},
 * которая реализует отображение заголовка блока и правильные отступы.
 * @example
 * <pre class="brush: html">
 *     <Controls-ListEnv.filter:View
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

/**
 * @event Controls/_filterPanel/View#filterChanged Происходит при изменении фильтра.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Object} filter Новый фильтр.
 * @see sourceChanged
 */

/**
 * @event Controls/_filterPanel/View#sourceChanged Происходит при изменении структуры фильтра.
 * @param {UI/Events:SyntheticEvent} eventObject Дескриптор события.
 * @param {Array.<Controls/filter:IFilterItem>} items Новая структура фильтра.
 * @see filterChanged
 */

export type TPanelViewMode = 'default' | 'popup';

export type TPanelOrientation = 'horizontal' | 'vertical';

export interface IViewPanelOptions
    extends IItemActionsOptions,
        IFilterViewModelOptions,
        IPropStorageOptions,
        IControlOptions {
    backgroundStyle?: string;
    viewMode?: TPanelViewMode;
    useStore?: boolean;
    orientation?: TPanelOrientation;
    resetButtonVisible?: boolean;
    itemsContainerPadding?: IItemsContainerPaddingOption;
    extendedTemplateName?: string;
}

export default class View extends Control<IViewPanelOptions> {
    protected _template: TemplateFunction = template;
    protected _defaultExtendedTemplate: Function = extendedTemplate;
    protected _itemPadding: IItemPadding = {
        bottom: 'null',
    };
    protected _children: {
        propertyGrid: PropertyGrid,
    };
    protected _viewModel: ViewModel = null;
    protected _configurationController: FilterConfigurationController = null;
    protected _settingsPopupOpener: StickyOpener;
    private _resetCallbackId: string;
    private _resizeAfterUpdate: boolean;

    protected _beforeMount(options: IViewPanelOptions): void {
        this._checkSourceOption(options.source);
        this._viewModel = new ViewModel(this._getViewModelOptions(options));
        this._configurationController = new FilterConfigurationController({
            propStorageId: options.propStorageId,
            viewMode: options.viewMode,
            editorsViewMode: options.editorsViewMode,
        });
    }

    private _checkSourceOption(source: IFilterItem[]): void {
        const isItemIdSet = source.some((item) => {
            return item.hasOwnProperty('id');
        });
        if (isItemIdSet) {
            Logger.error(
                'FilterPanel: В записи используется устаревшая опция id. Для установки ключа записи используйте name.',
                this
            );
        }
    }

    protected _afterMount(options: IViewPanelOptions): void {
        if (options.useStore) {
            this._resetCallbackId = getStore().declareCommand(
                'resetFilter',
                this.resetFilter.bind(this)
            );
        }
    }

    protected _beforeUpdate(options: IViewPanelOptions): void {
        this._viewModel.update(this._getViewModelOptions(options));
        this._configurationController.update({
            propStorageId: options.propStorageId,
            viewMode: options.viewMode,
            editorsViewMode: options.editorsViewMode,
        });
    }

    private _getViewModelOptions(options: IViewPanelOptions): IFilterViewModelOptions {
        return {
            source: coreClone(options.source),
            collapsedGroups: options.collapsedGroups,
            filterViewMode: options.viewMode,
            editorsViewMode: options.editorsViewMode,
            style: options.style,
            propStorageId: options.propStorageId,
            multiSelect: options.multiSelect,
            isAdaptive: options.isAdaptive,
            orientation: options.orientation,
        };
    }

    protected _afterUpdate(): void {
        if (this._resizeAfterUpdate) {
            this._notify('controlResize', [], { bubbling: true });
            this._resizeAfterUpdate = false;
        }
    }

    protected _beforeUnmount(): void {
        if (this._options.useStore) {
            getStore().unsubscribe(this._resetCallbackId);
        }
        if (this._settingsPopupOpener) {
            this._settingsPopupOpener.destroy();
        }
    }

    protected _historyItemClick(event: SyntheticEvent, historyItems: IFilterItem[]): void {
        const newItems = this._getUpdatedSource(
            this._options.source.map((item) => {
                return item.doNotSaveToHistory ? { ...item } : resetFilterItem({ ...item });
            }),
            historyItems
        );
        this._notify('historyItemClick', [newItems]);
    }

    protected _getSettingsPopupOpener(): StickyOpener {
        if (!this._settingsPopupOpener) {
            this._settingsPopupOpener = new StickyOpener();
        }
        return this._settingsPopupOpener;
    }

    protected _editingObjectChanged(
        event: SyntheticEvent,
        editingObject: Record<string, unknown>
    ): void {
        this._viewModel.setEditingObject(editingObject);
        this._notifyChanges();
    }

    protected _extendedEditingObjectChanged(
        event: SyntheticEvent,
        editingObject: Record<string, unknown>
    ): void {
        const viewModel = this._viewModel;

        if (viewModel.hasBasicItems()) {
            const currentEditingObject = viewModel.getEditingObject();
            const changedFilterName = Object.keys(currentEditingObject).find((filterName) => {
                return !isEqual(currentEditingObject[filterName], editingObject[filterName]);
            });
            this._children.propertyGrid.setFocusedEditor(changedFilterName);
        }

        viewModel.setEditingObject(editingObject);

        // После выбора контрол из "Можно отобрать" будет удален,
        // система фокусов попытается восстановить потерянный фокус на extendedItems.
        // Во время перестроения часть панели может быть за пределами экрана, и фокусировка вызовет подскрол страницы.
        // Для того чтобы избежать потери фокуса зовем activate
        this.activate();
        this._configurationController.saveSettings(viewModel.getSource());
        this._notifyChanges();
    }

    protected _groupClick(
        e: SyntheticEvent,
        dispItem: GroupItem<string>,
        clickEvent: SyntheticEvent<MouseEvent>
    ): void {
        const isResetClick = clickEvent?.target.closest('.controls_filterPanel__resetButton');
        if (isResetClick) {
            this._resetFilterItem(dispItem);
            this._notifyChanges();
        }
        const isExpandClick = clickEvent?.target.closest(
            '.controls-FilterViewPanel__groupExpander'
        );
        const isCaptionClick = clickEvent?.target.closest(
            '.controls-FilterViewPanel__group-content'
        );
        if (
            (isExpandClick || isCaptionClick) &&
            this._options.editorsViewMode === 'popupCloudPanelDefault'
        ) {
            this._resetFilterItem(dispItem);
            this._viewModel.setViewModeForItem(dispItem.contents, 'extended');
            this._configurationController.saveSettings(this._viewModel.getSource());
            this._notifyChanges();
        }
    }

    protected _handleResetButtonClick(event: SyntheticEvent): void {
        const isResetClick = event?.target.closest('.controls_filterPanel__resetButton');
        if (isResetClick) {
            this.resetFilter();
        }
    }

    private _resetFilterItem(dispItem: GroupItem<string>): void {
        const itemContent = dispItem.getContents();
        this._viewModel.resetFilterItem(itemContent);
    }

    private _notifyChanges(): void {
        const newSource = this._getUpdatedSource(
            coreClone(this._options.source),
            this._viewModel.getSource()
        );
        this._notify('filterChanged', [this._viewModel.getEditingObject()]);
        this._notify('sourceChanged', [newSource]);
        this._resizeAfterUpdate = true;
    }

    private _getUpdatedSource(
        target: IFilterItem[] = [],
        source: IFilterItem[] = []
    ): IFilterItem[] {
        target.forEach((targetItem) => {
            source.forEach((sourceItem) => {
                if (isEqualItems(targetItem, sourceItem)) {
                    if (sourceItem.hasOwnProperty('value')) {
                        targetItem.value = sourceItem.value;
                    }
                    if (
                        targetItem.hasOwnProperty('viewMode') &&
                        targetItem.viewMode !== 'frequent' &&
                        this._options.editorsViewMode !== 'default'
                    ) {
                        object.setPropertyValue(targetItem, 'viewMode', sourceItem.viewMode);
                    }
                    if (targetItem.hasOwnProperty('textValue')) {
                        object.setPropertyValue(targetItem, 'textValue', sourceItem.textValue);
                    }
                }
            });
        });
        return target;
    }

    protected _filterConfigurationChanged(eventName: string, source: IFilterItem[]): void {
        if (eventName === 'filterConfigurationChanged') {
            const oldSource = this._options.source;
            const resultSource: IFilterItem[] = [];
            source.forEach((item) => {
                const oldItem = coreClone(
                    oldSource.find((old) => {
                        return old.name === item.name;
                    })
                );
                oldItem.order = item.order;
                oldItem.userVisibility = item.userVisibility;
                resultSource.push(oldItem);
            });

            this._notify('sourceChanged', [resultSource]);
            this._configurationController.saveSettings(source);
        }
    }

    resetFilter(): void {
        this._viewModel.resetFilter();
        this._notifyChanges();
    }

    static defaultProps: Partial<IViewPanelOptions> = {
        multiSelect: true,
        backgroundStyle: 'default',
        viewMode: 'default',
        style: 'master',
        orientation: 'vertical',
        editorsViewMode: 'default',
        resetButtonVisible: true,
        useScroll: true,
        itemsContainerPadding: {
            top: 'null',
            bottom: 'null',
            left: 'l',
            right: 'l',
        },
    };
}
