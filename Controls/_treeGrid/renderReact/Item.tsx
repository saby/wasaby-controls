/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';
import { Model } from 'Types/entity';

import {
    ExpanderBlockComponent,
    ExpanderComponent,
    getExpanderProps,
    IExpanderProps,
} from 'Controls/baseTree';
import {
    IGridItemProps,
    GridCell,
    ItemTemplate as GridItemTemplate,
} from 'Controls/grid';

import TreeGridDataRow from 'Controls/_treeGrid/display/TreeGridDataRow';

interface IItemProps
    extends IGridItemProps<Model, TreeGridDataRow<Model>>,
        IExpanderProps {}

function isFirstDataColumn(
    item: TreeGridDataRow,
    column: GridCell<Model, TreeGridDataRow>
): boolean {
    const columnIndex = column.getColumnIndex(false, false);
    const hasMultiSelect = item.hasMultiSelectColumn();
    return (
        (columnIndex === 0 && !hasMultiSelect) ||
        (columnIndex === 1 && hasMultiSelect)
    );
}

function BeforeColumnContentTemplate(
    props: IItemProps & { column: GridCell<Model, TreeGridDataRow> }
): React.ReactElement {
    if (
        !props.item.shouldDisplayExpanderBlock(
            props.expanderPaddingVisibility
        ) ||
        !isFirstDataColumn(props.item, props.column) ||
        props.item['Controls/treeGrid:TreeGridGroupDataRow']
    ) {
        return null;
    }

    return <ExpanderBlockComponent {...getExpanderProps(props, props.item)} />;
}

function AfterColumnContentTemplate(
    props: IItemProps & { column: GridCell<Model, TreeGridDataRow> }
): React.ReactElement {
    if (
        props.item.getExpanderPosition() !== 'right' ||
        !isFirstDataColumn(props.item, props.column)
    ) {
        return null;
    }
    return <ExpanderComponent {...getExpanderProps(props, props.item)} />;
}

export default function Item(props: IItemProps): React.ReactElement {
    const columnOptions = {
        expanderTemplate: (
            expanderProps: TInternalProps & { onMouseDown?: () => void }
        ) => {
            if (props.item.getExpanderPosition() !== 'custom') {
                return null;
            }
            return (
                <ExpanderComponent
                    {...getExpanderProps(props, props.item)}
                    onMouseDown={expanderProps.onMouseDown}
                    attrs={expanderProps.attrs}
                    ref={expanderProps.ref}
                />
            );
        },
    };
    return (
        <GridItemTemplate
            {...props}
            beforeColumnContentTemplate={BeforeColumnContentTemplate}
            afterColumnContentTemplate={AfterColumnContentTemplate}
            columnOptions={columnOptions}
        />
    );
}
