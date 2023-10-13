import { forwardRef } from 'react';
import { Mask } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const DefaultValue = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Mask
                name={getBinding('Empty')}
                label={getOuterTextLabel('defaultValue = QW 123')}
                mask="LL ddd"
                defaultValue="QW 123"
            />
            <Mask
                name={getBinding('Empty')}
                label={getOuterTextLabel('defaultValue is empty')}
                mask="LL ddd"
            />
        </div>
    );
});

DefaultValue.getLoadConfig = getLoadConfig;

export default DefaultValue;
