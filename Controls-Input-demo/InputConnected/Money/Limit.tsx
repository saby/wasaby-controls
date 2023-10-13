import { forwardRef, useMemo } from 'react';
import { Money } from 'Controls-Input/inputConnected';
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
            <Money
                name={getBinding('Money')}
                label={getOuterTextLabel('limit.minValue = 2, limit.maxValue = 30')}
                limit={limit}
            />
            <Money
                name={getBinding('Money')}
                label={getOuterTextLabel('limit is empty')}
            />
        </div>
    );
});

Limit.getLoadConfig = getLoadConfig;

export default Limit;
