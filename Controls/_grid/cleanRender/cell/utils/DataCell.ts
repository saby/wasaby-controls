import {
    IDataCellComponentProps,
    IDataCellDecorationStyleProps,
} from 'Controls/_grid/cleanRender/cell/interface/IDataCellComponent';
import { GridCell, GridRow } from 'Controls/gridDisplay';
import { getRowSeparators } from 'Controls/_grid/cleanRender/cell/utils/Props/RowSeparator';
import { getColumnSeparators } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnSeparator';
import { shouldDisplayEditArrow } from 'Controls/_grid/cleanRender/cell/utils/Props/EditArrow';
import { TBackgroundStyle } from 'Controls/interface';
import { getCellComponentMasterStyleProps } from 'Controls/_grid/compatibleLayer/utils/masterDecorationStyleUtils';

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

export function getDataCellComponentProps(
    props: IGetDataCellCellComponentProps
): IDataCellComponentProps {
    const { cellComponentProps: ccp, cell, row } = props;

    const dataCellProps = {
        ...ccp,

        ...getRowSeparators({ cell, row }),
        ...getColumnSeparators({ cell }),

        ...(props.decorationStyle !== 'master'
            ? {}
            : (getCellComponentMasterStyleProps(cell, ccp) as IDataCellComponentProps)),

        editArrowVisible: shouldDisplayEditArrow({ cell, row }),

        backgroundColorStyle: ccp.backgroundStyle || ccp.backgroundColorStyle,
        hoverBackgroundStyle: ccp.hoverBackgroundStyle || DEF_PROPS.hoverBackgroundStyle,
        cursor: ccp.cursor || DEF_PROPS.cursor,
        valign: ccp.valign || DEF_PROPS.valign,
        baseline: ccp.baseline || DEF_PROPS.baseline,
        displayType: ccp.displayType || DEF_PROPS.displayType,
        borderVisibility: ccp.borderVisibility || DEF_PROPS.borderVisibility,
        borderStyle: ccp.borderStyle || DEF_PROPS.borderVisibility,
        borderMode: ccp.borderMode || DEF_PROPS.borderMode,
        shadowVisibility: ccp.shadowVisibility,
        isSticky: ccp.isSticky || ccp.stickied,
    };

    if (cell.CheckBoxCell) {
        dataCellProps.paddingLeft = 'grid_null';
        dataCellProps.paddingRight = 'grid_null';
        dataCellProps.paddingTop = 'null';
        dataCellProps.paddingBottom = 'null';
    }
    const isFirstColumnAfterCheckbox =
        cell.getColumnIndex(false, false) === 1 && row.hasMultiSelectColumn();
    if (isFirstColumnAfterCheckbox) {
        dataCellProps.paddingLeft = 'grid_null';
    }

    return dataCellProps;
}
