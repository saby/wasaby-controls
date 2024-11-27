import * as React from 'react';
import { Button } from 'Controls/buttons';

export default React.forwardRef(function MultiSelectPlusTemplate(props, ref) {
    const isSelected = React.useMemo(() => {
        return props.item.isSelected() !== false;
    }, [props.item.isSelected()]);
    return (
        <Button
            ref={ref}
            viewMode="filled"
            buttonStyle="pale"
            icon={isSelected ? 'icon-Yes' : 'icon-RoundPlus'}
            iconStyle={isSelected ? 'success' : 'secondary'}
            inlineHeight="m"
            iconSize="s"
            className={`js-controls-ListView__checkbox ${
                props.menuMode === 'selector' ? 'controls-margin_left-xs' : ''
            }
         controls-Menu__row-checkbox_${
             !props.item.isVisibleCheckbox() ? 'invisible' : isSelected ? 'active' : 'default'
         }`}
            data-qa={'controls-Menu__row-checkbox-button'}
        />
    );
});
