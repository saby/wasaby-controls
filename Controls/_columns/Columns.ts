/**
 * @kaizen_zone 64741de4-090c-4426-a7df-258a52dacfef
 */
import {
    IAbstractListVirtualScrollControllerConstructor,
    View,
    IList,
    ListVirtualScrollController,
} from 'Controls/baseList';
import { TemplateFunction } from 'UI/Base';
import { MultiColumnStrategy, IMarkerStrategyOptions } from 'Controls/marker';
import { default as Render } from 'Controls/_columns/render/Columns';
import 'css!Controls/columns';
import ColumnsVirtualScrollController from 'Controls/_columns/controllers/ColumnsVirtualScrollController';

/**
 * Представление списка, которое позволяет расположить записи в нескольких столбцах
 * @private
 */
export default class Columns extends View {
    /** @lends Controls/_list/List.prototype */
    protected _viewName: TemplateFunction = Render;
    protected _markerStrategy: new (options: IMarkerStrategyOptions) => MultiColumnStrategy =
        MultiColumnStrategy;

    protected _beforeMount(
        options: unknown,
        context?: object,
        receivedState?: unknown
    ): unknown {
        const result = super._beforeMount(options, context, receivedState);
        if (options.disableVirtualScroll !== false) {
            this._itemsSelector = Render.itemsSelector;
        }
        return result;
    }

    protected _getModelConstructor(): string {
        return 'Controls/columns:ColumnsCollection';
    }

    protected _getListVirtualScrollConstructor(
        options: IList
    ): IAbstractListVirtualScrollControllerConstructor {
        return options.disableVirtualScroll
            ? ListVirtualScrollController
            : ColumnsVirtualScrollController;
    }

    static getDefaultOptions(): object {
        return {
            ...super.getDefaultOptions(),
            multiColumns: true,
            disableVirtualScroll: true,
            itemsContainerPadding: null,
        };
    }
}
