/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
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

    const prepareParams = (column, width) => {
        if (options._isReactView) {
            return {
                key: column.key,
                width,
            };
        } else {
            return width;
        }
    };

    columns.forEach((column, index) => {
        const columnMinWidth = column.minWidth && parseInt(column.minWidth, 10);
        const columnMaxWidth = column.maxWidth && parseInt(column.maxWidth, 10);
        let columnWidth;

        if (options._isReactView) {
            columnWidth = parseInt(
                storedColumnsWidths && Object.keys(storedColumnsWidths).length
                    ? storedColumnsWidths[column.key]
                    : column.width,
                10
            );
        } else {
            columnWidth = parseInt(
                storedColumnsWidths && storedColumnsWidths.length
                    ? storedColumnsWidths[index]
                    : column.width,
                10
            );
        }

        if (resizingColumnIndex === index && columnWidth && columnMinWidth && columnMaxWidth) {
            const newColumnWidth = columnWidth + offset;

            let resizingColumnWidth;
            if (newColumnWidth < columnMinWidth) {
                resizingColumnWidth = columnMinWidth + 'px';
            } else if (newColumnWidth > columnMaxWidth) {
                resizingColumnWidth = columnMaxWidth + 'px';
            } else {
                resizingColumnWidth = newColumnWidth + 'px';
            }
            columnsWidths.push(prepareParams(column, resizingColumnWidth));
        } else {
            columnsWidths.push(prepareParams(column, column.width));
        }
    });

    if (options._isReactView) {
        return columnsWidths.reduce((acc, current) => {
            acc[current.key] = current.width;
            return acc;
        }, {});
    }
    return columnsWidths;
}

export function extractWidthsForColumns(
    options: IGridOptions,
    storedColumnsWidths: string[],
    listModel?: GridCollection
) {
    if (
        !options._isReactView ||
        !storedColumnsWidths ||
        !(
            storedColumnsWidths instanceof Array
                ? storedColumnsWidths
                : Object.keys(storedColumnsWidths)
        ).length
    ) {
        return storedColumnsWidths;
    }

    let columns;

    if (listModel) {
        columns = listModel.getGridColumnsConfig();
    } else {
        columns = options.columns;
    }

    return columns.map((c) => {
        if (c.key in storedColumnsWidths) {
            return storedColumnsWidths[c.key];
        } else {
            return c.width;
        }
    });
}
