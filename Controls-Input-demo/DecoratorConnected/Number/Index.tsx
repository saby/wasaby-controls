import { forwardRef } from 'react';
import { Number } from 'Controls-Input/decoratorConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';

const Index = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Number
                name={getBinding('Number')}
            />
        </div>
    );
});

Index.getLoadConfig = getLoadConfig;

export default Index;
