import * as React from 'react';

import {
    GridCell,
    GridEmptyCell,
    GridEmptyRow,
    GridFooterCell,
    GridFooterRow,
    GridHeaderCell,
    GridHeaderRow,
    GridResultsCell,
    GridResultsRow,
} from 'Controls/gridDisplay';

import { getHeaderCellProps } from 'Controls/_gridRender/cell/utils/Header';
import { getFooterCellProps } from 'Controls/_gridRender/cell/utils/Footer';
import { getResultsCellProps } from 'Controls/_gridRender/cell/utils/Results';

import HeaderCellComponent from 'Controls/_gridRender/cell/Header';
import FooterCellComponent from 'Controls/_gridRender/cell/Footer';
import ResultsCellComponent from 'Controls/_gridRender/cell/Results';
import { IRowComponentProps } from 'Controls/_gridRender/row/interface/IRowComponent';
import EmptyCellComponent from 'Controls/_gridRender/cell/Empty';
import { getEmptyCellProps } from 'Controls/_gridRender/cell/utils/Empty';

export function getCleanCellComponent(
    cell: GridCell | GridHeaderCell | GridFooterCell | GridResultsCell,
    rowProps: IRowComponentProps
): React.ReactElement | null {
    if ((cell as GridHeaderCell).$GHC) {
        const headerCellProps = getHeaderCellProps({
            cell: cell as unknown as GridHeaderCell,
            row: cell.getOwner() as unknown as GridHeaderRow,
        });

        const cellProps = cell.getColumnConfig().getCellProps
            ? cell.getColumnConfig().getCellProps()
            : {};

        const BeforeContentRender =
            cellProps.beforeContentRender !== undefined
                ? cellProps.beforeContentRender
                : rowProps.beforeContentRender;

        const preparedBeforeContentRender = (
            BeforeContentRender ? <BeforeContentRender cell={cell} /> : null
        ) as React.ReactElement;

        return (
            <HeaderCellComponent
                {...headerCellProps}
                key={cell.key}
                qaCellKey={cell.key}
                beforeContentRender={preparedBeforeContentRender}
            />
        );
    }

    if ((cell as GridFooterCell).$GFC) {
        const cellConfig = cell.getColumnConfig();
        const footerCellProps = getFooterCellProps({
            cell: cell as unknown as GridFooterCell,
            row: cell.getOwner() as unknown as GridFooterRow,
        });

        if (rowProps.beforeContentRender) {
            const BeforeContentRender = rowProps.beforeContentRender;
            footerCellProps.beforeContentRender = <BeforeContentRender cell={cell} />;
        }

        return (
            <FooterCellComponent
                {...footerCellProps}
                key={cell.key}
                contentRender={(cellConfig as { render: React.ReactElement }).render}
            />
        );
    }

    if ((cell as GridResultsCell).$GRC) {
        const resultsCellProps = getResultsCellProps({
            cell: cell as unknown as GridResultsCell,
            row: cell.getOwner() as unknown as GridResultsRow,
        });

        if (rowProps.beforeContentRender) {
            const BeforeContentRender = rowProps.beforeContentRender;
            resultsCellProps.beforeContentRender = <BeforeContentRender cell={cell} />;
        }

        return <ResultsCellComponent {...resultsCellProps} key={cell.key} />;
    }

    if ((cell as GridEmptyCell).$GEC) {
        // Отобразит его внутри нашего чистого EmptyCellComponent
        return (
            <EmptyCellComponent
                {...getEmptyCellProps({
                    row: cell.getOwner() as GridEmptyRow,
                    cell: cell as unknown as GridEmptyCell,
                    rowProps,
                })}
                key={cell.key}
                contentRender={cell.config?.render ?? null}
            />
        );
    }

    return null;
}
