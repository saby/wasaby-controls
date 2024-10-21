import { forwardRef } from 'react';
import { default as Checkbox } from 'Controls-Input/CheckboxConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel } from '../resources/utils';

const Required = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Checkbox
                name={getBinding('Checkbox')}
                label={getOuterTextLabel('required = true', 'captionEnd')}
                required={true}
            />
            <Checkbox
                name={getBinding('Empty')}
                label={getOuterTextLabel('required = false', 'captionEnd')}
                required={false}
            />
        </div>
    );
});

Required.getLoadConfig = getLoadConfig;

export default Required;
