/**
 * @kaizen_zone 6c74c736-f802-4b48-b22b-7cd14c0a2e28
 */
import * as React from 'react';
import { CollectionItemContext } from 'Controls/listsCommonLogic';
import { CustomExpanderConnectedComponent } from 'Controls/treeRender';
import {
    GridView,
    IGridViewProps,
    IRowComponentProps,
    getRowComponent as getGridRowComponent,
    GroupCellComponent,
    getGroupRowComponentClassName,
    EditRowWrapper,
} from 'Controls/gridRender';
import type { GridRow } from 'Controls/gridDisplay';
import { TreeGridCellComponent } from 'Controls/_treeGridRender/cell/Data';
import { LevelPadding } from 'Controls/_treeGridRender/components/LevelPadding';
import DefaultRC, {
    getCleanCellComponent,
    getCompatibleCellComponent,
    getDirtyCellComponentContentRender,
} from 'Controls/_treeGridRender/row/Data';

/*
 * Функция, для рассчета классов, передаваемых компоненту ряда
 */
function getRowClassName(item: GridRow, className?: string): string {
    let rowClassName = className ? ' ' + className : '';
    if (item.$TGGR) {
        rowClassName += getGroupRowComponentClassName(item);
    }
    return rowClassName;
}

/*
 * Функция, необходимая для предобработки компонента ряда (обертка в контекст, подгрузка шаблона, если он был передан и тд )
 */
export function getRowComponent(
    item: GridRow,
    props: IGridViewProps,
    baseRowProps: IRowComponentProps
): React.ReactElement {
    const {
        itemHandlers,
        onValidateCreated,
        onValidateDestroyed,
        itemTemplate,
        nodeFooterTemplate,
    } = props;
    const rowProps = { ...baseRowProps };
    rowProps.isFirstChildItem = item === item?.getParent?.().getFirstChildItem?.();
    rowProps.isLastChildItem = item === item?.getParent?.().getLastChildItem?.();
    rowProps.isGroupChild = item.$TGDR && item?.getParent?.().isGroupNode?.();
    const className = getRowClassName(item, rowProps.className);

    const parentProperty = rowProps.parentProperty || item?.getOwner?.()?.getParentProperty?.();
    if (parentProperty && item?.contents?.get?.(parentProperty)) {
        rowProps.attrs = {
            ...rowProps?.attrs,
            'item-parent-key': item.contents.get(parentProperty),
        };
    }

    let row;
    if (item.$TNF || item['[Controls/tree:TreeNodeHeaderItem]']) {
        // Футер узла НИКОГДА не рендерится через прикладной шаблон ItemTemplate.
        // nodeFooterTemplate - шаблон ячейки, он всегда рендерится в платформенном RowComponent.
        row = (
            <DefaultRC
                {...rowProps}
                className={className}
                cCountStart={props.cCountStart}
                cCountEnd={props.cCountEnd}
                _$FCC={props._$FCC}
            />
        );
    } else if (!itemTemplate && !item.$GGR) {
        const _$FCC = item.$TGGR ? GroupCellComponent : props._$FCC;
        const rowGroupProperty = item.getOwner().getGroupProperty();
        row = (
            <DefaultRC
                {...rowProps}
                className={className}
                _$FCC={_$FCC}
                expanderTemplate={CustomExpanderConnectedComponent}
                cCountStart={props.cCountStart}
                cCountEnd={props.cCountEnd}
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

export const ReactTreeGridView = React.forwardRef(function ReactTreeGridView(
    props: IGridViewProps,
    ref
) {
    const _getRowComponent = props._$getRowComponent ?? getRowComponent;
    const _$FRC = props._$FRC ?? DefaultRC;
    return (
        <>
            <GridView
                {...props}
                _$getRowComponent={_getRowComponent}
                _$FCC={TreeGridCellComponent}
                _$FRC={_$FRC}
                beforeItemContentRender={LevelPadding}
            />
            <div className="tw-contents" ref={ref}></div>
        </>
    );
});
