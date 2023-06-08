/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import Row from './Row';
import Cell from './Cell';

const DEFAULT_CELL_CONTENT = 'Controls/grid:ColumnResizerCellTemplate';
const RESIZER_Z_INDEX = 4;

/**
 * Ячейка с ресайзером
 * @private
 */
export default class ColumnResizerCell extends Cell<null, Row<null>> {
    readonly listInstanceName: string = 'controls-Grid__resizer';
    readonly listElementName: string = 'resizer-cell';

    protected _$width: number;
    protected _$minWidth: number;
    protected _$maxWidth: number;
    protected _$resizerOffsetCallback: Function;

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

    setRowspan(rowspan: number): void {
        this._$rowspan = +this.getOwner().calcResizerRowspan(rowspan);
        this._nextVersion();
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

    getResizerOffsetCallback(): Function {
        return this._$resizerOffsetCallback;
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
