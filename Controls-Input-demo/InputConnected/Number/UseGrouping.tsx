import { forwardRef } from 'react';
import { Number } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const UseGrouping = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div
                    className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col"
                    data-qa="controlsDemo_capture"
                >
                    <Number
                        name={getBinding('Number')}
                        label={getOuterTextLabel('useGrouping = false')}
                        useGrouping={false}
                        data-qa="Controls-Input-demo_InputConnected_Number_UseGrouping__false"
                    />
                    <Number
                        name={getBinding('GroupingNumber')}
                        label={getOuterTextLabel('useGrouping = true')}
                        useGrouping={true}
                        data-qa="Controls-Input-demo_InputConnected_Number_UseGrouping__true"
                    />
                </div>
            </div>
        </div>
    );
});

UseGrouping.getLoadConfig = getLoadConfig;

export default UseGrouping;
