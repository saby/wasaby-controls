import { forwardRef } from 'react';
import { Number } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel, getOuterIconLabel } from '../../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
            <Number
                className="controls-margin_top-m"
                name={getBinding('Number')}
                label={null}
            />
            <Number
                className="controls-margin_top-m"
                name={getBinding('Number')}
                label={getOuterTextLabel('label top')}
            />
            <Number
                className="controls-margin_top-m"
                name={getBinding('Number')}
                label={getOuterTextLabel('label start', 'start')}
            />
            <Number
                className="controls-margin_top-m"
                name={getBinding('Number')}
                label={getOuterIconLabel()}
            />
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
