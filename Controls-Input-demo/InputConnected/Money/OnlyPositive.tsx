import { forwardRef } from 'react';
import { Money } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const OnlyPositive = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Money
                name={getBinding('Money')}
                label={getOuterTextLabel('onlyPositive = false')}
                onlyPositive={false}
            />
            <Money
                name={getBinding('Money')}
                label={getOuterTextLabel('onlyPositive = true')}
                onlyPositive={true}
            />
        </div>
    );
});

OnlyPositive.getLoadConfig = getLoadConfig;

export default OnlyPositive;
