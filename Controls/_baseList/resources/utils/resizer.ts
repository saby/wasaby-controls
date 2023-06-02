/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { IGridOptions, GridCollection } from 'Controls/grid';

export function getColumnsWidths(
    options: IGridOptions,
    offset: number,
    storedColumnsWidths: string[],
    listModel: GridCollection
): string[] {
    const columnsWidths = [];
    const resizingColumnIndex = options.stickyColumnsCount - 1;
    let columns;

    if (listModel) {
        columns = listModel.getGridColumnsConfig();
    } else {
        columns = options.columns;
    }

    columns.forEach((column, index) => {
        const columnMinWidth = column.minWidth && parseInt(column.minWidth, 10);
        const columnMaxWidth = column.maxWidth && parseInt(column.maxWidth, 10);
        const columnWidth = parseInt(
            storedColumnsWidths && storedColumnsWidths.length
                ? storedColumnsWidths[index]
                : column.width,
            10
        );

        if (
            resizingColumnIndex === index &&
            columnWidth &&
            columnMinWidth &&
            columnMaxWidth
        ) {
            const newColumnWidth = columnWidth + offset;

            let resizingColumnWidth;
            if (newColumnWidth < columnMinWidth) {
                resizingColumnWidth = columnMinWidth + 'px';
            } else if (newColumnWidth > columnMaxWidth) {
                resizingColumnWidth = columnMaxWidth + 'px';
            } else {
                resizingColumnWidth = newColumnWidth + 'px';
            }
            columnsWidths.push(resizingColumnWidth);
        } else {
            columnsWidths.push(column.width);
        }
    });

    return columnsWidths;
}
