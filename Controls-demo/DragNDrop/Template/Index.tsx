import { forwardRef, LegacyRef } from 'react';
import { DraggingTemplate } from 'Controls/dragnDrop';
import * as Images from 'Controls-demo/resources/Images';

export default forwardRef(function Template(_, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-justify-content-center"
        >
            <div
                className="controlsDemo__flex ws-justify-content-center ws-align-items-center"
                data-qa="controlsDemo_capture"
            >
                <div className="controlsDemo__flex ws-flex-column ws-align-items-center">
                    <div>
                        <DraggingTemplate />
                    </div>
                    <div className="controls-margin_top-m">
                        <DraggingTemplate image={Images.groups.comics} />
                    </div>
                    <div className="controls-margin_top-m">
                        <DraggingTemplate
                            image={Images.groups.comics}
                            additionalText="Доп. текст"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
