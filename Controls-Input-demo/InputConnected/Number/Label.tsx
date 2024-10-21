import { forwardRef } from 'react';
import { Number } from 'Controls-Input/inputConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterIconLabel, getOuterTextLabel } from '../../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col">
                    <Number
                        className="controls-margin_top-m"
                        name={getBinding('Number')}
                        label={null}
                    />
                    <Number
                        className="controls-margin_top-m"
                        name={getBinding('Number')}
                        label={getOuterTextLabel('label top')}
                    />
                    <Number
                        className="controls-margin_top-m"
                        name={getBinding('Number')}
                        label={getOuterTextLabel('label start', 'start')}
                    />
                    <Number
                        className="controls-margin_top-m"
                        name={getBinding('Number')}
                        label={getOuterIconLabel()}
                    />
                </div>
            </div>
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
