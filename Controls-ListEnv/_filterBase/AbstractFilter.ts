/**
 * @kaizen_zone 3e5be03a-1971-422c-8c70-5776253873de
 */
import { Control, IControlOptions } from 'UI/Base';
import { IFilterItem } from 'Controls/filter';
import { default as WidgetController } from 'Controls-ListEnv/_filterBase/WidgetController';
import { IContextValue } from 'Controls/context';

export interface IFilterWidgetOptions extends IControlOptions {
    filterNames?: string[];
    storeId?: string | string[];
}

export interface IInnerWidgetOptions extends IFilterWidgetOptions {
    _dataOptionsValue: IContextValue;
}

/**
 * Базовый виджет фильтрации.
 *
 * @class Controls-ListEnv/_filterBase/_AbstractFilter
 * @extends UI/Base:Control
 * @private
 *
 */
export default abstract class BaseFilterWidget<T extends IInnerWidgetOptions> extends Control<T> {
    protected _widgetController: WidgetController = null;
    protected _filterSource: IFilterItem[];

    protected _beforeMount(options: IInnerWidgetOptions): void {
        this._initWidgetController(options);
    }

    protected _beforeUpdate(newOptions: IInnerWidgetOptions): void {
        const result = this._widgetController.update(newOptions);

        if (result) {
            this._filterSourceChanged(
                (this._filterSource = this._widgetController.getFilterDescription()),
                newOptions
            );
        }
    }

    protected _updateFilterSource(filterSource: IFilterItem[]): void {
        this._widgetController.applyFilterDescription(filterSource);
    }

    private _initWidgetController(options: IInnerWidgetOptions): void {
        this._widgetController = new WidgetController(options);
    }

    protected abstract _filterSourceChanged(
        filterSource: IFilterItem[],
        options?: IInnerWidgetOptions
    ): void;
}
