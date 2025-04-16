import * as React from 'react';
import {
    getCompatibleCellComponent as getCompatibleGridCellComponent,
    getCleanCellComponent as getCleanGridCellComponent,
    ICellComponentProps,
    IRowComponentProps,
    RowComponent,
    IColumnConfig,
    templateLoader,
    GroupCellComponent,
    getDirtyCellComponentContentRender as getDirtyGridCellComponentContentRender,
    IBeforeContentRenderProps,
    CellPropsUtils,
    initValidator,
} from 'Controls/gridRender';
import type {
    GridHeaderCell,
    GridFooterCell,
    GridResultsCell,
    GridCell,
} from 'Controls/gridDisplay';
import {
    TreeGridNodeExtraItemCell,
    TreeGridNodeHeaderRow,
    TreeGridNodeFooterRow,
} from 'Controls/treeGridDisplay';
import { LevelPadding } from 'Controls/_treeGridRender/components/LevelPadding';
import NodeFooterCellComponent, {
    INodeExtraItemCellComponentProps,
} from 'Controls/_treeGridRender/cell/NodeExtraItem';
import { getNodeExtraItemCellComponentProps } from 'Controls/_treeGridRender/cell/utils/NodeExtraItem';
import { getHierarchyGroupCellComponentProps } from 'Controls/_treeGridRender/cell/utils/HierarchyGroup';
import HierarchyGroupDataCellComponent from 'Controls/_treeGridRender/cell/HierarchyGroup';
import { isTreeGroupNodeCell } from 'Controls/_treeGridRender/utils/Type';
import { getGroupChildRowComponentClasses } from 'Controls/_treeGridRender/row/utils/HierarchyGroup';

// Возвращает компоненты строки, совместимые с wasaby-рендером
export function getCompatibleCellComponent(
    cell: GridCell,
    baseCellProps: ICellComponentProps,
    baseRowProps: IRowComponentProps,
    multiSelectTemplate: React.ReactElement,
    beforeContentRender?: React.FunctionComponent<IBeforeContentRenderProps>
): React.ReactElement | null | undefined {
    const rowProps = { ...baseRowProps };
    let cellProps = { ...baseCellProps };
    delete rowProps['data-qa'];
    delete rowProps.attrs;

    const cellConfig = cell.config as unknown as IColumnConfig;
    const checkValidator = baseRowProps._$checkTemplateValidator;

    // СНАЧАЛА ПРИХОДИМ СЮДА
    if (isTreeGroupNodeCell(cell)) {
        if (CellPropsUtils.isFirstDataCell(cell) || cellConfig?.groupNodeConfig) {
            return; // рендерим чистую ячейку с шаблоном группы
        }
        // Рендерим прикладной шаблон через ячейку данных иерархической группы
        rowProps._$FCC = HierarchyGroupDataCellComponent;
        cellProps = {
            ...cellProps,
            ...getHierarchyGroupCellComponentProps({
                cell,
                row: cell.getOwner(),
                rowProps,
            }),
        };
    }

    if ((cell as unknown as TreeGridNodeExtraItemCell).$TGNEC) {
        if (!cellConfig.template) {
            return;
        }
        const compatibleCallValidator = initValidator();
        const renderProps = {
            ...getNodeExtraItemCellComponentProps({
                cell: cell as unknown as TreeGridNodeExtraItemCell,
                row: cell.getOwner() as unknown as TreeGridNodeFooterRow,
                rowProps,
            }),
            key: cell.key,
            gridColumn: cell,
            column: cell,
            itemData: cell,
            colData: cell,
            item: cell.getOwner(),
            node: cell.getOwner().getNode(),
            _$compatibleCallValidator: compatibleCallValidator,
            _$expectedTemplate: 'NodeFooterTemplate',
        };
        const render = templateLoader(cellConfig.template, renderProps);
        checkValidator(compatibleCallValidator, 'NodeFooterTemplate');
        return render;
    }

    return getCompatibleGridCellComponent(
        cell,
        cellProps,
        rowProps,
        multiSelectTemplate,
        beforeContentRender
    );
}

// getCleanCellComponent возвращает максимально чистый и правильный react-компонент ячейки.
// Под чистым понимается цельный, итоговый, вставляемый без доп. оберток и расчётов react-компонент ячейки.
// Сейчас чистыми реализованы компоненты headerCell, footerCell, resultsCell, nodeFooterCell.
export function getCleanCellComponent(
    cell: GridCell | GridHeaderCell | GridFooterCell | GridResultsCell,
    baseRowProps?: IRowComponentProps
) {
    const rowProps = { ...baseRowProps };
    const cellConfig = cell.config as unknown as IColumnConfig;
    if ((cell as unknown as TreeGridNodeExtraItemCell).$TGNEC) {
        const renderProps: INodeExtraItemCellComponentProps = {
            ...getNodeExtraItemCellComponentProps({
                cell: cell as unknown as TreeGridNodeExtraItemCell,
                row: cell.getOwner() as unknown as TreeGridNodeHeaderRow | TreeGridNodeFooterRow,
                rowProps,
            }),
            key: cell.key,
        };

        renderProps.beforeContentRender = (
            <LevelPadding
                cell={cell}
                withoutLevelPadding={renderProps.withoutLevelPadding}
                withoutExpanderPadding={renderProps.withoutExpanderPadding}
            />
        );

        return <NodeFooterCellComponent {...renderProps} />;
    }

    // СЮДА ПРИХОДИМ ПРИ НАСТРОЙКАХ ПО УМОЛЧАНИЮ, КОГДА ВСЁ ДОЛЖНЫ ПОСЧИТАТЬ САМИ И ВЫДАТЬ БЕЗ ИЗМЕНЕНИЙ
    if (isTreeGroupNodeCell(cell)) {
        const renderProps = getHierarchyGroupCellComponentProps({
            cell,
            row: cell.getOwner(),
            rowProps,
        });

        if (CellPropsUtils.isFirstDataCell(cell) || cellConfig?.groupNodeConfig) {
            return <GroupCellComponent {...renderProps} key={cell.key} />;
        }

        // TODO Это должно работать аналогично простой ячейке данных
        //  Когда ячейка данных будет clean. то и тут будет честный clean
        const contentRender = getDirtyGridCellComponentContentRender(cell, renderProps, null);
        return (
            <HierarchyGroupDataCellComponent
                {...renderProps}
                key={cell.key}
                contentRender={contentRender || renderProps.contentRender}
            />
        );
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
    const className = props.className
        ? props.className
        : '' + getGroupChildRowComponentClasses(props);
    return (
        <RowComponent
            {...props}
            className={className}
            ref={ref}
            _$getCompatibleCellComponent={_getCompatibleCellComponent}
            _$getCleanCellComponent={_getCleanCellComponent}
        />
    );
}

export default React.forwardRef(TreeGridReactRowComponent);
