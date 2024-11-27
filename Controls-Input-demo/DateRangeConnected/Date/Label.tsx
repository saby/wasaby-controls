import { forwardRef } from 'react';
import { Input } from 'Controls-Input/dateRangeConnected';
import { getBinding, getLoadConfig } from '../../resources/_dataContextMock';
import { getOuterIconLabel, getOuterTextLabel } from '../../resources/utils';

const Label = forwardRef((_, ref) => {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__wrapper controlsDemo__flex">
                <div className="controlsDemo__wrapper controlsDemo_fixedWidth400 tw-flex tw-flex-col">
                    <Input
                        className="controls-margin_top-m"
                        name={getBinding('DateRange')}
                        label={null}
                    />
                    <Input
                        className="controls-margin_top-m"
                        name={getBinding('DateRange')}
                        label={getOuterTextLabel('label top')}
                    />
                    <Input
                        className="controls-margin_top-m"
                        name={getBinding('DateRange')}
                        label={getOuterTextLabel('label start', 'start')}
                    />
                    <Input
                        className="controls-margin_top-m"
                        name={getBinding('DateRange')}
                        label={getOuterIconLabel()}
                    />
                </div>
            </div>
        </div>
    );
});

Label.getLoadConfig = getLoadConfig;

export default Label;
