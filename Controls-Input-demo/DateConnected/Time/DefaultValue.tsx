import { forwardRef, useMemo } from 'react';
import { Time } from 'Controls-Input/dateConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const DefaultValue = forwardRef((_, ref) => {
    const defaultValue = useMemo(() => new Date(2023, 3, 3).getTime(), []);

    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
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
            </div>
        </div>
    );
});

DefaultValue.getLoadConfig = getLoadConfig;

export default DefaultValue;
