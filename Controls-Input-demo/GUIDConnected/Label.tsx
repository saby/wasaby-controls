import { forwardRef } from 'react';
import { default as GUIDConnected } from 'Controls-Input/GUIDConnected';
import { getLoadConfig, getBinding } from '../resources/_dataContextMock';
import { getOuterTextLabel, getOuterIconLabel } from '../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div
                    className="controlsDemo__wrapper controlsDemo_fixedWidth300 tw-flex tw-flex-col"
                    data-qa="controlsDemo_capture"
                >
                    <GUIDConnected
                        className="controls-margin_top-m"
                        name={getBinding('GUIDConnected')}
                        label={null}
                    />
                    <GUIDConnected
                        className="controls-margin_top-m"
                        name={getBinding('GUIDConnected')}
                        label={getOuterTextLabel('label top')}
                    />
                    <GUIDConnected
                        className="controls-margin_top-m"
                        name={getBinding('GUIDConnected')}
                        label={getOuterTextLabel('label start', 'start')}
                    />
                    <GUIDConnected
                        className="controls-margin_top-m"
                        name={getBinding('GUIDConnected')}
                        label={getOuterIconLabel()}
                    />
                </div>
            </div>
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
