import { forwardRef } from 'react';
import { Number } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const OnlyPositive = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Number
                name={getBinding('Number')}
                label={getOuterTextLabel('onlyPositive = false')}
                onlyPositive={false}
            />
            <Number
                name={getBinding('Number')}
                label={getOuterTextLabel('onlyPositive = true')}
                onlyPositive={true}
            />
        </div>
    );
});

OnlyPositive.getLoadConfig = getLoadConfig;

export default OnlyPositive;
