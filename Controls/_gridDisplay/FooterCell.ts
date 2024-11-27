/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import FooterRow from './FooterRow';
import Cell, { IOptions as ICellOptions, IOptions as IBaseCellOptions } from './Cell';

export interface IOptions extends ICellOptions<null> {
    shouldAddFooterPadding: boolean;
}

/**
 * Ячейка футера в таблице
 * @private
 */
class FooterCell<TOwner extends FooterRow = FooterRow> extends Cell<null, FooterRow> {
    protected readonly _defaultCellTemplate: string = 'Controls/grid:FooterColumnTemplate';
    protected _$shouldAddFooterPadding: boolean;
    protected '[Controls/_display/grid/FooterCell]': boolean;

    readonly listInstanceName: string = 'controls-Grid__footer';

    // endregion

    getVerticalStickyHeaderPosition(): string {
        return 'bottom';
    }

    getStickyHeaderMode(): string {
        return 'stackable';
    }

    getCellProps() {
        return this._cellProps;
    }

    get shouldAddFooterPadding(): boolean {
        return this._$shouldAddFooterPadding;
    }
}

Object.assign(FooterCell.prototype, {
    '[Controls/_display/grid/FooterCell]': true,
    _$shouldAddFooterPadding: false,
    _moduleName: 'Controls/grid:GridFooterCell',
    _instancePrefix: 'grid-footer-cell-',
});

export default FooterCell;
export { FooterCell, IBaseCellOptions as IFooterCellOptions };
