import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Back } from 'Controls/heading';

export default React.forwardRef(function Demo(
    _props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper controlsDemo_fixedWidth300">
            <div className="controlsDemo__cell">
                <div className="controls-text-label">iconViewMode = "default"</div>
                <Back caption="Back" iconViewMode="default" />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">iconViewMode = "functionalButton"</div>
                <Back caption="Back" iconViewMode="functionalButton" />
            </div>
            <div className="controlsDemo__cell controls-background-contrast">
                <div className="controls-text-label">
                    iconViewMode = "functionalButton"
                    <br />
                    buttonStyle = "default"
                </div>
                <Back
                    caption="Back"
                    iconStyle="primary"
                    iconViewMode="functionalButton"
                    buttonStyle="default"
                />
            </div>
        </div>
    );
});
