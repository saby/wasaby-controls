import { forwardRef } from 'react';
import { Text } from 'Controls-Input/inputConnected';
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
                    <Text
                        className="controls-margin_top-m"
                        name={getBinding('String')}
                        label={null}
                    />
                    <Text
                        className="controls-margin_top-m"
                        name={getBinding('String')}
                        label={getOuterTextLabel('label top')}
                    />
                    <Text
                        className="controls-margin_top-m"
                        name={getBinding('String')}
                        label={getOuterTextLabel('label start', 'start')}
                    />
                    <Text
                        className="controls-margin_top-m"
                        name={getBinding('String')}
                        label={getOuterIconLabel()}
                    />
                </div>
            </div>
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
