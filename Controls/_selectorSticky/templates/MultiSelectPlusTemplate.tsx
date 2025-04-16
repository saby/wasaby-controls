import * as React from 'react';
import { useAdaptiveMode } from 'UI/Adaptive';
import { Button } from 'Controls/buttons';

export default React.forwardRef(function MultiSelectPlusTemplate(props, ref) {
    const isAdaptive = useAdaptiveMode().device.isPhone();

    const isSelected = React.useMemo(() => {
        return props.item.isSelected();
    }, [props.item.isSelected()]);

    const visibilityState = React.useMemo(() => {
        return !props.item.isVisibleCheckbox() ? 'invisible' : isSelected ? 'active' : 'default';
    }, [props.item.isVisibleCheckbox(), isSelected]);
    return (
        <Button
            ref={ref}
            viewMode="filled"
            buttonStyle="pale"
            icon={isSelected ? 'icon-Yes' : 'icon-RoundPlus'}
            iconStyle={isSelected ? 'success' : 'secondary'}
            inlineHeight={isAdaptive ? 'xl' : 'm'}
            iconSize={isAdaptive ? 'm' : 's'}
            className={`js-controls-ListView__checkbox controls-margin_left-xs
            controls-ListEnv-SelectorPopup__multiSelectPlus
            controls-ListEnv-SelectorPopup__multiSelectPlus_${
                isSelected ? 'selected' : 'unselected'
            }
         controls-ListEnv-SelectorPopup__multiSelectPlus_${visibilityState} controls-Menu__row-checkbox_${visibilityState} ${
             props.className
         }`}
            data-qa={'controls-Menu__row-checkbox-button'}
        />
    );
});
