import { forwardRef } from 'react';
import { default as RadioGroup } from 'Controls-Input/RadioGroupConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel, getOuterIconLabel } from '../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
            <RadioGroup
                className="controls-margin_top-m"
                name={getBinding('RadioGroup')}
                label={null}
            />
            <RadioGroup
                className="controls-margin_top-m"
                name={getBinding('RadioGroup')}
                label={getOuterTextLabel('label top')}
            />
            <RadioGroup
                className="controls-margin_top-m"
                name={getBinding('RadioGroup')}
                label={getOuterTextLabel('label start', 'start')}
            />
            <RadioGroup
                className="controls-margin_top-m"
                name={getBinding('RadioGroup')}
                label={getOuterIconLabel()}
            />
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
