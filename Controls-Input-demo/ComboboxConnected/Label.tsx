import { forwardRef } from 'react';
import { default as ComboboxConnected } from 'Controls-Input/ComboboxConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel, getOuterIconLabel } from '../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col"
        >
            <ComboboxConnected
                className="controls-margin_top-m"
                name={getBinding('Combobox')}
                label={null}
            />
            <ComboboxConnected
                className="controls-margin_top-m"
                name={getBinding('Combobox')}
                label={getOuterTextLabel('label top')}
            />
            <ComboboxConnected
                className="controls-margin_top-m"
                name={getBinding('Combobox')}
                label={getOuterTextLabel('label start', 'start')}
            />
            <ComboboxConnected
                className="controls-margin_top-m"
                name={getBinding('Combobox')}
                label={getOuterIconLabel()}
            />
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
