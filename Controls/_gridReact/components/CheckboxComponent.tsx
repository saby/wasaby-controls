import * as React from 'react';

import { CheckboxMarker } from 'Controls/checkbox';
import { ICheckboxProps } from 'Controls/interface';

export default function CheckboxComponent(
    props: ICheckboxProps & { className?: string }
): React.ReactElement {
    if (props.checkboxVisibility === 'hidden') {
        return null;
    }

    let className = 'js-controls-ListView__checkbox controls-CheckboxMarker_inList';
    if (props.checkboxVisibility === 'onhover' && props.checkboxValue === false) {
        className += ' controls-ListView__checkbox-onhover';
    }
    if (props.className) {
        className += ` ${props.className}`;
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
