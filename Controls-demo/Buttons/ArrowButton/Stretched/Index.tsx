import { forwardRef } from 'react';
import { ArrowButton } from 'Controls/extButtons';

export default forwardRef(function StretchedWithSizes(_, ref) {
    const directions = ['up', 'right'];
    return (
        <div
            ref={ref}
            className="controls-padding_top-m controls-padding_bottom-m tw-flex ws-justify-content-center"
        >
            <div
                className="tw-flex ws-flex-column ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                {directions.map((direction) => (
                    <div
                        key={direction}
                        data-qa="controlsDemo_Buttons__capture"
                        className="tw-flex ws-justify-content-center ws-align-items-center controls-margin_bottom-m"
                    >
                        <div className="controls-margin_right-2xl">
                            <ArrowButton
                                inlineHeight='s'
                                translucent={true}
                                iconSize='s'
                                direction={direction}
                                viewMode="stretched"
                            />
                        </div>
                        <div className="controls-margin_right-2xl">
                            <ArrowButton
                                translucent={true}
                                inlineHeight='m'
                                iconSize='m'
                                direction={direction}
                                viewMode="stretched"
                            />
                        </div>
                        <div className="controls-margin_right-m">
                            <ArrowButton
                                translucent={true}
                                inlineHeight='l'
                                direction={direction}
                                iconSize='l'
                                viewMode="stretched"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});
