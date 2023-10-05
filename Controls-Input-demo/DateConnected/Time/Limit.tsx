import { forwardRef, useMemo } from 'react';
import { Time } from 'Controls-Input/dateConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Limit = forwardRef((_, ref) => {
    const periodLimit = useMemo(() => {
        return {
            startDate: (new Date(2022, 0, 1,12,30)).getTime(),
            endDate: (new Date(2022, 11, 31, 17,30)).getTime(),
        };
    }, []);
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Time
                name={getBinding('Empty')}
                label={getOuterTextLabel('startDate=12:30, startDate=17:30')}
                periodLimit={periodLimit}
            />
            <Time
                name={getBinding('Empty')}
                label={getOuterTextLabel('periodLimit is empty')}
            />
        </div>
    );
});

Limit.getLoadConfig = getLoadConfig;

export default Limit;
