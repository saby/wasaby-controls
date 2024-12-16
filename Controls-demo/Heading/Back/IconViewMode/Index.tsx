import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { Back } from 'Controls/heading';

export default React.forwardRef(function Demo(
    _props: TInternalProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    return (
        <div ref={ref} className="controlsDemo__wrapper tw-flex">
            <div className="controlsDemo__cell controls-padding_left-m controlsDemo_fixedWidth200">
                <div className="controls-text-label controls-padding_bottom-m">
                    Иконка без подложки
                    <br />
                    iconViewMode = "default"
                </div>
                <Back caption="Back" iconViewMode="default" />
            </div>
            <div className="controlsDemo__cell controls-padding_left-m controlsDemo_fixedWidth250">
                <div className="controls-text-label controls-padding_bottom-m">
                    С неакцентной заливкой
                    <br />
                    iconViewMode = "functionalButton"
                </div>
                <Back caption="Back" iconViewMode="functionalButton" />
            </div>
            <div className="controlsDemo__cell controls-background-contrast controls-padding_left-m controlsDemo_fixedWidth250">
                <div className="controls-text-label controls-padding_bottom-m">
                    С контрастной заливкой
                    <br />
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
