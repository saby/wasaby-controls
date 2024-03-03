import { forwardRef, LegacyRef } from 'react';
import { Button } from 'Controls/buttons';
import { CloseButton } from 'Controls/extButtons';
import 'css!Controls-demo/ConfirmButtons/ConfirmButtons';

export default forwardRef(function ConfirmButton(_, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
        >
            <div
                className="controlsDemo__flex ws-flex-column controlsDemo_fixedWidth300"
                data-qa="controlsDemo_capture"
            >
                <div className="controlsDemo__flex ws-align-items-center">
                    <div className="controls-text-label controlsDemo_fixedWidth200">success:</div>
                    <div className="controlsDemo__flex ws-align-items-center">
                        <div className="controls-margin_right-m">
                            <Button
                                viewMode="filled"
                                buttonStyle="success"
                                icon="icon-Yes"
                                iconStyle="contrast"
                                iconSize="s"
                            />
                        </div>
                    </div>
                </div>
                <div className="controlsDemo__flex ws-align-items-center controls-margin_top-m">
                    <div className="controls-text-label controlsDemo_fixedWidth200">pale:</div>
                    <div className="controlsDemo__flex ws-align-items-center">
                        <div className="controls-margin_right-m">
                            <Button
                                viewMode="filled"
                                buttonStyle="pale"
                                icon="icon-Yes"
                                iconStyle="success"
                                iconSize="s"
                            />
                        </div>
                    </div>
                </div>
                <div className="controlsDemo__flex ws-align-items-center controls-margin_top-m">
                    <div className="controls-text-label controlsDemo_fixedWidth200">
                        success с крестиком:
                    </div>
                    <div className="controlsDemo__flex ws-align-items-center">
                        <div className="controls-margin_right-m tw-relative">
                            <Button
                                className="controlsDemo__buttonConfirmation_in_closeButton"
                                viewMode="filled"
                                buttonStyle="success"
                                icon="icon-Yes"
                                iconStyle="contrast"
                                iconSize="s"
                            />
                            <CloseButton viewMode="externalWide" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
