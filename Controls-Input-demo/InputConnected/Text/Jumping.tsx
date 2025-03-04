import { forwardRef } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getInnerLabel } from '../../resources/utils';

const Jumping = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col"
            data-qa="controlsDemo_capture"
        >
            <Text
                className="controls-margin_top-m"
                name={getBinding('String')}
                label={getInnerLabel()}
                placeholder="Прыгающая метка"
            />
        </div>
    );
});

Jumping.getLoadConfig = getLoadConfig;

export default Jumping;
