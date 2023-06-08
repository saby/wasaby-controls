import * as React from 'react';
import Async from 'Controls/Container/Async';
import { GridRow } from 'Controls/grid';

interface IItemTemplateProps {
    item: GridRow;
    parentProperty: string;
    markerStyle: string;
    emptyKey: string;
    selectedAllKey: string;
}

export default React.forwardRef(function ItemTemplate(
    props: IItemTemplateProps,
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    const markerVisible =
        props.markerStyle === 'primary' ||
        props.item.key === props.emptyKey ||
        props.item.key === props.selectedAllKey;
    const templateOptions: object = {
        ...props,
        marker: markerVisible,
        expanderIcon:
            props.item.key === props.emptyKey ? 'none' : props.expanderIcon,
    };
    return (
        <Async
            forwardedRef={ref}
            templateName={
                props.parentProperty
                    ? 'Controls/treeGrid:ItemTemplate'
                    : 'Controls/grid:ItemTemplate'
            }
            templateOptions={templateOptions}
        />
    );
});
