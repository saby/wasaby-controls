import { forwardRef } from 'react';
import { ArrowButton } from 'Controls/extButtons';

export default forwardRef(function ViewMode(_, ref) {
    return <div ref={ref}
                className="controls-padding_top-m controls-padding_bottom-m tw-flex ws-justify-content-center">
        <div className="tw-flex ws-flex-column ws-align-items-center" data-qa="controlsDemo_capture">
            <div data-qa="controlsDemo_Buttons__capture"
                 className="tw-flex ws-justify-content-center ws-align-items-center">
                <div className="controls-margin_right-m">
                    <ArrowButton viewMode="filled"/>
                </div>
                <div className="controls-margin_right-m">
                    <ArrowButton viewMode="ghost"/>
                </div>
                <div>
                    <ArrowButton viewMode="stretched" iconStyle='contrast'/>
                </div>
            </div>
        </div>
    </div>;
});
