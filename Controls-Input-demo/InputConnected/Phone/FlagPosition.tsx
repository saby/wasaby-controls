import { forwardRef } from 'react';
import { Phone } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const FlagPosition = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Phone
                        name={getBinding('Phone')}
                        label={getOuterTextLabel('flagPosition = start')}
                        onlyMobile={true}
                        flagVisible={true}
                        flagPosition="start"
                    />
                    <Phone
                        name={getBinding('Phone')}
                        label={getOuterTextLabel('flagPosition = end')}
                        onlyMobile={true}
                        flagVisible={true}
                        flagPosition="end"
                    />
                </div>
            </div>
        </div>
    );
});

FlagPosition.getLoadConfig = getLoadConfig;

export default FlagPosition;
