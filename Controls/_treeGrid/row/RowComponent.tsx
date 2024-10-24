import * as React from 'react';
import {
    getCompatibleCellComponent as getCompatibleGridCellComponent,
    getCleanCellComponent as getCleanGridCellComponent,
    GridCell,
    ICellComponentProps,
    IRowComponentProps,
    RowComponent,
    IColumnConfig,
    templateLoader,
    GroupCellComponent,
    getDirtyCellComponentContentRender as getDirtyGridCellComponentContentRender,
    IBeforeContentRenderProps,
    DisplayTypeUtils,
} from 'Controls/grid';
import { GridHeaderCell, GridFooterCell, GridResultsCell } from 'Controls/gridDisplay';
import {
    TreeGridNodeExtraItemCell,
    TreeGridNodeHeaderRow,
    TreeGridNodeFooterRow,
} from 'Controls/treeGridDisplay';
import { HierarchicalLevelPadding } from 'Controls/_treeGrid/cleanRender/HierarchicalLevelPadding';
import NodeFooterCellComponent, {
    INodeExtraItemCellComponentProps,
} from 'Controls/_treeGrid/cleanRender/cell/NodeExtraItemCellComponent';
import { getNodeExtraItemCellComponentProps } from 'Controls/_treeGrid/cleanRender/cell/utils/NodeExtraItem';

// Возвращает компоненты строки, совместимые с wasaby-рендером
export function getCompatibleCellComponent(
    cell: GridCell,
    cellProps: ICellComponentProps,
    baseRowProps: IRowComponentProps,
    multiSelectTemplate: React.ReactElement,
    beforeContentRender?: React.FunctionComponent<IBeforeContentRenderProps>
): React.ReactElement | null | undefined {
    const rowProps = { ...baseRowProps };
    delete rowProps['data-qa'];
    delete rowProps.attrs;

    const cellConfig = cell.config as unknown as IColumnConfig;

    if (DisplayTypeUtils.isTreeGroupNodeCell(cell)) {
        rowProps._$FunctionalCellComponent = GroupCellComponent;
    }

    // Ячейку узла в виде группы можно рендерить только через GroupCellComponent,
    // поэтому во избежание рендера через cellConfig.template возвращаем undefined.
    if (DisplayTypeUtils.isTreeGroupNodeCell(cell) && cellConfig?.groupNodeConfig !== undefined) {
        return;
    }

    if (
        (cell as unknown as TreeGridNodeExtraItemCell)[
            '[Controls/treeGrid:TreeGridNodeExtraItemCell]'
        ]
    ) {
        if (!cellConfig.template) {
            return;
        }

        const renderProps = {
            ...getNodeExtraItemCellComponentProps({
                cell: cell as unknown as TreeGridNodeExtraItemCell,
                row: cell.getOwner() as unknown as TreeGridNodeFooterRow,
                rowProps,
            }),
            beforeContentRender: <HierarchicalLevelPadding cell={cell} />,
            key: cell.key,
            gridColumn: cell,
            column: cell,
            itemData: cell,
            colData: cell,
            item: cell.getOwner(),
            node: cell.getOwner().getNode(),
        };

        return templateLoader(cellConfig.template, renderProps);
    }

    return getCompatibleGridCellComponent(
        cell,
        cellProps,
        rowProps,
        multiSelectTemplate,
        beforeContentRender
    );
}

export function getDirtyCellComponentContentRender(
    cell: GridCell,
    cellProps: ICellComponentProps,
    multiSelectTemplate: React.ReactElement
): React.ReactElement {
    const cellConfig = cell.config as unknown as IColumnConfig;
    const renderCellProps = { ...cellProps };
    // Иерархическая группировка
    if (DisplayTypeUtils.isTreeGroupNodeCell(cell)) {
        if (cellConfig?.groupNodeConfig !== undefined) {
            return (
                cellConfig.groupNodeConfig.render ||
                cellConfig.groupNodeConfig.contentTemplate ||
                cell.getDefaultDisplayValue()
            );
        }

        // TODO придумать, как сделать лучше.
        //  Контент ячейки данных в строке с группой должен рендериться внутри ячейки с выравниванием по центру,
        //  но сам дожен выравниваться по базовой линии.
        //  В старом гриде рендер происходил с доп слоем cell_content, теперь этого слоя нет
        renderCellProps.contentRenderClassName =
            ' tw-items-baseline controls-GridReact__cell-baseline';
        if (renderCellProps.minHeight !== 'null' && cellProps.baseline) {
            renderCellProps.contentRenderClassName += ` controls-GridReact__cell-baseline_${cellProps.baseline}`;
        }
    }

    // getDirtyCellComponentContentRender

    return getDirtyGridCellComponentContentRender(cell, renderCellProps, multiSelectTemplate);
}

// getCleanCellComponent возвращает максимально чистый и правильный react-компонент ячейки.
// Под чистым понимается цельный, итоговый, вставляемый без доп. оберток и расчётов react-компонент ячейки.
// Сейчас чистыми реализованы компоненты headerCell, footerCell, resultsCell, nodeFooterCell.
export function getCleanCellComponent(
    cell: GridCell | GridHeaderCell | GridFooterCell | GridResultsCell,
    rowProps?: IRowComponentProps
) {
    if (
        (cell as unknown as TreeGridNodeExtraItemCell)[
            '[Controls/treeGrid:TreeGridNodeExtraItemCell]'
        ]
    ) {
        const renderProps: INodeExtraItemCellComponentProps = {
            ...getNodeExtraItemCellComponentProps({
                cell: cell as unknown as TreeGridNodeExtraItemCell,
                row: cell.getOwner() as unknown as TreeGridNodeHeaderRow | TreeGridNodeFooterRow,
                rowProps,
            }),
            key: cell.key,
            beforeContentRender: <HierarchicalLevelPadding cell={cell} />,
        };

        return <NodeFooterCellComponent {...renderProps} />;
    }

    return getCleanGridCellComponent(cell, rowProps);
}

/*
 * Компонент ряда
 */
function TreeGridReactRowComponent(
    props: IRowComponentProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const _getCompatibleCellComponent =
        props._$getCompatibleCellComponent ?? getCompatibleCellComponent;
    const _getCleanCellComponent = props._$getCleanCellComponent ?? getCleanCellComponent;
    const _getDirtyCellComponentContentRender =
        props._$getDirtyCellComponentContentRender ?? getDirtyCellComponentContentRender;
    return (
        <RowComponent
            {...props}
            ref={ref}
            _$getCompatibleCellComponent={_getCompatibleCellComponent}
            _$getCleanCellComponent={_getCleanCellComponent}
            _$getDirtyCellComponentContentRender={_getDirtyCellComponentContentRender}
        />
    );
}

export default React.memo(React.forwardRef(TreeGridReactRowComponent));
