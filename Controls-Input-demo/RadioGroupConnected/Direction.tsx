import { forwardRef } from 'react';
import { default as RadioGroup } from 'Controls-Input/RadioGroupConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel } from '../resources/utils';

const Direction = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <RadioGroup
                name={getBinding('RadioGroup')}
                label={getOuterTextLabel('direction = vertical')}
                direction='vertical'
            />
            <RadioGroup
                name={getBinding('RadioGroup')}
                label={getOuterTextLabel('direction = horizontal')}
                direction='horizontal'
            />
        </div>
    );
});

Direction.getLoadConfig = getLoadConfig;

export default Direction;
