import { forwardRef } from 'react';
import { Number } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterTextLabel } from '../../resources/utils';

const Precision = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Number
                        name={getBinding('Number')}
                        label={getOuterTextLabel('precision = 2')}
                        precision={2}
                    />
                    <Number
                        name={getBinding('Number')}
                        label={getOuterTextLabel('precision is empty')}
                    />
                </div>
            </div>
        </div>
    );
});

Precision.getLoadConfig = getLoadConfig;

export default Precision;
