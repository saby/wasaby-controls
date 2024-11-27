/**
 * @kaizen_zone 4368b094-41a4-40db-a0f9-b83257bd8251
 */
import {
    IAbstractListVirtualScrollControllerConstructor,
    View,
    IList,
    ListVirtualScrollController,
} from 'Controls/baseList';
import { TemplateFunction } from 'UI/Base';
import { CompatibleMultiColumnMarkerStrategy as MultiColumnMarkerStrategy } from 'Controls/listAspects';
import { default as Render } from 'Controls/_columns/render/Columns';
import 'css!Controls/columns';
import ColumnsVirtualScrollController from 'Controls/_columns/controllers/ColumnsVirtualScrollController';

/**
 * Представление списка, которое позволяет расположить записи в нескольких столбцах
 * @private
 */
export default class Columns extends View {
    /** @lends Controls/_baseList/List.prototype */
    protected _viewName: TemplateFunction = Render;
    protected _markerStrategy: typeof MultiColumnMarkerStrategy = MultiColumnMarkerStrategy;

    protected _beforeMount(options: unknown, context?: object, receivedState?: unknown): unknown {
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
