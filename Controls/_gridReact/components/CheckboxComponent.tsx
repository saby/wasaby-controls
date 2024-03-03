import * as React from 'react';

import { CheckboxMarker } from 'Controls/checkbox';
import { ICheckboxProps } from 'Controls/interface';
import { CollectionItemContext } from 'Controls/list';

import { useObservableItemStates } from 'Controls/_gridReact/hooks/useItemState';

interface IProps {
    className?: string;
}

const CHECKBOX_STATES = ['selected', 'multiSelectVisibility', 'multiSelectAccessibility'];

function useCheckboxProps(): ICheckboxProps {
    const item = React.useContext(CollectionItemContext);
    useObservableItemStates(CHECKBOX_STATES);

    return {
        checkboxValue: item.isSelected(),
        checkboxReadonly: item.isReadonlyCheckbox(),
        checkboxVisibility: item.isVisibleCheckbox() ? item.getMultiSelectVisibility() : 'hidden',
    };
}

function CheckboxComponent(props: IProps): React.ReactElement {
    const { checkboxValue, checkboxVisibility, checkboxReadonly } = useCheckboxProps();

    if (checkboxVisibility === 'hidden') {
        return null;
    }

    let className = 'js-controls-ListView__checkbox controls-CheckboxMarker_inList';
    if (checkboxVisibility === 'onhover' && checkboxValue === false) {
        className += ' controls-ListView__checkbox-onhover';
    }
    if (props.className) {
        className += ` ${props.className}`;
    }

    // TODO contrastBackground={props.checkboxContrastBackground} - только в мастере
    return (
        <CheckboxMarker
            value={checkboxValue}
            readOnly={checkboxReadonly}
            triState={true}
            viewMode={'outlined'}
            className={className}
        />
    );
}

export default React.memo(CheckboxComponent);
