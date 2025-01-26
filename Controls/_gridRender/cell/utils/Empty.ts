/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import type { GridEmptyCell, GridEmptyRow } from 'Controls/gridDisplay';
import { TGridHPaddingSize, TGridVPaddingSize, IAlignProps } from 'Controls/interface';
import { getPaddingsObject } from 'Controls/_gridRender/cell/utils/Props/Padding';
import { getColumnScrollProps } from 'Controls/_gridRender/cell/utils/Props/ColumnScroll';
import {
    IContentRenderProps,
    IEmptyCellComponentProps,
} from 'Controls/_gridRender/cell/interface/IEmptyCellComponent';
import { IRowComponentProps } from 'Controls/_gridRender/row/interface/IRowComponent';

interface IGetEmptyCellComponentProps {
    cell: GridEmptyCell;
    row: GridEmptyRow;
    rowProps: IRowComponentProps;
}

/**
 * Возвращает пропсы, необходимые для рендера ячейки пустой таблицы
 * @private
 */
export function getEmptyCellProps(props: IGetEmptyCellComponentProps): IEmptyCellComponentProps {
    const { cell, row, rowProps } = props;
    const cellConfig = cell.getColumnConfig();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const getCellPropsResult = cellConfig.getCellProps?.(row) || cellConfig.templateOptions || {};
    const isSingleCell = cell.isSingleColspanedCell && !!row.getRowTemplate();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const halign = getCellPropsResult?.halign || cellConfig?.align || rowProps.halign || 'center';
    // baseline по умолчанию необходим для случая с добавлением по месту.
    const valign =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        getCellPropsResult?.valign || cellConfig?.valign || rowProps.valign || 'baseline';
    const padding =
        cell.isMultiSelectColumn() || isSingleCell
            ? {
                  left: 'null',
                  right: 'null',
                  top: 'null',
                  bottom: 'null',
              }
            : getPaddingsObject({
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  cell,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  row,
                  // paddingTop и paddingBottom по умолчанию для случая с добавлением по месту.
                  paddingTop: rowProps.paddingTop,
                  paddingBottom: rowProps.paddingBottom,
                  paddingTopDefault: 'l',
                  paddingBottomDefault: 'l',
              });

    // columnScroll
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const columnScrollProps = getColumnScrollProps({ cell, row });

    // Если ячейка только одна и высота тянется (по умолчанию), то выравнивание задаётся флексом
    const flexAlignment: boolean = isSingleCell && getCellPropsResult?.height !== 'auto';

    // Мы считаем, что EmptyView и EmptyTemplateColumns это одно и то же, но требуем разного оформления.
    // halign задаётся только для случая, когда задают EmptyView по-новому.
    const alignmentProps: IAlignProps = {
        halign: flexAlignment || cell?.getHasEmptyView() ? halign : undefined,
        valign,
    };
    // leftSeparatorSize и backgroundColorStyle не устанавливаются для случая, когда задают EmptyView по-новому.
    const leftSeparatorSize = cell?.getHasEmptyView() ? 'null' : cell.getColumnSeparatorSize();
    // По умолчанию EmptyCellComponent принимает цвет editing_default. Чтобы избежать этой логики,
    // надо научиться определять, что мы показываем шаблон с добавлением по месту,
    // + backgroundColorStyle никогда не применяется для isSingleCell
    const backgroundColorStyle = !cell?.getHasEmptyView()
        ? getCellPropsResult.backgroundColorStyle ||
          rowProps.backgroundColorStyle ||
          'editing_default'
        : undefined;

    // colspanParams
    const colspanParams = cell.getColspanParams();

    const paddingProps = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        paddingLeft: padding.left as TGridHPaddingSize,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        paddingRight: padding.right as TGridHPaddingSize,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        paddingTop: padding.top as TGridVPaddingSize,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        paddingBottom: padding.bottom as TGridVPaddingSize,
    };

    // У рендера контента свои padding и halign, которые может настраивать прикладник.
    // Это нужно только для совместимости при работе с wasaby синтаксисом.
    const contentRenderProps: IContentRenderProps = {
        ...paddingProps,
        halign: alignmentProps.halign,
    };

    return {
        // padding
        ...paddingProps,

        // alignment
        ...alignmentProps,

        // Выравнивание флексом
        flexAlignment,

        // column scroll
        ...columnScrollProps,

        // MultiSelect
        cellType: !isSingleCell && cell.isMultiSelectColumn() ? 'checkbox' : 'base',

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        leftSeparatorSize,

        // background
        backgroundColorStyle,

        // border radius
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        topLeftBorderRadius: row.getTopLeftRoundBorder(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        topRightBorderRadius: row.getTopRightRoundBorder(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        bottomLeftBorderRadius: row.getBottomLeftRoundBorder(),
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        bottomRightBorderRadius: row.getBottomRightRoundBorder(),

        // Colspan
        colspan: cell.getColspan(),
        startColspanIndex: colspanParams?.startColumn,
        endColspanIndex: colspanParams?.endColumn,
        isSingleCell,

        // editing
        editing: cell.isEditing(),

        // Стиль master | default
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        decorationStyle: cell.getStyle(),

        // Курсор
        cursor: 'default',

        // compatibility
        // Флаг позволяющий отключить обёртку contentRender в div
        // при использовании прикладного шаблона, т.к. обёртка делается на уровне самого прикладного шаблона.
        wrapContentRender: !cell.getTemplate(),

        // compatibility
        // пропсы, которые отдаются в div, оборачивающий contentRender.
        contentRenderProps,
    };
}
