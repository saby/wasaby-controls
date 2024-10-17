import { forwardRef } from 'react';
import { Number } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const IntegerLength = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Number
                        name={getBinding('Number')}
                        label={getOuterTextLabel('integersLength = 2')}
                        integersLength={2}
                        data-qa="Controls-Input-demo_InputConnected_Number_IntegersLength__2"
                    />
                    <Number
                        name={getBinding('NumberWithLimit')}
                        label={getOuterTextLabel('integersLength is empty')}
                        data-qa="Controls-Input-demo_InputConnected_Number_IntegersLength__empty"
                    />
                </div>
            </div>
        </div>
    );
});

IntegerLength.getLoadConfig = getLoadConfig;

export default IntegerLength;
