import { forwardRef } from 'react';
import { default as CheckboxGroup } from 'Controls-Input/CheckboxGroupConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel, getOuterIconLabel } from '../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
            <CheckboxGroup
                className="controls-margin_top-m"
                name={getBinding('CheckboxGroup')}
                label={null}
            />
            <CheckboxGroup
                className="controls-margin_top-m"
                name={getBinding('CheckboxGroup')}
                label={getOuterTextLabel('label top')}
            />
            <CheckboxGroup
                className="controls-margin_top-m"
                name={getBinding('CheckboxGroup')}
                label={getOuterTextLabel('label start', 'start')}
            />
            <CheckboxGroup
                className="controls-margin_top-m"
                name={getBinding('CheckboxGroup')}
                label={getOuterIconLabel()}
            />
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
