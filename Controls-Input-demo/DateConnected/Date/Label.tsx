import { forwardRef } from 'react';
import { Date as DateControl } from 'Controls-Input/dateConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel, getOuterIconLabel } from '../../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
            <DateControl
                className="controls-margin_top-m"
                name={getBinding('Date')}
                label={null}
            />
            <DateControl
                className="controls-margin_top-m"
                name={getBinding('Date')}
                label={getOuterTextLabel('label top')}
            />
            <DateControl
                className="controls-margin_top-m"
                name={getBinding('Date')}
                label={getOuterTextLabel('label start', 'start')}
            />
            <DateControl
                className="controls-margin_top-m"
                name={getBinding('Date')}
                label={getOuterIconLabel()}
            />
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
