import { forwardRef } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Length = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Text
                name={getBinding('Empty')}
                label={getOuterTextLabel('length')}
                length={{
                    minLength: 3,
                    maxLength: 15
                }}
            />
            <Text
                name={getBinding('Empty')}
                label={getOuterTextLabel('length is empty')}
            />
        </div>
    );
});

Length.getLoadConfig = getLoadConfig;

export default Length;
