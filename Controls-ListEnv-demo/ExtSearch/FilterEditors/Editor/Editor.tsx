import * as React from 'react';
import { Control } from 'Controls/Chips';

export default React.forwardRef(function ChipsEditor(
    props,
    ref: React.ForwardedRef<unknown>
): React.ReactElement {
    const onPropertyValueChange = React.useCallback(
        (event, newValue) => {
            const value = {
                value: newValue,
                textValue: newValue,
                viewMode: 'basic',
            };

            props.onPropertyValueChanged?.(event, value);
        },
        [props.onPropertyValueChanged]
    );

    return (
        <Control
            ref={ref}
            className={'controls-padding_left-m controls-padding_top-2xs'}
            items={props.items}
            onSelectedKeysChanged={onPropertyValueChange}
        />
    );
});
