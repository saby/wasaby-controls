import { forwardRef } from 'react';
import { Phone } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const OnlyMobile = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Phone
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('onlyMobile = true')}
                        onlyMobile={true}
                        data-qa="Controls-Input-demo_InputConnected_Phone_OnlyMobile__true"
                    />
                    <Phone
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('onlyMobile = false')}
                        onlyMobile={false}
                        data-qa="Controls-Input-demo_InputConnected_Phone_OnlyMobile__false"
                    />
                </div>
            </div>
        </div>
    );
});

OnlyMobile.getLoadConfig = getLoadConfig;

export default OnlyMobile;
