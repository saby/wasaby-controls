import { forwardRef } from 'react';
import { Money } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Required = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Money
                        name={getBinding('Money')}
                        label={getOuterTextLabel('required = true')}
                        required={true}
                    />
                    <Money
                        name={getBinding('Empty')}
                        label={getOuterTextLabel('required is empty')}
                    />
                </div>
            </div>
        </div>
    );
});

Required.getLoadConfig = getLoadConfig;

export default Required;
