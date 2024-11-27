import { IFooterCellComponentProps } from 'Controls/_grid/cleanRender/cell/FooterCellComponent';
import { GridCell, GridFooterCell, GridFooterRow } from 'Controls/gridDisplay';
import { IBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/BaseCellComponent';
import { getStickyProps } from 'Controls/_grid/cleanRender/cell/utils/Props/Sticky';
import { getPaddingsObject } from 'Controls/_grid/cleanRender/cell/utils/Props/Padding';
import { getColumnScrollProps } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnScroll';
import { getBackgroundColorStyle } from 'Controls/_grid/cleanRender/cell/utils/Props/BackgroundColorStyle';

interface IGetFooterCellComponentProps
    extends Pick<
        IBaseCellComponentProps,
        'className' | 'data-qa' | 'contentRender' | 'onClick' | 'onMouseMove' | 'onMouseEnter'
    > {
    cell: GridFooterCell;
    row: GridFooterRow;
}

export function getFooterCellComponentProps(
    props: IGetFooterCellComponentProps
): IFooterCellComponentProps {
    const { cell, row } = props;
    const colspanParams = cell.getColspanParams();
    const cellConfig = cell.getColumnConfig();

    const getCellPropsResult = cellConfig?.getCellProps ? cellConfig?.getCellProps() : {};

    const padding = getPaddingsObject({
        cell,
        row,
        paddingTop: row.getTopPadding(),
        paddingBottom: row.getBottomPadding(),
    });

    const columnScrollProps = getColumnScrollProps({ cell, row });

    const stickyProps = getStickyProps({ cell: cell as unknown as GridCell, row });
    const shouldAddFooterPadding = cell.shouldAddFooterPadding;

    return {
        ...getCellPropsResult,
        ...columnScrollProps,

        isFirstCell: cell.isFirstColumn(),
        isLastCell: cell.isLastColumn(),

        // фон
        backgroundColorStyle: getBackgroundColorStyle({
            getCellPropsResult,
            cellConfig,
            isFixedCell:
                columnScrollProps.hasColumnScroll && columnScrollProps.columnScrollIsFixedCell,
        }),

        // колспан
        startColumn: colspanParams?.startColumn,
        endColumn: colspanParams?.endColumn,

        // отступы
        padding,
        shouldAddFooterPadding,

        // events
        onClick: props.onClick,
        onMouseEnter: props.onMouseEnter,
        onMouseMove: props.onMouseMove,

        // sticky
        ...stickyProps,
    };
}
