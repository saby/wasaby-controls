import { forwardRef } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Required = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Text
                name={getBinding('Text')}
                label={getOuterTextLabel('required = true')}
                required={true}
            />
            <Text
                name={getBinding('String')}
                label={getOuterTextLabel('required is empty')}
            />
        </div>
    );
});

Required.getLoadConfig = getLoadConfig;

export default Required;