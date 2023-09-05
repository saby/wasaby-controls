import { forwardRef } from 'react';
import { Money } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel, getOuterIconLabel } from '../../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
            <Money
                className="controls-margin_top-m"
                name={getBinding('Money')}
                label={null}
            />
            <Money
                className="controls-margin_top-m"
                name={getBinding('Money')}
                label={getOuterTextLabel('label top')}
            />
            <Money
                className="controls-margin_top-m"
                name={getBinding('Money')}
                label={getOuterTextLabel('label start', 'start')}
            />
            <Money
                className="controls-margin_top-m"
                name={getBinding('Money')}
                label={getOuterIconLabel()}
            />
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
