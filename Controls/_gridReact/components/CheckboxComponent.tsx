import * as React from 'react';

import { CheckboxMarker } from 'Controls/checkbox';
import { ICheckboxProps } from 'Controls/interface';

export default function CheckboxComponent(props: ICheckboxProps): React.ReactElement {
    if (props.checkboxVisibility === 'hidden') {
        return null;
    }

    let className = 'js-controls-ListView__checkbox';
    if (props.checkboxVisibility === 'onhover' && props.checkboxValue === false) {
        className += ' controls-ListView__checkbox-onhover';
    }

    // TODO contrastBackground={props.checkboxContrastBackground} - только в мастере
    return (
        <CheckboxMarker
            value={props.checkboxValue}
            readOnly={props.checkboxReadonly}
            triState={true}
            viewMode={'outlined'}
            className={className}
        />
    );
}
