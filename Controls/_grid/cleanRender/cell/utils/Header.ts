import * as React from 'react';
import {
    IHeaderCellComponentProps,
    IHeaderCellConfig,
} from 'Controls/_grid/cleanRender/cell/HeaderCellComponent';
import {
    GridHeaderCell,
    GridHeaderRow,
    ICellContentOrientation,
    ICellPadding,
    TCellVerticalAlign,
} from 'Controls/baseGrid';
import {
    getHorizontalPaddingProp,
    IPartialColumnsConfigForGetPadding,
} from 'Controls/_grid/cleanRender/cell/utils/Props/Padding';
import { getStickyProps } from 'Controls/_grid/cleanRender/cell/utils/Props/Sticky';
import { getColumnScrollProps } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnScroll';
import { IRowComponentProps, TCellHorizontalAlign } from 'Controls/grid';
import { getColumnSeparators } from 'Controls/_grid/cleanRender/cell/utils/Props/ColumnSeparator';
import { TGridHPaddingSize } from 'Controls/_interface/GridInterfaces';
import { getBackgroundColorStyle } from 'Controls/_grid/cleanRender/cell/utils/Props/BackgroundColorStyle';
import getFixedZIndex from 'Controls/_grid/cleanRender/cell/utils/Props/ZIndex';

interface IHeaderCellCompatibleConfig extends IHeaderCellConfig {
    title?: string;
    getCellProps?: Function;
    render?: React.ReactElement;
}

interface IGetHeaderCellComponentProps {
    cell: GridHeaderCell;
    row: GridHeaderRow;
    rowProps?: IRowComponentProps;
}

function calcContentOrientation(
    cell: GridHeaderCell,
    alignFromGetCellProps: ICellContentOrientation,
    row: GridHeaderRow
): ICellContentOrientation {
    const result = {
        align: 'start',
        valign: 'baseline',
    };
    /*
     * Выравнивание задается со следующим приоритетом
     * 1) Выравнивание заданное на ячейки шапки
     * 2) Если колонка растянута, то по умолчанию контент выравнивается по середине
     * 3) Контент выравнивается также, как контент колонки данных
     * 4) По верхнему левому углу
     * */

    //TODO
    const get = (prop: 'align' | 'valign'): string => {
        const gridUnit = prop === 'align' ? 'Column' : 'Row';
        if (
            typeof cell.column[`start${gridUnit}`] !== 'undefined' &&
            typeof cell.column[`end${gridUnit}`] !== 'undefined' &&
            cell.column[`end${gridUnit}`] - cell.column[`start${gridUnit}`] > 1
        ) {
            return 'center';
        } else if (typeof cell.column.startColumn !== 'undefined') {
            // ВНИМАТЕЛЬНО! Независимо от оси для которой считается выравнивание, считать нужно через startColumn,
            // т.к. чтобы получить корректное значение для выравнивания контента растянутой ячейки заголовка по
            // опции колонки данных, нужно получить конфигурацию колонки расположенной под данной ячейкой заголовка.
            return row.getGridColumnsConfig()[cell.column.startColumn - 1][prop] as string;
        } else if (cell.isLadderCell()) {
            // Ячейки лесенки нет в headerConfig, поэтому строка из else ниже просто выдаст ошибку.
            // Зато у ячеки лесенки есть методы getAlign и getVAlign.
            return cell[prop === 'align' ? 'getAlign' : 'getVAlign']?.() as string;
        } else {
            // По умолчанию берём значение из оригинальной  колонки по индексу ячейки заголовка.
            // Эти строчки работают только если ячейка присутствует в оригинальных ячейках.
            // Например, ячейки лесенки там нет и эта строка будет выдавать ошибку.
            const originalColumnIndex = row.getHeaderConfig().indexOf(cell.column);
            return row.getGridColumnsConfig()[originalColumnIndex][prop];
        }
    };

    if (alignFromGetCellProps.align || alignFromGetCellProps.halign) {
        result.align = alignFromGetCellProps.align || alignFromGetCellProps.halign;
    } else if (cell.column.align || cell.column.halign) {
        result.align = cell.column.align || cell.column.halign;
    } else {
        const getAlignResult = get('align');
        if (getAlignResult) {
            result.align = getAlignResult as TCellHorizontalAlign;
        }
    }

    if (alignFromGetCellProps.valign) {
        result.valign = alignFromGetCellProps.valign;
    } else if (cell.column.valign) {
        result.valign = cell.column.valign;
    } else {
        const getVAlignResult = get('valign');
        if (getVAlignResult) {
            result.valign = getVAlignResult as TCellVerticalAlign;
        }
    }

    return result as ICellContentOrientation;
}

