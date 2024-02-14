import { forwardRef } from 'react';
import { Mask } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Index = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400">
            <Mask
                name={getBinding('Mask')}
                label={getOuterTextLabel('Mask')}
                mask="LL ddd"
            />
        </div>
    );
});

Index.getLoadConfig = getLoadConfig;

export default Index;
