/**
 * @kaizen_zone 620ede61-d6a1-43c3-b811-f368d16d19f5
 */
import { Control, IControlOptions } from 'UI/Base';
import * as template from 'wml!Controls/_filterPanel/ExtendedItems/ExtendedItems';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TemplateFunction } from 'UI/Base';
import { IFilterItem } from 'Controls/filter';
import { default as ViewModel } from 'Controls/_filterPanel/View/ViewModel';
import { isEqual } from 'Types/object';
import IExtendedPropertyValue from './_interface/IExtendedPropertyValue';
import 'css!Controls/filterPanel';

interface IExtendedItemsOptions extends IControlOptions {
    viewModel: ViewModel;
    extendedItemsViewMode: string;
}

export default class ExtendedItems extends Control<IExtendedItemsOptions> {
    protected _template: TemplateFunction = template;
    protected _viewModel: ViewModel = null;
    protected _expandButtonVisible: boolean;
    protected _additionalListExpanded: boolean = false;
    protected _additionalColumns: object;
    protected _notifyResizeAfterRender: boolean;

    protected _beforeMount(options: IExtendedItemsOptions): void {
        this._viewModel = options.viewModel;
        this._additionalColumns = this._viewModel.getAdditionalColumns(
            this._additionalListExpanded
        );
        this._expandButtonVisible = this._viewModel.needToCutColumnItems();
    }

    protected _beforeUpdate(options: IExtendedItemsOptions): void {
        this._additionalColumns = this._viewModel.getAdditionalColumns(
            this._additionalListExpanded
        );
        this._expandButtonVisible = this._viewModel.needToCutColumnItems();
    }

    protected _afterRender(options: IExtendedItemsOptions): void {
        if (this._notifyResizeAfterRender) {
            this._notify('controlResize', [], { bubbling: true });
            this._notifyResizeAfterRender = false;
        }
    }

    protected _handleExpanderClick(): void {
        this._additionalListExpanded = !this._additionalListExpanded;
        this._additionalColumns = this._viewModel.getAdditionalColumns(
            this._additionalListExpanded
        );
        this._notifyResizeAfterRender = true;
    }

    protected _extendedValueChanged(
        event: SyntheticEvent,
        filterItem: IFilterItem,
        itemValue: IExtendedPropertyValue
    ): void {
        if (!isEqual(itemValue.value, filterItem.value)) {
            this._viewModel.setEditingObjectValue(filterItem.name, itemValue);
            this._notify('extendedItemsChanged');
        } else if (itemValue.viewMode !== filterItem.viewMode) {
            this._viewModel.setViewModeForItem(
                filterItem.name,
                itemValue.viewMode
            );
            this._notify('extendedItemsChanged');
        }
    }

    static defaultProps: Partial<IExtendedItemsOptions> = {
        extendedItemsViewMode: 'column',
    };
}
