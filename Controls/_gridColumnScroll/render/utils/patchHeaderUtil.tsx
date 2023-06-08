import { IHeaderConfig, IColumnConfig } from 'Controls/gridReact';
import ScrollableHeaderComponent, {
    IScrollableHeaderComponentProps,
} from '../header/NavigationCellComponent';

type TColumnIndexesConfig = Pick<IHeaderConfig, 'startColumn' | 'endColumn'>;
type TRowIndexesConfig = Pick<IHeaderConfig, 'startRow' | 'endRow'>;

export function patchHeader(
    header: IHeaderConfig[],
    columns: IColumnConfig[],
    stickyColumnsCount: number,
    compatibilityProps: IScrollableHeaderComponentProps
): IHeaderConfig[] {
    if (!header) {
        return [
            getHeaderNavigationCellConfig(
                { startColumn: 1, endColumn: columns.length + 1 },
                {},
                compatibilityProps
            ),
        ];
    }

    const { hasColumnIndexes, hasRowIndexes, rowsCount } =
        getHeaderConfigDescription(header);

    const resultHeader = header.map((c, index) => {
        return {
            ...c,
            ...(hasColumnIndexes
                ? {}
                : {
                      startColumn: index + 1,
                      endColumn: index + 1 + 1,
                  }),
            ...(hasRowIndexes
                ? {}
                : {
                      startRow: 1,
                      endRow: 1 + 1,
                  }),
        };
    });

    return resultHeader.concat([
        getHeaderNavigationCellConfig(
            {
                startColumn: 1,
                endColumn: columns.length + 1,
            },
            {
                startRow: rowsCount + 1,
                endRow: rowsCount + 1 + 1,
            },
            compatibilityProps
        ),
    ]);
}

function getHeaderConfigDescription(header: IHeaderConfig[]): {
    hasColumnIndexes: boolean;
    hasRowIndexes: boolean;
    rowsCount: number;
} {
    let hasColumnIndexes = false;
    let hasRowIndexes = false;
    let rowsCount = -1;

    for (
        let i = 0;
        i < header.length && !(hasColumnIndexes && hasRowIndexes);
        i++
    ) {
        const cell = header[i];
        if (
            typeof cell.startColumn !== 'undefined' ||
            typeof cell.endColumn !== 'undefined'
        ) {
            hasColumnIndexes = true;
        }
        if (
            typeof cell.startRow !== 'undefined' ||
            typeof cell.endRow !== 'undefined'
        ) {
            hasRowIndexes = true;
            // Если определен индекс начала, то обязан быть определен и индекс конца строки.
            // Это правило и проверяться оно должно в валидаторе опций, не здесь!
            rowsCount = Math.max(rowsCount, cell.endRow - 1);
        }
    }

    if (!hasRowIndexes) {
        rowsCount = 1;
    }

    return {
        hasColumnIndexes,
        hasRowIndexes,
        rowsCount,
    };
}

function getHeaderNavigationCellConfig(
    columnIndexesConfig: TColumnIndexesConfig = {},
    rowIndexesConfig: TRowIndexesConfig = {},
    compatibilityProps: IScrollableHeaderComponentProps
): IHeaderConfig {
    return {
        key: 'columnScroll_scrollableHeaderCell',
        valign: 'bottom',
        ...columnIndexesConfig,
        ...rowIndexesConfig,
        render: <ScrollableHeaderComponent {...compatibilityProps} />,
    };
}
