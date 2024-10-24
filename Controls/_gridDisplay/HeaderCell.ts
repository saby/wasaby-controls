/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
/*  IHeaderCell
    Сделано:
    align Выравнивание содержимого ячейки по горизонтали.
    caption Текст заголовка ячейки.
    sortingProperty Свойство, по которому выполняется сортировка.
    template Шаблон заголовка ячейки.
    textOverflow Поведение текста, если он не умещается в ячейке
    valign Выравнивание содержимого ячейки по вертикали.
    startColumn Порядковый номер колонки, на которой начинается ячейка.
    startRow Порядковый номер строки, на которой начинается ячейка.
    endColumn Порядковый номер колонки, на которой заканчивается ячейка.
    endRow Порядковый номер строки, на которой заканчивается ячейка.

    Не сделано:
    templateOptions Опции, передаваемые в шаблон ячейки заголовка.
*/
import { ICellPadding, IColspanParams } from './interface/IColumn';
import { IHeaderCell } from './interface/IHeaderCell';
import { IItemPadding } from 'Controls/display';
import HeaderRow from './HeaderRow';
import Cell, { IOptions as ICellOptions } from './Cell';
import { TBackgroundStyle, TSortingValue } from 'Controls/interface';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';

export interface IOptions extends ICellOptions<null> {
    shadowVisibility?: string;
    backgroundStyle?: string;
    sorting?: string;
    cellPadding?: IItemPadding;
}

export interface ICellContentOrientation {
    align: 'left' | 'center' | 'right';
    valign: 'top' | 'center' | 'baseline' | 'bottom';
}

const FIXED_HEADER_Z_INDEX = 4;
const STICKY_HEADER_Z_INDEX = 3;

/**
 * Ячейка строки заголовка в таблице
 * @private
 */
export default class HeaderCell extends Cell<null, HeaderRow> {
    protected readonly _defaultCellTemplate: string = 'Controls/grid:HeaderContent';

    protected _$owner: HeaderRow;
    protected _$column: IHeaderCell;
    protected _$cellPadding: ICellPadding;
    protected _$backgroundStyle: string;
    protected _$sorting: TSortingValue;
    protected _$contentOrientation?: ICellContentOrientation;
    private _$isCheckBoxCell: boolean;
    private _$isSpacingCell: boolean;
    private _$isResizerCell: boolean;
    protected '[Controls/_display/grid/HeaderCell]': boolean;

    get key(): string {
        return (
            '' +
            (this._$column?.key || this.getDisplayProperty() || 'header-' + this.getColumnIndex())
        );
    }

    readonly listInstanceName: string = 'controls-Grid__header';

    get backgroundStyle(): string {
        return this._$backgroundStyle;
    }

    get CheckBoxCell(): boolean {
        return (
            !this._$isLadderCell &&
            this._$isCheckBoxCell &&
            this._$owner.hasMultiSelectColumn() &&
            this._$owner.getHeaderConfig().indexOf(this._$column) === -1
        );
    }

    protected get contentOrientation(): ICellContentOrientation {
        if (!this._$contentOrientation) {
            this._calcContentOrientation();
        }
        return this._$contentOrientation;
    }

    private _calcContentOrientation(): void {
        if (
            this.CheckBoxCell ||
            this._$isLadderCell ||
            this._$isSpacingCell ||
            this._$isResizerCell
        ) {
            this._$contentOrientation = {
                align: undefined,
                valign: undefined,
            } as ICellContentOrientation;
            return;
        }
        /*
         * Выравнивание задается со следующим приоритетом
         * 1) Выравнивание заданное на ячейки шапки
         * 2) Если колонка растянута, то по умолчанию контент выравнивается по середине
         * 3) Контент выравнивается также, как контент колонки данных
         * 4) По верхнему левому углу
         * */
        const hasAlign = typeof this._$column.align !== 'undefined';
        const hasValign = typeof this._$column.valign !== 'undefined';

        const get = (prop: 'align' | 'valign'): string | undefined => {
            const gridUnit = prop === 'align' ? 'Column' : 'Row';
            if (
                typeof this._$column[`start${gridUnit}`] !== 'undefined' &&
                typeof this._$column[`end${gridUnit}`] !== 'undefined' &&
                this._$column[`end${gridUnit}`] - this._$column[`start${gridUnit}`] > 1
            ) {
                return 'center';
            } else if (typeof this._$column.startColumn !== 'undefined') {
                // ВНИМАТЕЛЬНО! Независимо от оси для которой считается выравнивание, считать нужно через startColumn,
                // т.к. чтобы получить корректное значение для выравнивания контента растянутой ячейки заголовка по
                // опции колонки данных, нужно получить конфигурацию колонки расположенной под данной ячейкой заголовка.
                return this._$owner.getGridColumnsConfig()[this._$column.startColumn - 1][prop];
            } else {
                return this._$owner.getGridColumnsConfig()[
                    this._$owner.getHeaderConfig().indexOf(this._$column)
                ][prop];
            }
        };

        this._$contentOrientation = {
            align: hasAlign ? this._$column.align : get('align'),
            valign: hasValign ? this._$column.valign : get('valign'),
        } as ICellContentOrientation;
    }

    isLadderCell(): boolean {
        return this._$isLadderCell;
    }

