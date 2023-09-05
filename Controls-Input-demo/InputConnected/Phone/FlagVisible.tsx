import { forwardRef } from 'react';
import { Phone } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const FlagVisible = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Phone
                name={getBinding('Phone')}
                label={getOuterTextLabel('flagVisible = true')}
                onlyMobile={true}
                flagVisible={true}
            />
            <Phone
                name={getBinding('Phone')}
                label={getOuterTextLabel('flagVisible = false')}
                onlyMobile={true}
                flagVisible={false}/>
        </div>
    );
});

FlagVisible.getLoadConfig = getLoadConfig;

export default FlagVisible;