import { useMemo, forwardRef } from 'react';
import { Time } from 'Controls-Input/dateConnected';
import { getLoadConfig, getBinding } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const DefaultValue = forwardRef((_, ref) => {
    const defaultValue = useMemo(() => (new Date(2023, 3, 3)).getTime(), []);

    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
            <Time
                name={getBinding('Empty')}
                label={getOuterTextLabel('defaultValue')}
                defaultValue={defaultValue}
            />
            <Time
                name={getBinding('Empty')}
                label={getOuterTextLabel('defaultValue is empty')}
            />
        </div>
    );
});

DefaultValue.getLoadConfig = getLoadConfig;

export default DefaultValue;
