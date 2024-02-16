import { forwardRef } from 'react';
import { Time } from 'Controls-Input/dateConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel, getOuterIconLabel } from '../../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
            <Time
                className="controls-margin_top-m"
                name={getBinding('Time')}
                label={null}
            />
            <Time
                className="controls-margin_top-m"
                name={getBinding('Time')}
                label={getOuterTextLabel('label top')}
            />
            <Time
                className="controls-margin_top-m"
                name={getBinding('Time')}
                label={getOuterTextLabel('label start', 'start')}
            />
            <Time
                className="controls-margin_top-m"
                name={getBinding('Time')}
                label={getOuterIconLabel()}
            />
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
