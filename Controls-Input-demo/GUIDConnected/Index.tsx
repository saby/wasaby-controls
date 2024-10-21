import { forwardRef } from 'react';
import { default as GUIDConnected } from 'Controls-Input/GUIDConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel } from '../resources/utils';

const Index = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400">
                    <GUIDConnected
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('GUIDConnected')}
                    />
                </div>
            </div>
        </div>
    );
});

Index.getLoadConfig = getLoadConfig;

export default Index;
