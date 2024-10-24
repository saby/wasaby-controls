import { forwardRef, useMemo } from 'react';
import { Date as DateControl } from 'Controls-Input/dateConnected';
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
                    <DateControl
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('defaultValue')}
                        defaultValue={defaultValue}
                        data-qa="Controls-Input-demo_DateConnected_Date_DefaultValue__set"
                    />
                    <DateControl
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('defaultValue is empty')}
                        data-qa="Controls-Input-demo_DateConnected_Date_DefaultValue__empty"
                    />
                </div>
            </div>
        </div>
    );
});

DefaultValue.getLoadConfig = getLoadConfig;

export default DefaultValue;
