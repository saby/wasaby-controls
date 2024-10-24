import { ArrowButton } from 'Controls/extButtons';
import { forwardRef, LegacyRef } from 'react';

export default forwardRef(function Translucent(_, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center controlsDemo__background-image"
        >
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <ArrowButton className="controls-margin_right-m" translucent="light" />
                <ArrowButton
                    className="controls-margin_right-m"
                    viewMode="stretched"
                    translucent="light"
                />
                <ArrowButton className="controls-margin_right-m" translucent="dark" />
                <ArrowButton
                    className="controls-margin_right-m"
                    viewMode="stretched"
                    translucent="dark"
                />
            </div>
        </div>
    );
});
