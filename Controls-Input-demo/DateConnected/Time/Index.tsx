import { forwardRef } from 'react';
import { Time } from 'Controls-Input/dateConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Index = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
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
    );
});

Index.getLoadConfig = getLoadConfig;

export default Index;
