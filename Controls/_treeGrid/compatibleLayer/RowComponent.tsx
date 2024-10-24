import * as React from 'react';
import { Model } from 'Types/entity';
import { TreeGridCellComponent } from 'Controls/_treeGrid/cell/CellComponent';
import {
    IGridItemProps,
    getCompatibleGridRowComponentProps,
    CompatibleRowComponentPropsConverter,
} from 'Controls/grid';
import { IRowComponentProps } from 'Controls/gridReact';
import { CollectionItemContext } from 'Controls/baseList';
import { IExpanderProps, CustomExpanderConnectedComponent } from 'Controls/baseTree';

import type { TreeGridDataRow } from 'Controls/treeGridDisplay';

interface IItemProps extends IGridItemProps<Model, TreeGridDataRow<Model>>, IExpanderProps {}

function getCompatibleTreeGridRowComponentProps(props: IItemProps, rowProps: IRowComponentProps) {
    const item = props.item;
    const compatibleGridRowComponentProps = getCompatibleGridRowComponentProps(props, rowProps);

    return {
        ...compatibleGridRowComponentProps,
        fontColorStyle: props.fontColorStyle,
        highlightOnHover: props.highlightOnHover,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        marker: props.marker,
        markerClassName: props.markerClassName,
        markerSize: props.markerSize,
        expanderTemplate: CustomExpanderConnectedComponent,
        // Значения этих опций зависят от props, заданных непосредственно на ItemTemplate.
        // Их нужно пересчитать ,несмотря на то, что в getRowComponentProps они уже посчитаны для "нового" рендера
        expanderSize: item.getExpanderSize(props.expanderSize),
        expanderIcon: item.getExpanderIcon(props.expanderIcon),
        expanderIconSize: item.getExpanderIconSize(props.expanderIconSize),
        expanderIconStyle: item.getExpanderIconStyle(props.expanderIconStyle),
        expanderPaddingVisibility: props.expanderPaddingVisibility,
        withoutExpanderPadding: item.getWithoutExpanderPadding(
            props.withoutExpanderPadding,
            props.expanderSize
        ),
        levelIndentSize: props.levelIndentSize,
        withoutLevelPadding: item.getWithoutLevelPadding(props.withoutLevelPadding),
    };
}

interface ICompatibleRowComponentPropsConverterProps extends IItemProps {
    getCompatibleRowComponentProps: (
        props: IItemProps,
        rowProps: IRowComponentProps
    ) => Partial<IRowComponentProps>;
}

const CompatibleTreeGridCollectionItemContextProvider = React.forwardRef(function (
    props: ICompatibleRowComponentPropsConverterProps,
    ref: React.ForwardedRef<HTMLElement>
) {
    return (
        <CollectionItemContext.Provider value={props.item}>
            <CompatibleRowComponentPropsConverter
                {...props}
                _$FunctionalCellComponent={TreeGridCellComponent}
                forwardedRef={ref}
                getCompatibleRowComponentProps={getCompatibleTreeGridRowComponentProps}
            />
        </CollectionItemContext.Provider>
    );
});

const CompatibleTreeGridRowComponentForwardRef = React.forwardRef(
    (props: IItemProps, ref: React.ForwardedRef<HTMLElement>) => {
        const item = React.useContext(CollectionItemContext);
        if (!item && props.item) {
            return <CompatibleTreeGridCollectionItemContextProvider {...props} ref={ref} />;
        }
        return (
            <CompatibleRowComponentPropsConverter
                {...props}
                _$FunctionalCellComponent={TreeGridCellComponent}
                forwardedRef={ref}
                getCompatibleRowComponentProps={getCompatibleTreeGridRowComponentProps}
            />
        );
    }
);

CompatibleTreeGridRowComponentForwardRef.displayName = 'CompatibleTreeGridRowComponentForwardRef';

export const CompatibleTreeGridRowComponent = React.memo(CompatibleTreeGridRowComponentForwardRef);

CompatibleTreeGridRowComponent.displayName = 'CompatibleTreeGridRowComponentMemo';
