/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanel/View/View';
import { SyntheticEvent } from 'UI/Events';
import { TemplateFunction } from 'UI/Base';
import { IItemPadding } from 'Controls/display';
import {
    IFilterItem,
    isEqualItems,
    resetFilterItem,
    IFilterItemLocalPropsInternal,
    FilterDescription,
} from 'Controls/filter';
import { default as ViewModel, IFilterViewModelOptions, TEditorsViewMode } from './View/ViewModel';
import {
    IPropStorageOptions,
    IItemsContainerPaddingOption,
    TStoreImport,
    IComponentProps,
    IContrastBackgroundOptions,
} from 'Controls/interface';
import FilterConfigurationController from './View/Configuration/Controller';
import 'css!Controls/filterPanel';
import { loadSync, loadAsync, isLoaded } from 'WasabyLoader/ModulesLoader';
import { isEqual } from 'Types/object';
import { object } from 'Types/util';
import type { PropertyGrid } from 'Controls/propertyGridBase';
import {
    FilterPanelContextProvider,
    FilterDescriptionContextProvider,
} from 'Controls/_filterPanel/View/Context';

const getStore = () => {
    return loadSync<TStoreImport>('Controls/Store');
};
const { getItemByName, getFilterItemProperty } = FilterDescription;
/**
 * Контрол позволяет отображать и редактировать параметры фильтра в области рядом со списком.
 * Используется в устаревшей схеме связывания через {@link Controls/browser:Browser} (например, в {@link /doc/platform/developmentapl/interface-development/controls/input-elements/directory/layout-selector-stack/ окнах выбора}).
 * В остальных случаях, чтобы связать фильтры со списком, используйте {@link Controls-ListEnv/filterPanelConnected:View}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /doc/platform/developmentapl/interface-development/controls/list/filter-and-search/new-filter/filter-and-panel/#deprecated-browser руководство разработчика по организации фильтрации в реестре}
 *
 * @class Controls/_filterPanel/View
 * @extends UI/Base:Control
 * @demo Controls-ListEnv-demo/FilterPanel/View/Base/Index
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
 * @variant cloud|default Отображение в виде списков. Отображения редакторов в панели фильтрв меняется на облачка,
 * если фильтр применяется из воронки фильтров. Все применённые фильтры отображаются в панели фильтра.
 * @variant popupCloudPanelDefault Отображение в виде списков.
 * В панели фильтра одновременно может быть применён только один фильтр, это значит, что при применении фильтра в одном из редакторов,
 * другие фильтры в панели будут сброшены, маркер на записи отображается так же только в одном из редакторов панели фильтра.
 */

