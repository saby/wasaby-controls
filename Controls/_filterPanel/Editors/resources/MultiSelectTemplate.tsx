import * as React from 'react';
import Async from 'Controls/Container/Async';
import { GridRow } from 'Controls/grid';

interface IItemTemplateProps {
    item: GridRow;
    multiSelectVerticalAlign: string;
    multiSelect: boolean;
    checkBoxNewDesign: boolean;
    markerStyle: string;
    emptyKey: string;
    selectedAllKey: string;
}

export default React.forwardRef(function MultiSelectTemplate(
    props: IItemTemplateProps,
    ref: React.ForwardedRef<unknown>
): JSX.Element {
    const templateOptions = {
        ...props,
        style: 'master',
        className: `controls-ListEditor__multiSelect-${props.multiSelectVerticalAlign}`,
    };
    if (
        props.markerStyle !== 'primary' &&
        !(
            props.item.key === props.emptyKey ||
            props.item.key === props.selectedAllKey
        )
    ) {
        return (
            <Async
                forwardedRef={ref}
                templateName={
                    props.multiSelect && !props.checkBoxNewDesign
                        ? 'Controls/list:MultiSelectTemplate'
                        : 'Controls/list:MultiSelectCircleTemplate'
                }
                templateOptions={templateOptions}
            />
        );
    }
    return null;
});
