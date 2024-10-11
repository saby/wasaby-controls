/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import * as React from 'react';
import { CollectionItemContext } from 'Controls/baseList';
import { CustomExpanderConnectedComponent } from 'Controls/baseTree';
import {
    GridRow,
    GridView,
    IGridViewProps,
    IRowComponentProps,
    getRowComponent as getGridRowComponent,
    GroupCellComponent,
} from 'Controls/grid';
import { TreeGridCellComponent } from 'Controls/_treeGrid/cell/CellComponent';
import { HierarchicalLevelPadding } from 'Controls/_treeGrid/cleanRender/HierarchicalLevelPadding';
import TreeGridReactRowComponent, {
    getCleanCellComponent,
    getCompatibleCellComponent,
    getDirtyCellComponentContentRender,
} from 'Controls/_treeGrid/row/RowComponent';
import EditRowWrapper from 'Controls/_grid/gridReact/row/EditRowWrapper';

/*
 * Функция, для рассчета классов, передаваемых компоненту ряда
 */
function getRowClassName(item: GridRow, className?: string): string {
    let rowClassName = className ? ' ' + className : '';
    if (item['[Controls/treeGrid:TreeGridGroupDataRow]']) {
        rowClassName += ` controls-ListView__group${item.isHiddenGroup() ? 'Hidden' : ''}`;
    }
    return rowClassName;
}

/*
 * Функция, необходимая для предобработки компонента ряда (обертка в контекст, подгрузка шаблона, если он был передан и тд )
 */
export function getRowComponent(
    item: GridRow,
    props: IGridViewProps,
    rowProps: IRowComponentProps
): React.ReactElement {
    const {
        itemHandlers,
        onValidateCreated,
        onValidateDestroyed,
        itemTemplate,
        nodeFooterTemplate,
    } = props;
    const className = getRowClassName(item, rowProps.className);
    let row;
    if (item['[Controls/tree:TreeNodeFooterItem]']) {
        // Футер узла НИКОГДА не рендерится через прикладной шаблон ItemTemplate.
        // nodeFooterTemplate - шаблон ячейки, он всегда рендерится в платформенном RowComponent.
        row = (
            <TreeGridReactRowComponent
                {...rowProps}
                className={className}
                cCount={props.cCount}
                _$FunctionalCellComponent={props._$FunctionalCellComponent}
            />
        );
    } else if (!itemTemplate && !item['[Controls/_display/grid/GroupRow]']) {
        const _$FunctionalCellComponent = item['[Controls/treeGrid:TreeGridGroupDataRow]']
            ? GroupCellComponent
            : props._$FunctionalCellComponent;
        const rowGroupProperty = item.getOwner().getGroupProperty();
        row = (
            <TreeGridReactRowComponent
                {...rowProps}
                className={className}
                _$FunctionalCellComponent={_$FunctionalCellComponent}
                expanderTemplate={CustomExpanderConnectedComponent}
                cCount={props.cCount}
                groupProperty={rowGroupProperty}
            />
        );
    }
    if (row) {
        if (item.isEditing()) {
            row = (
                <EditRowWrapper
                    item={item.contents}
                    handlers={itemHandlers}
                    onValidateCreated={onValidateCreated}
                    onValidateDestroyed={onValidateDestroyed}
                >
                    {row}
                </EditRowWrapper>
            );
        }
        return (
            <CollectionItemContext.Provider value={item} key={item.key}>
                {row}
            </CollectionItemContext.Provider>
        );
    }

    return getGridRowComponent(item, props, {
        ...rowProps,
        className,
        _$getCompatibleCellComponent:
            rowProps._$getCompatibleCellComponent ?? getCompatibleCellComponent,
        _$getCleanCellComponent: rowProps._$getCleanCellComponent ?? getCleanCellComponent,
        _$getDirtyCellComponentContentRender:
            rowProps._$getDirtyCellComponentContentRender ?? getDirtyCellComponentContentRender,
    });
}

export function ReactTreeGridView(props: IGridViewProps) {
    const _getRowComponent = props._$getRowComponent ?? getRowComponent;
    const _$FunctionalRowComponent = props._$FunctionalRowComponent ?? TreeGridReactRowComponent;
    return (
        <GridView
            {...props}
            _$getRowComponent={_getRowComponent}
            _$FunctionalCellComponent={TreeGridCellComponent}
            _$FunctionalRowComponent={_$FunctionalRowComponent}
            beforeItemContentRender={HierarchicalLevelPadding}
        />
    );
}
