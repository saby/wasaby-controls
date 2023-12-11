import { forwardRef, useMemo } from 'react';
import { Date as DateControl } from 'Controls-Input/dateConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Limit = forwardRef((_, ref) => {
    const periodLimit = useMemo(() => {
        return {
            startDate: (new Date(2022, 0, 1)).getTime(),
            endDate: (new Date(2022, 11, 31)).getTime(),
        };
    }, []);
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <DateControl
                name={getBinding('Date')}
                label={getOuterTextLabel('startDate=01.01.2022, startDate=31.11.2022')}
                periodLimit={periodLimit}
            />
            <DateControl
                name={getBinding('Date')}
                label={getOuterTextLabel('periodLimit is empty')}
            />
        </div>
    );
});

Limit.getLoadConfig = getLoadConfig;

export default Limit;
