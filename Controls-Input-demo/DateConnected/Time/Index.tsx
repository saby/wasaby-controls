import { forwardRef } from 'react';
import { Time } from 'Controls-Input/dateConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Index = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Time
                        name={getBinding('Time')}
                        label={getOuterTextLabel('Mask HH:mm')}
                        mask="HH:mm"
                    />
                    <Time
                        name={getBinding('Time')}
                        label={getOuterTextLabel('Mask HH:mm:ss')}
                        mask="HH:mm:ss"
                    />
                </div>
            </div>
        </div>
    );
});

Index.getLoadConfig = getLoadConfig;

export default Index;
