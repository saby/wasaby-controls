import { forwardRef } from 'react';
import { Time } from 'Controls-Input/dateConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Required = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Time
                name={getBinding('Time')}
                label={getOuterTextLabel('required = true')}
                required={true}
            />
            <Time
                name={getBinding('Empty')}
                label={getOuterTextLabel('required = false')}
                required={false}
            />
        </div>
    );
});

Required.getLoadConfig = getLoadConfig;

export default Required;