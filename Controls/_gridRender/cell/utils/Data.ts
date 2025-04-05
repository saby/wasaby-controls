/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import {
    IDataCellComponentProps,
    IDataCellDecorationStyleProps,
} from 'Controls/_gridRender/cell/interface/IDataCellComponent';
import type { GridCell, GridRow } from 'Controls/gridDisplay';
import { getRowSeparators } from 'Controls/_gridRender/cell/utils/Props/RowSeparator';
import { getColumnSeparators } from 'Controls/_gridRender/cell/utils/Props/ColumnSeparator';
import { shouldDisplayEditArrow } from 'Controls/_gridRender/cell/utils/Props/EditArrow';
import { TBackgroundStyle } from 'Controls/interface';
import { getCellProps } from 'Controls/_gridRender/utils/DecorationStyle';
import { getCursor } from 'Controls/_gridRender/cell/utils/Props/Cursor';
import { getColumnScrollProps } from 'Controls/_gridRender/cell/utils/Props/ColumnScroll';
import { getPaddingsObject } from './Props/Padding';
import getFixedZIndex from 'Controls/_gridRender/cell/utils/Props/ZIndex';

interface IDataCellComponentPropsWithCompatibleLayer extends IDataCellComponentProps {
    backgroundStyle?: TBackgroundStyle;
    stickied?: boolean;
    showEditArrow?: boolean;
}

interface IGetDataCellCellComponentProps extends IDataCellDecorationStyleProps {
    cellComponentProps: IDataCellComponentPropsWithCompatibleLayer;
    cell: GridCell;
    row: GridRow;
}

const DEF_PROPS: Partial<IDataCellComponentProps> = {
    hoverBackgroundStyle: 'default',
    cursor: 'pointer',
    valign: 'baseline',
    baseline: 'default',
    displayType: 'flex',
    borderVisibility: 'hidden',
    borderStyle: 'default',
    borderMode: 'row',
};

/**
 * Возвращает пропсы, необходимые для рендера ячейки с данными
 * @private
 */
export function getDataCellProps(props: IGetDataCellCellComponentProps): IDataCellComponentProps {
    const { cellComponentProps: ccp, cell, row } = props;

    const columnScrollProps = getColumnScrollProps({ cell, row, className: ccp.className });
    const cursor = getCursor(ccp.cursor || DEF_PROPS.cursor, columnScrollProps.isScrollable);
    const padding = getPaddingsObject({
        cell,
        row,
        paddingTop: ccp.paddingTop,
        paddingBottom: ccp.paddingBottom,
        getCellsPropsParams: () => (Array.isArray(row.contents) ? row.contents[0] : row.contents),
    });
    const dataCellProps: IDataCellComponentProps = {
        ...ccp,

        ...getRowSeparators({ cell, row }),
        ...getColumnSeparators({ cell }),

        ...(props.decorationStyle !== 'master'
            ? {}
            : (getCellProps(cell, ccp) as IDataCellComponentProps)),

        editArrowVisible: shouldDisplayEditArrow({ cell, row }),
        padding,

        backgroundColorStyle: ccp.backgroundStyle || ccp.backgroundColorStyle,
        hoverBackgroundStyle: ccp.hoverBackgroundStyle || DEF_PROPS.hoverBackgroundStyle,
        cursor,
        valign: ccp.valign || DEF_PROPS.valign,
        baseline: ccp.baseline || DEF_PROPS.baseline,
        displayType: ccp.displayType || DEF_PROPS.displayType,
        borderVisibility: ccp.borderVisibility || DEF_PROPS.borderVisibility,
        borderStyle: ccp.borderStyle || DEF_PROPS.borderVisibility,
        borderMode: ccp.borderMode || DEF_PROPS.borderMode,
        shadowVisibility: ccp.shadowVisibility,
        isSticky: ccp.isSticky || ccp.stickied,

        // IE
        width: cell.getColumnConfig().width,
        cellType: cell.CheckBoxCell ? 'checkbox' : cell.LadderContentCell ? 'ladder' : 'base',
        fixedZIndex: getFixedZIndex(
            columnScrollProps.hasColumnScroll,
            columnScrollProps.columnScrollIsFixedCell
        ),
    };

    return dataCellProps;
}
