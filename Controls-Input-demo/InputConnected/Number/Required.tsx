import { forwardRef } from 'react';
import { Number } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Required = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Number
                name={getBinding('Number')}
                label={getOuterTextLabel('required = true')}
                required={true}
            />
            <Number
                name={getBinding('Empty')}
                label={getOuterTextLabel('required is empty')}
            />
        </div>
    );
});

Required.getLoadConfig = getLoadConfig;

export default Required;
