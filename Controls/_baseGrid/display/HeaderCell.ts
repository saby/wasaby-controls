/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
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
import { TBackgroundStyle } from 'Controls/interface';
import * as React from 'react';
import type { ICellComponentProps, IRowComponentProps } from 'Controls/gridReact';

export interface IOptions extends ICellOptions<null> {
    shadowVisibility?: string;
    backgroundStyle?: string;
    sorting?: string;
    cellPadding?: IItemPadding;
}

interface ICellContentOrientation {
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
    protected _$sorting: string;
    protected _$contentOrientation?: ICellContentOrientation;
    private _$isCheckBoxCell: boolean;
    private _$isSpacingCell: boolean;
    private _$isResizerCell: boolean;

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
    _getColspanParams(): IColspanParams {
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
        return super._getColspanParams();
    }

    getColspan(): number {
        // TODO: Перейти на базовый метод
        const params = this._getColspanParams() || {};
        return params.endColumn - params.startColumn || 1;
    }

    // endregion

    // region Аспект "Объединение строк"
    _getRowspanParams(): {
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
        return this._getRowspanParams()?.rowspan || 1;
    }

    getRowspanStyles(): string {
        if (!this._$owner.isFullGridSupport()) {
            return '';
        }
        const { startRow, endRow } = this._getRowspanParams();
        return `grid-row: ${startRow} / ${endRow};`;
    }

    // endregion

    getWrapperStyles(): string {
        let styles = super.getWrapperStyles();
        if (this._$owner.isFullGridSupport()) {
            styles += this.getRowspanStyles();
        }
        styles += ` z-index: ${this.getZIndex()};`;
        return styles;
    }

