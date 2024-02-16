import { useMemo, forwardRef } from 'react';
import { Input } from 'Controls-Input/dateRangeConnected';
import { TPeriodLimit } from 'Controls-Input/interface';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const DefaultValue = forwardRef((_, ref) => {
    const defaultValue = useMemo<TPeriodLimit>(() => {
        return {
            startDate: (new Date(2023, 3, 3)).getTime(),
            endDate: (new Date(2023, 9, 27)).getTime()
        };
    }, []);

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Input
                name={getBinding('Empty')}
                label={getOuterTextLabel('defaultValue')}
                defaultValue={defaultValue}
            />
            <Input
                name={getBinding('Empty')}
                label={getOuterTextLabel('defaultValue is empty')}
            />
        </div>
    );
});

DefaultValue.getLoadConfig = getLoadConfig;

export default DefaultValue;
