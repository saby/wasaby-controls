import { forwardRef } from 'react';
import { Input as DateTime } from 'Controls-Input/datetimeConnected';
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
                    <DateTime
                        className="controls-margin_top-m"
                        name={getBinding('DateTime')}
                        label={null}
                    />
                    <DateTime
                        className="controls-margin_top-m"
                        name={getBinding('DateTime')}
                        label={getOuterTextLabel('label top')}
                    />
                    <DateTime
                        className="controls-margin_top-m"
                        name={getBinding('DateTime')}
                        label={getOuterTextLabel('label start', 'start')}
                    />
                    <DateTime
                        className="controls-margin_top-m"
                        name={getBinding('DateTime')}
                        label={getOuterIconLabel()}
                    />
                </div>
            </div>
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
