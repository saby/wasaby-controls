import { forwardRef } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Base = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col"
        >
            <Text name={getBinding('Text')} defaultValue="so good!!!" />
        </div>
    );
});

Base.getLoadConfig = getLoadConfig;

export default Base;
