/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import type * as React from 'react';

import Row from './Row';
import Cell, { IOptions as IBaseCellOptions } from './Cell';
import type { IRowComponentProps, ICellComponentProps } from 'Controls/gridReact';

const DEFAULT_CELL_CONTENT = 'Controls/grid:ColumnResizerCellTemplate';
const RESIZER_Z_INDEX = 4;

export type TResizerOffsetCallback = (offset: number) => void;

/**
 * Ячейка с ресайзером
 * @private
 */
export default class ColumnResizerCell extends Cell<null, Row<null>> {
    readonly listInstanceName: string = 'controls-Grid__resizer';
    readonly listElementName: string = 'resizer-cell';

    get key(): string {
        return 'grid-resizer-cell';
    }

    protected _$width: number;
    protected _$minWidth: number;
    protected _$maxWidth: number;
    protected _$resizerOffsetCallback: TResizerOffsetCallback;

    getTemplate(): string {
        return DEFAULT_CELL_CONTENT;
    }

    getWrapperStyles(): string {
        let styles = `z-index: ${RESIZER_Z_INDEX};`;
        if (this.getOwner().isFullGridSupport() && this._$rowspan) {
            styles += ` grid-row: 1 / ${1 + this._$rowspan};`;
        }
        return styles;
    }

    isVerticalStickied(): boolean {
        return false;
    }

    setRowspan(rowspan: number): boolean {
        const newRowspan = +this.getOwner().calcResizerRowspan(rowspan);
        if (newRowspan !== this._$rowspan) {
            this._$rowspan = newRowspan;
            this._nextVersion();
            return true;
        }
        return false;
    }

    setWidth(width: number) {
        this._$width = width;
        this._nextVersion();
    }

    getMinOffset() {
        return this._$width - this._$minWidth;
    }

    getMaxOffset() {
        return this._$maxWidth - this._$width;
    }

    getResizerOffsetCallback(): TResizerOffsetCallback {
        return this._$resizerOffsetCallback;
    }

    getCellComponentProps(
        rowProps: IRowComponentProps,
        render: React.ReactElement
    ): ICellComponentProps {
        // eslint-disable-next-line no-magic-numbers
        const columnScrollExtraRowsCount = 2;
        const superProps = super.getCellComponentProps(rowProps, render);
        return {
            ...superProps,
            className: `${superProps.className} controls-GridReact__resizer-cell`,
            paddingLeft: 'null',
            paddingRight: 'null',
            paddingTop: 'null',
            paddingBottom: 'null',
            startRowspanIndex: 1,
            endRowspanIndex: this._$rowspan + columnScrollExtraRowsCount + 1,
        };
    }
}

Object.assign(ColumnResizerCell.prototype, {
    '[Controls/grid/_display/ColumnResizerCell]': true,
    _moduleName: 'Controls/grid:ColumnResizerCell',
    _instancePrefix: 'grid-item-resizer-cell-',
    _$width: null,
    _$minWidth: null,
    _$maxWidth: null,
    _$resizerOffsetCallback: null,
});
