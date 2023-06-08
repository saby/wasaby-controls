/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */
import Header, { IOptions as IHeaderOptions } from './Header';
import TableHeaderRow from './TableHeaderRow';

/**
 * Заголовок в таблице, которая не поддерживает css grid
 * @private
 */
export default class TableHeader extends Header {
    getBodyClasses(): string {
        return 'controls-Grid__header';
    }

    getRow(): never {
        throw Error(
            "Method not implemented in TableHeader and shouldn't be used!"
        );
    }

    getRows(): TableHeaderRow[] {
        return this._$rows;
    }

    protected _buildRows(options: IHeaderOptions): TableHeaderRow[] {
        const factory = this._getRowsFactory();
        const rowsCount =
            this._$headerBounds.row.end - this._$headerBounds.row.start;
        if (rowsCount === 1) {
            return [new factory(options)];
        }

        /* Многострочный заголовок */
        const order: number[][] = [];
        options.header.forEach((column, index) => {
            // Строки в grid layout начинаются с 1, индексация строк - с нуля. Приводим индексы.
            let rowIndex = column.startRow - 1;

            // Если все ячейки в конфигурации начинаются не с первой строки,
            // то мы игнорируем эти пустые строки, удаляя их.
            // Строки в grid layout начинаются с 1, компенсируем this._$headerBounds.row.start на 1.
            if (this._$headerBounds.row.start - 1 > 0) {
                rowIndex -= this._$headerBounds.row.start - 1;
            }

            // Записываем индекс ячейки в строку.
            if (!order[rowIndex]) {
                order[rowIndex] = [];
            }
            order[rowIndex].push(index);
        });

        return order.map((rowCellsIndexes) => {
            return new factory({
                ...options,
                columnsConfig: options.header.filter((h, i) => {
                    return rowCellsIndexes.indexOf(i) !== -1;
                }),
            });
        });
    }
}

Object.assign(TableHeader.prototype, {
    '[Controls/_display/grid/TableHeader]': true,
    _moduleName: 'Controls/grid:GridTableHeader',
    _instancePrefix: 'grid-table-header-',
    _rowModule: 'Controls/grid:GridTableHeaderRow',
});
