import { forwardRef, useMemo } from 'react';
import { Input } from 'Controls-Input/dateRangeConnected';
import { TPeriodLimit } from 'Controls-Input/interface';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const DefaultValue = forwardRef((_, ref) => {
    const defaultValue = useMemo<TPeriodLimit>(() => {
        return {
            startDate: new Date(2023, 3, 3).getTime(),
            endDate: new Date(2023, 9, 27).getTime(),
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
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('defaultValue')}
                        defaultValue={defaultValue}
                        data-qa="Controls-Input-demo_DateRangeConnected_Date_DefaultValue__set"
                    />
                    <Input
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('defaultValue is empty')}
                        data-qa="Controls-Input-demo_DateRangeConnected_Date_DefaultValue__empty"
                    />
                </div>
            </div>
        </div>
    );
});

DefaultValue.getLoadConfig = getLoadConfig;

export default DefaultValue;
