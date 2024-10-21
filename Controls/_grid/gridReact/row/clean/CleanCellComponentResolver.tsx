import * as React from 'react';

import {
    GridCell,
    GridFooterCell,
    GridFooterRow,
    GridHeaderCell,
    GridHeaderRow,
    GridResultsCell,
    GridResultsRow,
} from 'Controls/gridDisplay';

import { getHeaderCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/Header';
import { getFooterCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/Footer';
import { getResultsCellComponentProps } from 'Controls/_grid/cleanRender/cell/utils/Results';

import HeaderCellComponent from 'Controls/_grid/cleanRender/cell/HeaderCellComponent';
import FooterCellComponent from 'Controls/_grid/cleanRender/cell/FooterCellComponent';
import ResultsCellComponent from 'Controls/_grid/cleanRender/cell/ResultsCellComponent';
import { IRowComponentProps } from 'Controls/_grid/gridReact/row/interface';

export function getCleanCellComponent(
    cell: GridCell | GridHeaderCell | GridFooterCell | GridResultsCell,
    rowProps: IRowComponentProps
): React.ReactElement | null {
    if ((cell as GridHeaderCell)['[Controls/_display/grid/HeaderCell]']) {
        const headerCellProps = getHeaderCellComponentProps({
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

    if ((cell as GridFooterCell)['[Controls/_display/grid/FooterCell]']) {
        const cellConfig = cell.getColumnConfig();
        const footerCellProps = getFooterCellComponentProps({
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

    if ((cell as GridResultsCell)['[Controls/_display/grid/ResultsCell]']) {
        const resultsCellProps = getResultsCellComponentProps({
            cell: cell as unknown as GridResultsCell,
            row: cell.getOwner() as unknown as GridResultsRow,
        });

        if (rowProps.beforeContentRender) {
            const BeforeContentRender = rowProps.beforeContentRender;
            resultsCellProps.beforeContentRender = <BeforeContentRender cell={cell} />;
        }

        return <ResultsCellComponent {...resultsCellProps} key={cell.key} />;
    }

    return null;
}
