import { forwardRef } from 'react';
import { Selector } from 'Controls-Input/dropdownConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const SelectorDemo = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col"
        >
            <Selector
                className="controls-margin_top-m"
                name={getBinding('CheckboxGroup')}
                multiSelect={true}
                label={getOuterTextLabel('Multiselect = true')}
            />
            <Selector
                className="controls-margin_top-m"
                name={getBinding('CheckboxGroup')}
                multiSelect={false}
                label={getOuterTextLabel('Multiselect = false')}
            />
        </div>
    );
});

SelectorDemo.getLoadConfig = getLoadConfig;

export default SelectorDemo;
