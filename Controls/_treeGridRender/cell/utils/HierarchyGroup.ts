import {
    IGroupRowComponentProps,
    IGroupCellComponentProps,
    PaddingRenderUtils,
    StickyPropsUtils,
} from 'Controls/gridRender';
import type { GridCell } from 'Controls/gridDisplay';

import type { TreeGridGroupDataCell, TreeGridGroupDataRow } from 'Controls/treeGridDisplay';
import { ITreeGridColumnConfig } from 'Controls/_treeGridRender/interface/ITreeGridColumnConfig';
import { IHierarchyGroupDataCellComponentProps } from 'Controls/_treeGridRender/cell/HierarchyGroup';

interface IGetHierarchyGroupCellComponentProps {
    cell: TreeGridGroupDataCell;
    row: TreeGridGroupDataRow;
    rowProps: IGroupRowComponentProps;
}

// Отдельная утилита, т.к. для иерархической группировки настройка производится через groupNodeConfig,
// И частично берёт параметры из RowProps (В совместимости это ItemTemplate).
// TODO надо сводить настройки группы и иерархической группировки. Они должны быть одинаковые.
//  тогда можно будет убрать этот файл. Например, так:
//  1. Убрать groupNodeConfig
//  2. Сделать getGroupProps или на уровне column или чтобы он принимал cell в параметры.
export function getHierarchyGroupCellComponentProps(
    props: IGetHierarchyGroupCellComponentProps
): IHierarchyGroupDataCellComponentProps {
    const { cell, row, rowProps } = props;
    const cellConfig: ITreeGridColumnConfig = cell.getColumnConfig();

    const getCellPropsResult = cellConfig?.getCellProps
        ? cellConfig?.getCellProps(row.getContents())
        : {};

    // padding
    const padding = {
        ...PaddingRenderUtils.getPaddingsObject({
            cell,
            row,
            paddingTop: getCellPropsResult.paddingTop || 's',
            paddingBottom: getCellPropsResult.paddingBottom || '2xs',
            paddingLeftDefault: 'null',
            paddingRightDefault: 'null',
        }),
        ...cellConfig.groupNodeConfig?.padding,
    };

    const colspanParams = cell.getColspanParams();
    const stickyProps = StickyPropsUtils.getStickyProps({ cell: cell as unknown as GridCell, row });

    const renderProps: IGroupCellComponentProps = {
        ...getCellPropsResult,

        // sticky
        ...stickyProps,

        // ItemActions
        actionHandlers: rowProps?.actionHandlers,
        actionsVisibility: rowProps?.actionsVisibility,
        actionsPosition: rowProps?.actionsPosition,
        actionsClassName: rowProps?.actionsClassName,

        expanderPosition: 'left',
        textRender: cell.getDefaultDisplayValue(),
        fontSize: cellConfig?.fontSize || getCellPropsResult?.fontSize || rowProps?.fontSize,
        fontWeight:
            cellConfig?.fontWeight || getCellPropsResult?.fontWeight || rowProps?.fontWeight,
        fontColorStyle:
            cellConfig?.fontColorStyle ||
            getCellPropsResult?.fontColorStyle ||
            rowProps?.fontColorStyle,
        textTransform: rowProps?.textTransform,
        expanded: cell.isExpanded(),
        decorationStyle: cell.getStyle(),
        // В разных ячейках может быть разный шрифт, но выравнивание настраивается одинаковое для всей строки
        baseline: rowProps.fontSize,
        // Вертикальное выравнивание в ячейке группы - всегда по центру, но контент внутри выравнивается по единой базовой линии.
        valign: 'center',
        hoverBackgroundStyle:
            getCellPropsResult?.hoverBackgroundStyle || rowProps?.hoverBackgroundStyle || 'default',
        contentRender: cell.getDefaultDisplayValue(),

        padding,

        isGroupNode: true,

        // DataCell only
        halign:
            getCellPropsResult?.halign ||
            getCellPropsResult?.align ||
            rowProps.halign ||
            cellConfig.align,
        // По умолчанию highlightOnHover включено, но на rowProps может прийти false
        highlightOnHover: rowProps.highlightOnHover ?? true,

        // colspan
        startColumn: colspanParams?.startColumn || 'auto',
        endColumn: colspanParams?.endColumn || 'auto',

        // first last cell
        isFirstCell: cell.isFirstColumn(),
        isLastCell: cell.isLastColumn(),
    };

    // В этом случае рендерится шаблон заголовка группы с заданными в groupNodeConfig настройками
    // TODO вынести пропсы для совместимости в утилиту в Grid, и объединить
    if (cellConfig.groupNodeConfig) {
        // прокидываем все опции
        Object.keys(cellConfig.groupNodeConfig).forEach((key) => {
            if (key === 'padding') {
                renderProps.padding = {
                    ...renderProps.padding,
                    ...cellConfig.groupNodeConfig.padding,
                };
            } else {
                renderProps[key as keyof IGroupCellComponentProps] =
                    cellConfig.groupNodeConfig[key];
            }
        });
        // прокидываем совместимость
        if (cellConfig.groupNodeConfig.separatorVisibility !== undefined) {
            renderProps.separatorVisible = cellConfig.groupNodeConfig.separatorVisibility;
        }
        if (cellConfig.groupNodeConfig.expanderAlign) {
            renderProps.expanderPosition = cellConfig.groupNodeConfig.expanderAlign;
        }
        if (cellConfig.groupNodeConfig.textAlign) {
            renderProps.halign = cellConfig.groupNodeConfig.textAlign;
        }
        if (cellConfig.groupNodeConfig.render) {
            renderProps.contentRender = cellConfig.groupNodeConfig.render;
            renderProps.textRender = cellConfig.groupNodeConfig.render;
        }
        if (cellConfig.groupNodeConfig.contentTemplate) {
            renderProps.contentRender = cellConfig.groupNodeConfig.contentTemplate;
            renderProps.customTemplateProps = {
                item: row,
                itemData: row,
                column: cell,
            };
        }
        renderProps.padding = {
            ...padding,
            ...renderProps.padding,
        };
    }

    return renderProps;
}
