import { forwardRef } from 'react';
import { default as CheckboxGroup } from 'Controls-Input/CheckboxGroupConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel } from '../resources/utils';

const Direction = forwardRef((_, ref) => {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <CheckboxGroup
                name={getBinding('CheckboxGroup')}
                label={getOuterTextLabel('direction = vertical')}
                direction='vertical'
            />
            <CheckboxGroup
                name={getBinding('CheckboxGroup')}
                label={getOuterTextLabel('direction = horizontal')}
                direction='horizontal'
            />
        </div>
    );
});

Direction.getLoadConfig = getLoadConfig;

export default Direction;
