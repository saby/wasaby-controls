import { forwardRef } from 'react';
import { Date as DateControl } from 'Controls-Input/dateConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Required = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <DateControl
                name={getBinding('Date')}
                label={getOuterTextLabel('required = true')}
                required={true}
            />
            <DateControl
                name={getBinding('Empty')}
                label={getOuterTextLabel('required = false')}
                required={false}
            />
        </div>
    );
});

Required.getLoadConfig = getLoadConfig;

export default Required;
