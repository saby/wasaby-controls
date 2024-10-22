import { forwardRef } from 'react';
import { Mask } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const DefaultValue = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Mask
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('defaultValue = QW 123')}
                        mask="LL ddd"
                        defaultValue="QW 123"
                        data-qa="Controls-Input-demo_InputConnected_Mask_DefaultValue__set"
                    />
                    <Mask
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('defaultValue is empty')}
                        mask="LL ddd"
                        data-qa="Controls-Input-demo_InputConnected_Mask_DefaultValue__empty"
                    />
                </div>
            </div>
        </div>
    );
});

DefaultValue.getLoadConfig = getLoadConfig;

export default DefaultValue;
