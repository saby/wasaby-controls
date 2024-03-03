import { forwardRef } from 'react';
import { Input } from 'Controls-Input/dateRangeConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel, getOuterIconLabel } from '../../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Input
                className="controls-margin_top-m"
                name={getBinding('DateRange')}
                label={null}
            />
            <Input
                className="controls-margin_top-m"
                name={getBinding('DateRange')}
                label={getOuterTextLabel('label top')}
            />
            <Input
                className="controls-margin_top-m"
                name={getBinding('DateRange')}
                label={getOuterTextLabel('label start', 'start')}
            />
            <Input
                className="controls-margin_top-m"
                name={getBinding('DateRange')}
                label={getOuterIconLabel()}
            />
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
