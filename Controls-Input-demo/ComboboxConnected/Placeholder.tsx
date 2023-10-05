import { forwardRef } from 'react';
import { default as ComboboxConnected } from 'Controls-Input/ComboboxConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel } from '../resources/utils';

const Placeholder = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
            <ComboboxConnected
                className="controls-margin_top-m"
                name={getBinding('CheckboxGroup')}
                placeholder={'Кликните на вариант'}
                label={getOuterTextLabel('With placeholder')}
            />
        </div>
    );
});

Placeholder.getLoadConfig = getLoadConfig;

export default Placeholder;