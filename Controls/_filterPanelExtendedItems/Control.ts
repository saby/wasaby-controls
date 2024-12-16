/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanelExtendedItems/Control';
import ViewModel, { IExtendedViewModelOptions } from './ViewModel';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TemplateFunction } from 'UI/Base';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import { IExtendedPropertyValue } from 'Controls/filterPanel';
import { IExtendedItems } from 'Controls/_filterPanelExtendedItems/IExtendedItems';
import 'css!Controls/filterPanelExtendedItems';

export interface IExtendedItemsOptions
    extends IExtendedViewModelOptions,
        IExtendedItems,
        IControlOptions {}

/**
 * Контрол, отображающий блок "Можно отобрать" с дополнительными фильтрами для панели и окна фильтров
 * @class Controls/filterPanelExtendedItems:ExtendedItems
 * @extends UI/Base:Control
 * @public
 */
export default class ExtendedItems extends Control<IExtendedItemsOptions> {
    protected _template: TemplateFunction = template;
    protected _viewModel: ViewModel = null;
    protected _expandButtonVisible: boolean;
    protected _notifyResizeAfterRender: boolean;

    protected _beforeMount(options: IExtendedItemsOptions): void {
        this._viewModel = new ViewModel(options);
        this._expandButtonVisible = this._viewModel.needToCutColumnItems();
    }

    protected _beforeUpdate(options: IExtendedItemsOptions): void {
        this._viewModel.update(options);
        this._expandButtonVisible = this._viewModel.needToCutColumnItems();
    }

    protected _afterRender(): void {
        if (this._notifyResizeAfterRender) {
            this._notify('controlResize', [], { bubbling: true });
            this._notifyResizeAfterRender = false;
        }
    }

    protected _handleExpanderClick(): void {
        this._viewModel.toggleListExpanded();
        this._notifyResizeAfterRender = true;
    }

    protected _extendedValueChanged(
        event: SyntheticEvent,
        filterItem: IFilterItem,
        itemValue: IExtendedPropertyValue
    ): void {
        if (
            !isEqual(itemValue.value, filterItem.value) ||
            itemValue.viewMode !== filterItem.viewMode
        ) {
            const editingObject = this._viewModel.getEditingObjectValue(filterItem.name, itemValue);
            this._notify('editingObjectChanged', [editingObject]);
        }
    }

    static defaultProps: Partial<IExtendedItemsOptions> = {
        extendedItemsViewMode: 'column',
    };
}

/**
 * @name Controls/FilterPanelExtendedItems#extendedItemsViewMode
 * @cfg {string} Определяет компоновку фильтров в области "Можно отобрать".
 * @variant row Все фильтры размещаются в строку. При недостатке места, фильтр будет перенесён на следующую строку.
 * @variant column Все фильтры размещаются в двух колонках. При недостатке места, фильтр обрезается троеточием.
 * @default column
 * @remark Вариант компоновки <b>row</b> рекомендуется использовать, когда набор фильтров в области "Можно отобрать" определяется динамически (например набор фильтров определяет пользователь).
 * @demo Controls-ListEnv-demo/Filter/View/DetailPanelExtendedItemsViewMode/Index
 * @demo Controls-ListEnv-demo/Filter/View/ViewMode/Extended/Index
 */
