import * as React from 'react';
import { Button } from 'Controls/buttons';

export default React.forwardRef(function MultiSelectPlusTemplate(props, ref) {
    const isSelected = React.useMemo(() => {
        return props.item.isSelected();
    }, [props.item.isSelected()]);

    const visibilityState = React.useMemo(() => {
        return !props.item.isVisibleCheckbox() ? 'invisible' : isSelected ? 'active' : 'default';
    }, [props.item.isVisibleCheckbox()]);
    return (
        <Button
            ref={ref}
            viewMode="filled"
            buttonStyle="pale"
            icon={isSelected ? 'icon-Yes' : 'icon-RoundPlus'}
            iconStyle={isSelected ? 'success' : 'secondary'}
            inlineHeight="m"
            iconSize="s"
            className={`js-controls-ListView__checkbox controls-margin_left-xs
         controls-ListEnv-SelectorPopup__multiSelectPlus_${visibilityState} controls-Menu__row-checkbox_${visibilityState} ${props.className}`}
            data-qa={'controls-Menu__row-checkbox-button'}
        />
    );
});