    getZIndex(): number {
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

    getWrapperClasses(backgroundColorStyle: TBackgroundStyle): string {
        let wrapperClasses =
            `controls-Grid__header-cell controls-Grid__cell_${this.getStyle()}` +
            ` ${this._getHorizontalPaddingClasses(this._$cellPadding)}` +
            ` ${this._getColumnSeparatorClasses()}`;

        const isMultilineHeader = this._$owner.isMultiline();
        const isStickySupport = this._$owner.isStickyHeader();
        const isFullGridSupport = this._$owner.isFullGridSupport();

        // При полной поддержке Grid фон задаётся через StickyBlock, поэтому чтобы избежать установки двух
        // классов фона, цвет фона в заголовках убирали: https://online.sbis.ru/doc/243e3789-f3f0-4aa9-a9d3-9c362703abd2
        // Но в IE ячейки не врапятся в StickyBlock, поэтому специально для IE делаем фон ячеек.
        if (isStickySupport && !isFullGridSupport) {
            wrapperClasses += this._getControlsBackgroundClass(backgroundColorStyle);
        }

        if (isMultilineHeader) {
            wrapperClasses += ' controls-Grid__multi-header-cell_min-height';
        } else {
            wrapperClasses += ' controls-Grid__header-cell_min-height';
        }
        if (!isStickySupport) {
            wrapperClasses += ' controls-Grid__header-cell_static';
        }

        if (!this.CheckBoxCell) {
            if (!this._$owner.hasColumnScroll()) {
                wrapperClasses += ' controls-Grid__header-cell_min-width';
            }
        } else {
            wrapperClasses +=
                ' js-controls-Grid__header-cell-checkbox controls-Grid__header-cell-checkbox controls-Grid__header-cell-checkbox_min-width';

            // При отображении в заголовке хлебных крошек визуальное отображение ячейки с чекбоксом не нужно,
            // важно лишь чтобы она занимала место. Это самый простой способ избавиться от двойной тени
            // https://online.sbis.ru/opendoc.html?guid=ef6ba52e-9a8e-4f11-a3c5-4961b52c76a6&client=3
            if (this._$owner.hasBreadCrumbsCell()) {
                wrapperClasses += ' tw-invisible';
            }
        }

        if (this.contentOrientation.valign) {
            wrapperClasses += ` controls-Grid__header-cell__content_valign-${this.contentOrientation.valign}`;
        }

        if (this._$owner.hasColumnScroll()) {
            wrapperClasses += ` ${this._getColumnScrollWrapperClasses()}`;

            // Отступ под кнопки прокрутки горизонтального скролла.
            // Добавляется только к ячейкам последней строки.
            if (
                this._$owner.getColumnScrollViewMode() === 'arrows' &&
                !(this._$owner.hasResults() && this._$owner.getResultsPosition() === 'top') &&
                (!isMultilineHeader ||
                    (isMultilineHeader &&
                        this._$column.endRow === this._$owner.getBounds().row.end))
            ) {
                wrapperClasses += ' controls-Grid__header-cell_withColumnScrollArrows';
            }
        }
        return wrapperClasses;
    }

    getContentClasses(): string {
        const isMultiLineHeader = this._$owner.isMultiline();
        let contentClasses = 'controls-Grid__header-cell__content';
        contentClasses += this._getContentSeparatorClasses();
        if (isMultiLineHeader) {
            contentClasses += ' controls-Grid__row-multi-header__content_baseline';
        } else {
            contentClasses += ` controls-Grid__row-header__content_baseline_${
                this._$column.baseline ?? 'default'
            }`;
        }
        if (this.contentOrientation.align) {
            contentClasses += ` controls-Grid__header-cell_justify_content_${this.contentOrientation.align}`;
        }
        return contentClasses;
    }

    protected _getContentSeparatorClasses(): string {
        const headerEndRow = this._$owner.getBounds().row.end;
        const isMultiLineHeader = this._$owner.isMultiline();
        let classes = '';
        if (isMultiLineHeader) {
            if (
                this._$column.endRow !== headerEndRow &&
                this._$column.endRow - this._$column.startRow === 1
            ) {
                classes += ' controls-Grid__cell_header-content_border-bottom';
            }
        }
        return classes;
    }

    getCaption(): string {
        // todo "title" - is deprecated property, use "caption"
        return this._$column.caption || this._$column.title;
    }

    getCellComponentProps(
        rowProps: IRowComponentProps,
        render: React.ReactElement
    ): ICellComponentProps {
        const superProps = super.getCellComponentProps(rowProps, render);
        const { startRow, endRow } = this._getRowspanParams();

        superProps.className += ' controls-GridReact__header-cell';
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

    getSorting(): string {
        return this._$sorting;
    }

    getSortingIcon(): string {
        return this._$column.sortingIcon;
    }

    getAlign(): string {
        return this.contentOrientation.align;
    }

    getVAlign(): string {
        return this.contentOrientation.valign;
    }

    getTextOverflow(): string {
        return this._$column.textOverflow;
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
            const currentEndColumn = this._getColspanParams().endColumn;
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

    protected _getHorizontalPaddingClasses(cellPadding: ICellPadding): string {
        // Для ячейки, создаваемой в связи с множественной лесенкой не нужны отступы, иначе будут проблемы с наложением
        // тени: https://online.sbis.ru/opendoc.html?guid=758f38c7-f5e7-447e-ab79-d81546b9f76e
        if (this._$isLadderCell) {
            return '';
        }

        let classes = super._getHorizontalPaddingClasses(cellPadding);

        // TODO нужно сделать так, чтобы отступы задавались в header.
        //  И здесь бы уже звали толкьо this._$column.getLeftPadding()
        //  https://online.sbis.ru/opendoc.html?guid=686fb34b-fb74-4a11-8306-67b71e3ded0c
        if (this._$column.isBreadCrumbs) {
            // Если есть ячейка для мультивыбора, то нужно сдвинуть хлебные крошки, что бы они были прижаты к
            // левому краю таблицы. Сейчас это единственный простой способ сделать это.
            // В идеале где-то на уровне Explorer нужно переопределить HeaderRow-модель и заколспанить в ней
            // ячейку для мультивыбора и ячейку в которой находятся хлебные крошки.
            if (this._$owner.hasMultiSelectColumn()) {
                classes += ' controls-Grid__cell_spacingBackButton_with_multiSelection';
            }
        }

        return classes;
    }

    getRelativeCellWrapperClasses(): string {
        let result = super.getRelativeCellWrapperClasses();

        if (this._$column.isBreadCrumbs && this._$owner.hasMultiSelectColumn()) {
            result += ' controls-Grid__cell_spacingBackButton_with_multiSelection';
        }

        return result;
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
    _$sorting: null,
    _$isCheckBoxCell: false,
    _$isSpacingCell: false,
    _$isResizerCell: false,
});
