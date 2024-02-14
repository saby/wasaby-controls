/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanel/ExtendedItems/ExtendedItems';
import ViewModel, { IExtendedViewModelOptions } from './ExtendedItems/ViewModel';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TemplateFunction } from 'UI/Base';
import { IFilterItem } from 'Controls/filter';
import { isEqual } from 'Types/object';
import IExtendedPropertyValue from './_interface/IExtendedPropertyValue';
import 'css!Controls/filterPanel';

export interface IExtendedItemsOptions extends IExtendedViewModelOptions, IControlOptions {}

/**
 * Шаблон блока "Можно отобрать".
 * @private
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