/**
 * @name Controls/_filterPanel/View#editorsViewMode
 * @cfg {TEditorsViewMode} Режим отображения редакторов на панели фильтров.
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
    extends IFilterViewModelOptions,
        IPropStorageOptions,
        IFilterItemLocalPropsInternal,
        Omit<IComponentProps, 'style'>,
        IContrastBackgroundOptions {
    backgroundStyle?: string;
    viewMode?: TPanelViewMode;
    useStore?: boolean;
    orientation?: TPanelOrientation;
    resetButtonVisible?: boolean;
    itemsContainerPadding?: IItemsContainerPaddingOption;
    extendedTemplateName?: string;
    onFilterChanged?: (filter: Record<string, unknown>) => void;
    onSourceChanged?: (items: IFilterItem[]) => void;
    attrs?: Record<string, unknown>;
}

const LIST_EDITOR = 'Controls/filterPanel:ListEditor';
const LOOKUP_EDITOR = 'Controls/filterPanelEditors:Lookup';

export default class View extends Control<IViewPanelOptions> {
    protected _template: TemplateFunction = template;
    protected _filterPanelContextProvider = FilterPanelContextProvider;
    protected _filterDescriptionContextProvider = FilterDescriptionContextProvider;
    protected _itemPadding: IItemPadding = {
        bottom: 'null',
    };
    protected _children: {
        propertyGrid: PropertyGrid;
        columnLeft: HTMLElement;
        historyItems: HTMLElement;
    };
    protected _viewModel: ViewModel;
    protected _configurationController: FilterConfigurationController;
    protected _itemsContainerPadding: IItemsContainerPaddingOption;
    protected _columnLeftWidth: number;
    private _resetCallbackId: string;
    private _resizeAfterUpdate: boolean;
    private _nextFocusedItem: string | null;

    protected _beforeMount(options: IViewPanelOptions): void {
        this._itemsContainerPadding = options.itemsContainerPadding || {
            top: 'null',
            bottom: 'null',
            left: 'l',
            right: options.isAdaptive ? 'null' : 'l',
        };
        this._viewModel = new ViewModel(this._getViewModelOptions(options));
        this._configurationController = new FilterConfigurationController({
            propStorageId: options.propStorageId,
            filterItemLocalProperty: options.filterItemLocalProperty,
        });
        this._filterPanelContextValue = {
            filterViewMode: options.viewMode,
            editorsViewMode: options.editorsViewMode,
            contrastBackground: this._options.orientation === 'horizontal',
        };
        this._handleResetButtonClick = this._handleResetButtonClick.bind(this);
    }

    protected _afterMount(options: IViewPanelOptions): void {
        if (options.useStore) {
            this._resetCallbackId = getStore().declareCommand(
                'resetFilter',
                this.resetFilter.bind(this)
            );
        }

        if (options.orientation === 'horizontal') {
            if (this._children.historyItems) {
                // Сохраняем ширину левой колонки, чтобы избежать прыжков при применении фильтров
                this._columnLeftWidth = this._children.columnLeft.clientWidth;
            } else {
                this._columnLeftWidth = 0;
            }
        }
    }

    protected _beforeUpdate(options: IViewPanelOptions): void {
        const {
            itemsContainerPadding,
            editorsViewMode,
            source,
            propStorageId,
            filterItemLocalProperty,
            viewMode,
            orientation,
        } = options;
        const currentOptions = this._options;
        this._loadEditors(source, editorsViewMode, () => {
            if (
                itemsContainerPadding &&
                !isEqual(itemsContainerPadding, currentOptions.itemsContainerPadding)
            ) {
                this._itemsContainerPadding = itemsContainerPadding;
            }

            this._viewModel.update(this._getViewModelOptions(options));
            this._configurationController.update({
                propStorageId,
                filterItemLocalProperty,
            });
            if (
                editorsViewMode !== currentOptions.editorsViewMode ||
                viewMode !== currentOptions.viewMode ||
                orientation !== currentOptions.orientation
            ) {
                this._filterPanelContextValue = {
                    filterViewMode: viewMode,
                    editorsViewMode,
                    contrastBackground: orientation === 'horizontal',
                };
            }
        });
    }

    private _loadEditors(
        source: IFilterItem[],
        editorsViewMode: TEditorsViewMode | void,
        readyCallback: () => void
    ): void {
        const promises: Promise<unknown>[] = [];

        source.forEach(({ editorTemplateName }) => {
            let templateName = editorTemplateName;
            if (editorTemplateName === LIST_EDITOR && editorsViewMode === 'cloud') {
                templateName = LOOKUP_EDITOR;
            }
            if (templateName && !isLoaded(templateName)) {
                promises.push(loadAsync(templateName));
            }
        });

        if (promises.length) {
            Promise.all(promises).finally(readyCallback);
        } else {
            readyCallback();
        }
    }

    private _getViewModelOptions(options: IViewPanelOptions): IFilterViewModelOptions {
        return {
            source: options.source,
            collapsedGroups: options.collapsedGroups,
            filterViewMode: options.viewMode,
            editorsViewMode: options.editorsViewMode,
            style: options.style,
            propStorageId: options.propStorageId,
            multiSelect: options.multiSelect,
            isAdaptive: options.isAdaptive,
            orientation: options.orientation,
            filterItemLocalProperty: options.filterItemLocalProperty,
        };
    }

    protected _afterUpdate(): void {
        if (this._resizeAfterUpdate) {
            this._notify('controlResize', [], { bubbling: true });
            this._resizeAfterUpdate = false;
        }
        if (this._viewModel.hasBasicItems() && this._nextFocusedItem) {
            this.activate();
            this._children.propertyGrid.setFocusedEditor((this._nextFocusedItem = null));
        }
    }

    protected _beforeUnmount(): void {
        if (this._options.useStore) {
            getStore().unsubscribe(this._resetCallbackId);
        }
    }

    protected _historyItemClick(
        event: SyntheticEvent,
        historyItems: IFilterItem[],
        params: object
    ): void {
        this._notify('historyItemClick', [this._getItemsFromHistory(historyItems), params]);
    }

    private _getItemsFromHistory(historyItems: IFilterItem[]): IFilterItem[] {
        return this._getUpdatedSource(
            this._options.source.map((item) => {
                return item.doNotSaveToHistory ? { ...item } : resetFilterItem({ ...item });
            }),
            historyItems
        );
    }

    protected _editingObjectChanged(
        event: SyntheticEvent,
        editingObject: Record<string, unknown>
    ): void {
        const currentSource = this._viewModel.getSource();
        const { filterItemLocalProperty } = this._options;

        this._viewModel.setEditingObject(editingObject);
        const newSource = this._viewModel.getSource();

        const isViewModeChanged = currentSource.find((filterItem) => {
            const newFilterItem = getItemByName(newSource, filterItem.name);
            return (
                getFilterItemProperty(newFilterItem, 'viewMode', filterItemLocalProperty) !==
                getFilterItemProperty(filterItem, 'viewMode', filterItemLocalProperty)
            );
        });

        if (isViewModeChanged) {
            this._configurationController.saveSettings(newSource);
        }

        this._notifyChanges();
    }

    protected _extendedEditingObjectChanged(
        event: SyntheticEvent,
        editingObject: Record<string, unknown>
    ): void {
        const viewModel = this._viewModel;

        const currentEditingObject = viewModel.getEditingObject();
        this._nextFocusedItem =
            Object.keys(currentEditingObject).find((filterName) => {
                return !isEqual(currentEditingObject[filterName], editingObject[filterName]);
            }) || null;
        if (
            viewModel.hasBasicItems() &&
            this._nextFocusedItem &&
            'propertyGrid' in this._children
        ) {
            this._children.propertyGrid.setFocusedEditor(this._nextFocusedItem);
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

    protected _handleResetButtonClick(event: SyntheticEvent): void {
        const isResetClick = event?.target.closest('.controls_filterPanel__resetButton');
        if (isResetClick) {
            this.resetFilter();
        }
    }

    protected _getFilterItemByName(filterName: string): IFilterItem | void {
        return getItemByName(this._viewModel.getSource(), filterName);
    }

    private _notifyChanges(): void {
        const newSource = this._getUpdatedSource(
            object.clonePlain(this._options.source, { processCloneable: false }),
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
        const { filterItemLocalProperty } = this._options;
        target.forEach((targetItem) => {
            source.forEach((sourceItem) => {
                if (isEqualItems(targetItem, sourceItem)) {
                    const localItem = targetItem[filterItemLocalProperty] || targetItem;

                    if (sourceItem.hasOwnProperty('value')) {
                        targetItem.value = sourceItem.value;
                    }
                    targetItem.textValue = sourceItem.textValue;

                    if (localItem.hasOwnProperty('viewMode') && !this._isFrequentItem(localItem)) {
                        localItem.viewMode = sourceItem.viewMode;
                    }
                }
            });
        });
        return target;
    }

    private _isFrequentItem(item: IFilterItem): boolean {
        return item.viewMode === 'frequent' || item.viewMode === 'primary';
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
        filterItemLocalProperty: 'panel',
    };
}
