/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import Row from './Row';
import Cell, { IOptions as ICellOptions } from './Cell';
import IItemActionsCell from './interface/IItemActionsCell';
import { DRAG_SCROLL_JS_SELECTORS } from 'Controls/columnScroll';
import type { TItemActionsVisibility } from 'Controls/itemActions';

export type IOptions = ICellOptions<null>;

const DEFAULT_CELL_CONTENT = 'Controls/grid:ActionsCellComponent';

/**
 * Ячейка с действиями над записью
 * @private
 */
export default class ItemActionsCell
    extends Cell<null, Row<null>>
    implements IItemActionsCell
{
    readonly SupportItemActions: true = true;
    readonly listInstanceName: string = 'controls-Grid__actions';

    readonly listElementName: string = 'actions-cell';

    getTemplate(): string {
        return DEFAULT_CELL_CONTENT;
    }

    getWrapperClasses(
        backgroundColorStyle: string,
        templateHighlightOnHover?: boolean,
        templateHoverBackgroundStyle?: string
    ): string {
        if (!this._$owner.DisplayItemActions) {
            return this._$owner.isFullGridSupport()
                ? 'controls-Grid__itemAction__emptyContainer'
                : '';
        }
        let classes = `${DRAG_SCROLL_JS_SELECTORS.NOT_DRAG_SCROLLABLE}`;
        if (this._$owner.isFullGridSupport()) {
            classes +=
                ' controls-itemActionsV__container controls-Grid__itemAction';
        } else {
            classes += ` ${super.getWrapperClasses(
                backgroundColorStyle,
                templateHighlightOnHover,
                templateHoverBackgroundStyle
            )}`;
            classes += ' controls-Grid-table-layout__itemActions__container';
        }
        return classes;
    }

    getWrapperStyles(): string {
        let styles =
            'width: 0px; min-width: 0px; max-width: 0px; padding: 0px; z-index: 2;';
        if (this._$owner.isFullGridSupport() && this._$rowspan) {
            styles += ` grid-row: 1 / ${1 + this._$rowspan};`;
        }
        return styles;
    }

    shouldDisplayItemActions(): boolean {
        return (
            !!this._$owner.DisplayItemActions &&
            this._$owner.shouldDisplayItemActions()
        );
    }

    getActionsVisibility(
        actionsVisibility: TItemActionsVisibility
    ): TItemActionsVisibility {
        return this.shouldDisplayItemActions() ? actionsVisibility : 'hidden';
    }
}

Object.assign(ItemActionsCell.prototype, {
    '[Controls/_display/grid/ItemActionsCell]': true,
    _moduleName: 'Controls/display:ItemActionsCell',
    _instancePrefix: 'grid-item-actions-cell-',
});
