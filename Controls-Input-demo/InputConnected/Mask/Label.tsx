import { forwardRef } from 'react';
import { Mask } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel, getOuterIconLabel } from '../../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
            <Mask
                className="controls-margin_top-m"
                name={getBinding('Mask')}
                label={null}
                mask="LL ddd"
            />
            <Mask
                className="controls-margin_top-m"
                name={getBinding('Mask')}
                label={getOuterTextLabel('label top')}
                mask="LL ddd"
            />
            <Mask
                className="controls-margin_top-m"
                name={getBinding('Mask')}
                label={getOuterTextLabel('label start', 'start')}
                mask="LL ddd"
            />
            <Mask
                className="controls-margin_top-m"
                name={getBinding('Mask')}
                label={getOuterIconLabel()}
                mask="LL ddd"
            />
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;