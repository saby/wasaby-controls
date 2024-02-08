import { forwardRef, useMemo } from 'react';
import { Number } from 'Controls-Input/inputConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Limit = forwardRef((_, ref) => {
    const limit = useMemo(() => {
        return {
            minValue: 2,
            maxValue: 30,
        };
    }, []);
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Number
                name={getBinding('Number')}
                label={getOuterTextLabel('limit.minValue = 2, limit.maxValue = 30')}
                limit={limit}
            />
            <Number
                name={getBinding('Number')}
                label={getOuterTextLabel('limit is empty')}
            />
        </div>
    );
});

Limit.getLoadConfig = getLoadConfig;

export default Limit;
