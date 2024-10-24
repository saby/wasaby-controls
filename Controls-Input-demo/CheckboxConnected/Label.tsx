import { forwardRef } from 'react';
import { default as Checkbox } from 'Controls-Input/CheckboxConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel } from '../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
            <div className="controls-margin_top-m">
                <Checkbox
                    name={getBinding('Checkbox')}
                    label={null}
                />
            </div>
            <div className="controls-margin_top-m">
                <Checkbox
                    name={getBinding('Checkbox')}
                    label={getOuterTextLabel('label top')}
                />
            </div>
            <div className="controls-margin_top-m">
                <Checkbox
                    name={getBinding('Checkbox')}
                    label={getOuterTextLabel('label start', 'start')}
                />
            </div>
            <div className="controls-margin_top-m">
                <Checkbox
                    name={getBinding('Checkbox')}
                    label={getOuterTextLabel('caption start', 'captionStart')}
                />
            </div>
            <div className="controls-margin_top-m">
                <Checkbox
                    name={getBinding('Checkbox')}
                    label={getOuterTextLabel('captionEnd', 'captionEnd')}
                />
            </div>
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
