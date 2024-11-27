import {
    IResultsCellComponentProps,
    IResultsCellConfig,
} from 'Controls/_grid/cleanRender/cell/ResultsCellComponent';
import { GridResultsCell, GridResultsRow } from 'Controls/gridDisplay';
import { IBaseCellComponentProps } from 'Controls/_grid/cleanRender/cell/BaseCellComponent';
import { getStickyProps } from 'Controls/_grid/cleanRender/cell/utils/Props/Sticky';
import { getColumnScrollProps } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnScroll';
import { getPaddingsObject } from 'Controls/_grid/cleanRender/cell/utils/Props/Padding';
import { getColumnSeparators } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnSeparator';
import getFixedZIndex from 'Controls/_grid/cleanRender/cell/utils/Props/ZIndex';
import { getBackgroundColorStyle } from 'Controls/_grid/cleanRender/cell/utils/Props/BackgroundColorStyle';

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

export function getResultsCellComponentProps(
    props: IGetResultsCellComponentProps
): IResultsCellComponentProps {
    const { cell, row = cell.getOwner() } = props;
    const cellConfig = cell.getColumnConfig() as IResultsCellCompatibleConfig;
    const getCellPropsResult = cellConfig?.getCellProps ? cellConfig?.getCellProps() : {};

    const padding = getPaddingsObject({
        cell,
        row,
        paddingTop: cell.resultsVerticalPadding ? row.getTopPadding() : 'null',
        // Всегда по умолчанию добавляем 3xs по задаче
        // https://online.sbis.ru/doc/549c0d83-657e-4fd3-865c-08bef5f0e482?client=3.
        paddingBottom: cell.resultsVerticalPadding ? row.getBottomPadding() : '3xs',
    });

    const stickyProps = getStickyProps({ cell, row });
    const columnScrollProps = getColumnScrollProps({ cell, row });
    const cellProps = cellConfig.getCellProps ? cellConfig.getCellProps?.(row) : null;

    const resultsPosition = row.getResultsPosition() || '';

    const resultProps = {
        // padding
        padding,

        data: cell.data,
        results: cell.getMetaResults(),
        format: cell.format,
        className: props.className,
        baseline: cellConfig.baseline,
        align: cellProps?.halign || cellConfig.align,
        textOverflow: cellConfig.textOverflow,
        backgroundColorStyle: getBackgroundColorStyle({
            listBackgroundStyle: row.getOwner().getBackgroundStyle(),
            getCellPropsResult,
            cellConfig,
            isFixedCell:
                columnScrollProps.hasColumnScroll && columnScrollProps.columnScrollIsFixedCell,
        }),
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
