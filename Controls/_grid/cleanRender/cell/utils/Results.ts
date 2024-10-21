import {
    IResultsCellComponentProps,
    IResultsCellConfig,
} from 'Controls/_grid/cleanRender/cell/ResultsCellComponent';
import { GridResultsCell, GridResultsRow, ICellPadding } from 'Controls/baseGrid';
import { IBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/BaseCellComponent';
import { getStickyProps } from 'Controls/_grid/cleanRender/cell/utils/Props/Sticky';
import { getColumnScrollProps } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnScroll';
import {
    getHorizontalPaddingProp,
    IPartialColumnsConfigForGetPadding,
} from 'Controls/_grid/cleanRender/cell/utils/Props/Padding';
import { TGridHPaddingSize } from 'Controls/_interface/GridInterfaces';
import { getColumnSeparators } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnSeparator';
import getFixedZIndex from 'Controls/_grid/cleanRender/cell/utils/Props/ZIndex';

interface IResultsCellCompatibleConfig extends IResultsCellConfig {
    title?: string;
}

interface IGetResultsCellComponentProps
    extends Pick<
        IBaseCellComponentProps,
        | 'className'
        | 'data-qa'
        | 'contentRender'
        | 'onClick'
        | 'onMouseMove'
        | 'onMouseEnter'
        | 'style'
    > {
    cell: GridResultsCell;
    row?: GridResultsRow;
}

function getPaddingProp(props: Pick<IGetResultsCellComponentProps, 'cell' | 'row'>) {
    const { cell, row = cell.getOwner() } = props;
    const rowLeftPadding = row.getLeftPadding();
    const rowRightPadding = row.getRightPadding();

    const columnsConfig: IPartialColumnsConfigForGetPadding[] = [];

    row.getGridColumnsConfig().forEach((gridColumn) => {
        columnsConfig.push({
            cellPadding: gridColumn.cellPadding as ICellPadding,
            getCellProps: gridColumn.getCellProps as Function,
        });
    });

    const hPadding = cell.CheckBoxCell
        ? { left: 'null', right: 'null' }
        : getHorizontalPaddingProp({
              cell,
              columnsConfig,
              rowLeftPadding: (rowLeftPadding ? `list_${rowLeftPadding}` : '') as TGridHPaddingSize,
              rowRightPadding: (rowRightPadding
                  ? `list_${rowRightPadding}`
                  : '') as TGridHPaddingSize,
              hasMultiSelectColumn: row.hasMultiSelectColumn(),
              //TODO: Нужно будет от такого избавиться Controls/_grid/cleanRender/cell/utils/Props/Padding.ts:71
              getCellsPropsParams: () => {},
          });

    let topPadding = cell.resultsVerticalPadding ? row.getTopPadding() : 'null';
    let bottomPadding = cell.resultsVerticalPadding ? row.getBottomPadding() : 'null';

    if (topPadding === 'default') {
        topPadding = 'grid_s';
    }

    if (bottomPadding === 'default') {
        bottomPadding = 'grid_s';
    }

    return { ...hPadding, top: topPadding, bottom: bottomPadding };
}

export function getResultsCellComponentProps(
    props: IGetResultsCellComponentProps
): IResultsCellComponentProps {
    const { cell, row = cell.getOwner() } = props;
    const cellConfig = cell.getColumnConfig() as IResultsCellCompatibleConfig;

    const padding = getPaddingProp(props);

    const stickyProps = getStickyProps({ cell, row });
    const columnScrollProps = getColumnScrollProps({ cell, row });
    const cellProps = cellConfig.getCellProps ? cellConfig.getCellProps?.(row) : null;

    const resultsPosition = row.getResultsPosition() || '';

    const resultProps = {
        padding,
        data: cell.data,
        results: cell.getMetaResults(),
        format: cell.format,
        className: props.className,
        baseline: cellConfig.baseline,
        align: cellProps?.halign || cellConfig.align,
        textOverflow: cellConfig.textOverflow,
        backgroundColorStyle: cellConfig.backgroundColorStyle || cellConfig.backgroundStyle,
        fontColorStyle: cellConfig.fontColorStyle,
        fontSize: cellConfig.fontSize,
        fontWeight: cellConfig.fontWeight,
        style: props.style,
        startColspanIndex: cell.getColspanParams()?.startColumn || cellConfig?.startColumn,
        endColspanIndex: cell.getColspanParams()?.endColumn || cellConfig?.endColumn,
        // cCountStart и cCountEnd: определён тут Controls/_grid/dirtyRender/cell/interface.ts:350
        isLastCell: cell.isLastColumn(),
        resultsPosition,
        resultsVerticalPadding: cell.resultsVerticalPadding,

        // separators
        ...getColumnSeparators({ cell }),

        //tabIndex
        'data-qa': props['data-qa'] || 'cell',

        // TODO: Если будут undefined, то сломается построение шаблона.
        // В Controls/_grid/compatibleLayer/ResultsCellComponent.tsx:10 ничего не передается и это неправильно
        onClick: props.onClick || function () {},
        onMouseEnter: props.onMouseEnter || function () {},
        onMouseMove: props.onMouseMove || function () {},
        hideContentRender: cell.isLadderCell(),

        ...(cellConfig.resultTemplateOptions || {}),

        // sticky
        ...stickyProps,

        // columnScroll
        ...columnScrollProps,

        // z-index
        fixedZIndex: getFixedZIndex(
            columnScrollProps.hasColumnScroll,
            columnScrollProps.columnScrollIsFixedCell,
            resultsPosition
        ),
    };
    if (props.contentRender || cellConfig?.render) {
        resultProps.contentRender = props.contentRender || cellConfig?.render;
    }
    return resultProps;
}
