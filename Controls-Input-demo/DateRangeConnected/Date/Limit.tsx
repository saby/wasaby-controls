import { forwardRef, useMemo } from 'react';
import { Input } from 'Controls-Input/dateRangeConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Limit = forwardRef((_, ref) => {
    const limit = useMemo(() => {
        return {
            startDate: new Date(2022, 0, 1).getTime(),
            endDate: new Date(2022, 11, 31).getTime(),
        };
    }, []);
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Input
                        name={getBinding('DateRange')}
                        label={getOuterTextLabel('startDate=01.01.2022, startDate=31.11.2022')}
                        limit={limit}
                    />
                    <Input
                        name={getBinding('DateRange')}
                        label={getOuterTextLabel('periodLimit is empty')}
                    />
                </div>
            </div>
        </div>
    );
});

Limit.getLoadConfig = getLoadConfig;

export default Limit;
