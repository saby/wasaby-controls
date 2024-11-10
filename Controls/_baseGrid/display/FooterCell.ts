/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';

import type { IRowComponentProps, ICellComponentProps } from 'Controls/gridReact';
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

    readonly listInstanceName: string = 'controls-Grid__footer';

    // region Аспект "Стилевое оформление"
    getWrapperClasses(backgroundColorStyle: string, templateHighlightOnHover: boolean): string {
        let wrapperClasses = 'controls-ListView__footer controls-GridView__footer__cell';

        if (this.getOwner().hasColumnScroll() || this._$isSticked) {
            wrapperClasses += this._getControlsBackgroundClass(backgroundColorStyle);
        }

        if (this._$owner.hasColumnScroll()) {
            wrapperClasses += ` ${this._getColumnScrollWrapperClasses()}`;
            wrapperClasses += ` controls-GridView__footer__fixed${
                this._$isActsAsRowTemplate ? '_singleCell' : ''
            }`;
        }

        if (this._$shouldAddFooterPadding) {
            wrapperClasses += ' controls-GridView__footer__itemActionsV_outside';
        }

        wrapperClasses += this._getHorizontalPaddingClasses(this._$column?.cellPadding);

        return wrapperClasses;
    }

    getWrapperStyles(containerSize?: number): string {
        let styles = this.getColspanStyles();
        if (containerSize && this._$isActsAsRowTemplate) {
            styles += ` width: ${containerSize}px;`;
        }
        return styles;
    }

    getContentClasses(height?: 'default' | 'auto', needItemActionsSpacing?: boolean): string {
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

    getCellProps() {
        return this._cellProps;
    }

    getCellComponentProps(
        rowProps: IRowComponentProps,
        render: React.ReactElement
    ): ICellComponentProps {
        const superProps = super.getCellComponentProps(rowProps, render);

        const minHeightClassName = this._$shouldAddFooterPadding
            ? 'controls-ListView__footer__itemActionsV_outside'
            : 'controls-GridReact__minHeight-footer';

        return {
            ...superProps,
            paddingTop: 'null',
            paddingBottom: 'null',
            className: `${superProps.className} controls-GridReact__footer-cell`,

            minHeightClassName,
            hoverBackgroundStyle: 'none',
            cursor: 'default',
            expanderPadding: this.getCellProps()?.expanderPadding,
        };
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
