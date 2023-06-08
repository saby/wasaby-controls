/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import FooterRow from './FooterRow';
import Cell, {
    IOptions as ICellOptions,
    IOptions as IBaseCellOptions,
} from './Cell';

export interface IOptions extends ICellOptions<null> {
    shouldAddFooterPadding: boolean;
}

/**
 * Ячейка футера в таблице
 * @private
 */
class FooterCell<TOwner extends FooterRow = FooterRow> extends Cell<
    null,
    FooterRow
> {
    protected readonly _defaultCellTemplate: string =
        'Controls/grid:FooterColumnTemplate';
    protected _$shouldAddFooterPadding: boolean;

    readonly listInstanceName: string = 'controls-Grid__footer';

    // region Аспект "Стилевое оформление"
    getWrapperClasses(
        backgroundColorStyle: string,
        templateHighlightOnHover: boolean
    ): string {
        let wrapperClasses =
            'controls-ListView__footer controls-GridView__footer__cell';

        if (this.getOwner().hasColumnScroll() || this._$isSticked) {
            wrapperClasses +=
                this._getControlsBackgroundClass(backgroundColorStyle);
        }

        if (
            this._$owner.hasColumnScroll() ||
            this._$owner.hasNewColumnScroll()
        ) {
            wrapperClasses += ` ${this._getColumnScrollWrapperClasses()}`;
            wrapperClasses += ` controls-GridView__footer__fixed${
                this._$isActsAsRowTemplate ? '_singleCell' : ''
            }`;
        }

        if (this._$shouldAddFooterPadding) {
            wrapperClasses +=
                ' controls-GridView__footer__itemActionsV_outside';
        }

        wrapperClasses += this._getHorizontalPaddingClasses(
            this._$column?.cellPadding
        );

        return wrapperClasses;
    }

    getWrapperStyles(containerSize?: number): string {
        let styles = this.getColspanStyles();
        if (containerSize && this._$isActsAsRowTemplate) {
            styles += ` width: ${containerSize}px;`;
        }
        return styles;
    }

    getContentClasses(
        height?: 'default' | 'auto',
        needItemActionsSpacing?: boolean
    ): string {
        let classes = 'controls-GridView__footer__cell__content ';
        classes += ` controls-GridView__footer__cell__content-height_${
            !needItemActionsSpacing && height === 'auto' ? 'auto' : 'default'
        }`;
        return classes;
    }

    // endregion

    getVerticalStickyHeaderPosition(): string {
        return 'bottom';
    }

    getStickyHeaderMode(): string {
        return 'stackable';
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
