import { forwardRef } from 'react';
import { Number } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const IntegerLength = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Number
                name={getBinding('Number')}
                label={getOuterTextLabel('integersLength = 2')}
                integersLength={2}
            />
            <Number
                name={getBinding('Number')}
                label={getOuterTextLabel('integersLength is empty')}
            />
        </div>
    );
});

IntegerLength.getLoadConfig = getLoadConfig;

export default IntegerLength;