    // region Аспект "Объединение колонок"
    getColspanParams(): IColspanParams {
        if (this.CheckBoxCell) {
            return {
                startColumn: 1,
                endColumn: 2,
                colspan: 1,
            };
        }
        const isMultilineHeader = this._$owner.isMultiline();

        if (this._$column.startColumn && this._$column.endColumn) {
            const multiSelectOffset = this.CheckBoxCell ? 0 : +this._$owner.hasMultiSelectColumn();
            let stickyLadderCellsCount = 0;
            let startLadderOffset = 0;

            if (!(this._$isLadderCell && isMultilineHeader)) {
                stickyLadderCellsCount = this._$owner.getStickyLadderCellsCount();
                startLadderOffset =
                    this._$column.startColumn > 1
                        ? stickyLadderCellsCount
                        : +!!stickyLadderCellsCount;
            }

            return {
                startColumn: this._$column.startColumn + multiSelectOffset + startLadderOffset,
                endColumn: this._$column.endColumn + multiSelectOffset + stickyLadderCellsCount,
            };
        }
        return super.getColspanParams();
    }

    getColspan(): number {
        // TODO: Перейти на базовый метод
        const params = this.getColspanParams() || {};
        return params.endColumn - params.startColumn || 1;
    }

    // endregion

    // region Аспект "Объединение строк"
    getRowspanParams(): {
        startRow: number;
        endRow: number;
        rowspan: number;
    } {
        const startRow =
            typeof this._$column.startRow === 'number'
                ? this._$column.startRow
                : this._$owner.getIndex() + 1;
        let endRow;

        if (typeof this._$column.endRow === 'number') {
            endRow = this._$column.endRow;
        } else if (typeof this._$column.rowspan === 'number') {
            endRow = startRow + this._$column.rowspan;
        } else {
            endRow = startRow + 1;
        }

        return {
            startRow,
            endRow,
            rowspan: endRow - startRow,
        };
    }

    getRowspan(): number {
        return this.getRowspanParams()?.rowspan || 1;
    }

    getRowspanStyles(): string {
        if (!this._$owner.isFullGridSupport()) {
            return '';
        }
        const { startRow, endRow } = this.getRowspanParams();
        return `grid-row: ${startRow} / ${endRow};`;
    }

    // endregion

    getZIndex(): number {
        // Стереть код
        let zIndex;
        if (this._$owner.hasColumnScroll()) {
            const hasStickyLadder = this._$owner.getStickyLadderCellsCount() ? 1 : 0;
            zIndex = this._$isFixed
                ? FIXED_HEADER_Z_INDEX + hasStickyLadder
                : STICKY_HEADER_Z_INDEX;
        } else {
            zIndex = STICKY_HEADER_Z_INDEX;
        }
        return zIndex;
    }

    getCaption(): string {
        // todo "title" - is deprecated property, use "caption"
        return this._$column.caption || this._$column.title;
    }

    getCellComponentProps(rowProps: IRowComponentProps): ICellComponentProps {
        const superProps = super.getCellComponentProps(rowProps);
        const { startRow, endRow } = this.getRowspanParams();

        superProps.className += ' js-controls-GridReact__cell controls-GridReact__header-cell';
        if (!superProps.fontColorStyle) {
            // Дефолтный цвет, который темизируется в других темах
            superProps.className += ' controls-GridReact__header-cell_color';
        }
        if (!superProps.fontSize) {
            superProps.className += ' controls-GridReact__header-cell_fontSize';
        }

        return {
            ...superProps,
            startRowspanIndex: startRow,
            endRowspanIndex: endRow,
            paddingTop: 'null',
            paddingBottom: 'null',
            minHeightClassName: 'controls-GridReact__minHeight-header',
            hoverBackgroundStyle: 'none',
            cursor: 'default',
        };
    }

    getSortingProperty(): string {
        return this._$column.sortingProperty;
    }

    setSorting(sorting: string): void {
        if (this._$sorting !== sorting) {
            this._$sorting = sorting;
            this._nextVersion();
        }
    }

    getSorting(): TSortingValue | undefined {
        return this._$sorting;
    }

    // todo <<< START >>> compatible with old gridHeaderModel
    get column(): IHeaderCell {
        return this._$column;
    }

    // todo <<< END >>>

    isLastColumn(): boolean {
        const isMultilineHeader = this._$owner.isMultiline();
        if (isMultilineHeader) {
            let headerEndColumn = this._$owner.getBounds().column.end;
            const currentEndColumn = this.getColspanParams().endColumn;
            if (this._$owner.hasMultiSelectColumn()) {
                headerEndColumn += 1;
            }
            return currentEndColumn === headerEndColumn;
        } else {
            return super.isLastColumn();
        }
    }

    protected _getLastColumnIndex(): number {
        let count = 0;

        // Ищем индекс ячейки, попутно считаем колспаны предыдущих.
        this.getOwner()
            .getColumns()
            .forEach((columnItem, index) => {
                if (columnItem.isLadderCell()) {
                    count++;
                }
            });

        return super._getLastColumnIndex() - count;
    }

    getVerticalStickyHeaderPosition(): string {
        return 'top';
    }

    getStickyHeaderMode(): string {
        return 'stackable';
    }
}

Object.assign(HeaderCell.prototype, {
    '[Controls/_display/grid/HeaderCell]': true,
    _moduleName: 'Controls/grid:GridHeaderCell',
    _instancePrefix: 'grid-header-cell-',
    _$cellPadding: null,
    _$backgroundStyle: null,
    _$sorting: '',
    _$isCheckBoxCell: false,
    _$isSpacingCell: false,
    _$isResizerCell: false,
});
