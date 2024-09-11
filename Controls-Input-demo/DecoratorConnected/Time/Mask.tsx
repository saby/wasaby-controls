import { forwardRef } from 'react';
import { Time } from 'Controls-Input/decoratorConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';

const Index = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <div className="controls-margin_bottom-m">
                <Time
                    name={getBinding('Time')}
                    mask="HH:mm"
                />
            </div>
            <div className="controls-margin_bottom-m">
                <Time
                    name={getBinding('Time')}
                    mask="HH:mm:ss"
                />
            </div>
        </div>
    );
});

Index.getLoadConfig = getLoadConfig;

export default Index;
