import * as React from 'react';
import Async from 'Controls/Container/Async';
import { GridRow } from 'Controls/grid';
import { useCallback } from 'react';

interface IItemTemplateProps {
    item: GridRow;
    parentProperty: string;
    markerStyle: string;
    emptyKey: string;
    selectedAllKey: string;
    itemStickyCallback: Function;
}

const customEvents = ['onFixed'];

/**
 * Шаблон элемента списка.
 * @private
 */
export default React.forwardRef(function ItemTemplate(
    props: IItemTemplateProps,
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    const fixedCallback = useCallback((data) => {
        props.itemStickyCallback(data.fixedPosition === 'top');
    }, []);
    const markerVisible =
        props.markerStyle === 'primary' ||
        props.item.key === props.emptyKey ||
        props.item.key === props.selectedAllKey;
    const isNode = props.parentProperty && props.item.hasChildren?.();
    const templateOptions: object = {
        ...props,
        marker: markerVisible,
        expanderIcon: !isNode && props.item.key === props.emptyKey ? 'none' : props.expanderIcon,
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
            onFixed={fixedCallback}
            customEvents={customEvents}
        />
    );
});
