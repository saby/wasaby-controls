import { forwardRef } from 'react';
import { Text } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Length = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Text
                        name={getBinding('String')}
                        label={getOuterTextLabel('length')}
                        length={{
                            minLength: 3,
                            maxLength: 28,
                        }}
                        data-qa="Controls-Input-demo_InputConnected_Text_Length__28"
                    />
                    <Text
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('length is empty')}
                        data-qa="Controls-Input-demo_InputConnected_Text_Length__empty"
                    />
                </div>
            </div>
        </div>
    );
});

Length.getLoadConfig = getLoadConfig;

export default Length;
