import { forwardRef } from 'react';
import { Money } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const DefaultValue = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Money
                name={getBinding('Empty')}
                label={getOuterTextLabel('defaultValue = 2')}
                defaultValue='2'
            />
            <Money
                name={getBinding('Empty')}
                label={getOuterTextLabel('defaultValue is empty')}
            />
        </div>
    );
});

DefaultValue.getLoadConfig = getLoadConfig;

export default DefaultValue;
