import { forwardRef } from 'react';
import { Checkbox } from 'Controls/checkbox';
import * as rk from 'i18n!Controls-Actions';
export default forwardRef(function OpenLinkEditor(props: Record<string, unknown>, ref) {
    return (
        <Checkbox
            ref={ref}
            caption={rk('В новой вкладке')}
            captionPosition="start"
            value={props.propertyValue as boolean}
            onValueChanged={(res) => {
                props.onPropertyValueChanged(res, true);
            }}
            data-qa="controls-PropertyGrid__editor_blankTarget"
        />
    );
});
