import { Control, IControlOptions } from 'UI/Base';
import { SyntheticEvent } from 'UI/Events';
import {
    IFilterItem,
    ControllerClass as FilterController,
} from 'Controls/filter';
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
export default abstract class BaseFilterWidget<
    T extends IInnerWidgetOptions
> extends Control<T> {
    protected _widgetController: WidgetController = null;
    protected _filterSource: IFilterItem[];
    protected _filterController: FilterController;

    protected _beforeMount(options: IInnerWidgetOptions): void {
        this._initWidgetController(options);

        if (options.storeId === undefined) {
            this._filterController =
                this._widgetController.getFilterController();
            this._toggleSubscribtionFilterController(true);
        }
    }

    protected _beforeUpdate(newOptions: IInnerWidgetOptions): void {
        const result = this._widgetController.update(newOptions);

        if (result) {
            this._filterSourceChanged(
                (this._filterSource = this._widgetController.getFilterSource()),
                newOptions
            );
        }

        if (this._options.storeId === undefined) {
            const filterController =
                this._widgetController.getFilterController();
            this._toggleSubscribtionFilterController(false);
            this._filterController = filterController;
            this._toggleSubscribtionFilterController(true);
        }
    }

    protected _beforeUnmount(): void {
        if (this._options.storeId === undefined) {
            this._toggleSubscribtionFilterController(false);
        }
        super._beforeUnmount();
    }

    protected _updateFilterSource(filterSource: IFilterItem[]): void {
        this._widgetController.applyFilterDescription(filterSource);
    }

    private _initWidgetController(options: IInnerWidgetOptions): void {
        this._widgetController = new WidgetController(options);
    }

    protected _toggleSubscribtionFilterController(subscribe: boolean): void {
        const method = subscribe ? 'subscribe' : 'unsubscribe';
        this._filterController[method](
            'filterSourceChanged',
            this._filterSourceChangedHandler,
            this
        );
    }

    private _filterSourceChangedHandler(
        event: SyntheticEvent,
        filterDescription: IFilterItem[]
    ): void {
        this._widgetController.setFullFilterDescription(filterDescription);
        this._filterSourceChanged(
            this._widgetController.getFilterSource(),
            this._options
        );
    }

    protected abstract _filterSourceChanged(
        filterSource: IFilterItem[],
        options?: IInnerWidgetOptions
    ): void;
}