export function getHeaderCellComponentProps(
    props: IGetHeaderCellComponentProps
): IHeaderCellComponentProps {
    const { cell, row } = props;
    const cellConfig = cell.getColumnConfig() as IHeaderCellCompatibleConfig;
    const getCellPropsResult = cellConfig?.getCellProps ? cellConfig?.getCellProps() : {};
    const colspanParams = cell.getColspanParams();
    const rowspanParams = cell.getRowspanParams();
    const rowLeftPadding = row.getLeftPadding();
    const rowRightPadding = row.getRightPadding();

    const columnsConfig: IPartialColumnsConfigForGetPadding[] = [];

    row.getGridColumnsConfig().forEach((gridColumn) => {
        const columnConfig: IPartialColumnsConfigForGetPadding = {};

        if (gridColumn.cellPadding) {
            columnConfig.cellPadding = gridColumn.cellPadding as ICellPadding;
        }

        // getCellProps сейчас одинаковый для всех ячеек и не имеет смысла, нужно переходить на gridColumn.cellConfig
        if (cellConfig.getCellProps) {
            columnConfig.getCellProps = cellConfig.getCellProps;
        }

        columnsConfig.push(columnConfig);
    });

    const padding = getHorizontalPaddingProp({
        cell,
        columnsConfig,
        getCellsPropsParams: () => ({}),
        rowLeftPadding: (rowLeftPadding ? `list_${rowLeftPadding}` : '') as TGridHPaddingSize,
        rowRightPadding: (rowRightPadding ? `list_${rowRightPadding}` : '') as TGridHPaddingSize,
        hasMultiSelectColumn: row.hasMultiSelectColumn(),
    });

    const stickyProps = getStickyProps({ cell, row });
    const columnScrollProps = getColumnScrollProps({ cell, row });

    const contentOrientation = calcContentOrientation(cell, getCellPropsResult, row);

    const resultProps = {
        // cellProps from callback
        ...getCellPropsResult,

        // выравнивание контента заголовка
        ...contentOrientation,
        baseline: getCellPropsResult.baseline || cellConfig.baseline,

        // текст заголовка
        caption: cellConfig.caption || cellConfig.title,
        textOverflow: getCellPropsResult.textOverflow || cellConfig.textOverflow,
        whiteSpace: cellConfig.whiteSpace,

        // сортировка
        sortingValue: cell.getSorting(),
        sortingIcon: cellConfig.sortingIcon,
        sortingProperty: cellConfig.sortingProperty,

        // многоуровневый заголовок
        isMultiline: row.isMultiline(),
        startRow: rowspanParams.startRow,
        endRow: rowspanParams.endRow,
        startColumn: colspanParams?.startColumn || cellConfig?.startColumn,
        endColumn: colspanParams?.endColumn || cellConfig?.endColumn,
        headerEndRow: row.getBounds().row.end,

        // style
        decorationStyle: cell.getStyle(),

        // отступы
        padding,

        // тип ячейки
        cellType: cell.CheckBoxCell ? 'checkbox' : cell.LadderContentCell ? 'ladder' : 'base',

        // результаты
        resultsPosition: (row.hasResults() && row.getResultsPosition()) || '',

        // фон
        backgroundColorStyle: getBackgroundColorStyle({
            listBackgroundStyle: row.getOwner().getBackgroundStyle(),
            getCellPropsResult,
            cellConfig,
            isFixedCell:
                columnScrollProps.hasColumnScroll && columnScrollProps.columnScrollIsFixedCell,
        }),

        // cursor
        cursor: getCellPropsResult.cursor || 'text',

        // wrapper
        tooltip: cellConfig.title || cellConfig.tooltip,
        'data-qa': getCellPropsResult['data-qa'] || 'cell',

        hideContentRender: cell.isLadderCell(),

        // sticky
        ...stickyProps,

        // columnScroll
        ...columnScrollProps,

        // separators
        ...getColumnSeparators({ cell }),

        // z-index
        fixedZIndex:
            getCellPropsResult.fixedZIndex ||
            getFixedZIndex(
                columnScrollProps.hasColumnScroll,
                columnScrollProps.columnScrollIsFixedCell
            ),
    };
    if (cellConfig.render) {
        resultProps.contentRender = cellConfig.render;
    }
    return resultProps;
}
