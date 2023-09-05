import { forwardRef } from 'react';
import { Phone } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const OnlyMobile = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Phone
                name={getBinding('Empty')}
                label={getOuterTextLabel('onlyMobile = true')}
                onlyMobile={true}
            />
            <Phone
                name={getBinding('Empty')}
                label={getOuterTextLabel('onlyMobile = false')}
                onlyMobile={false}/>
        </div>
    );
});

OnlyMobile.getLoadConfig = getLoadConfig;

export default OnlyMobile;
