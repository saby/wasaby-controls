import { forwardRef, LegacyRef } from 'react';
import { InfoBox } from 'Controls/popupTemplate';
import { Button } from 'Controls/buttons';
import 'css!Controls-demo/PopupTemplate/Infobox/NewBackgroundStyle/TemplateVariants/styles';

const bottomStartConfig: object = {
    direction: {
        vertical: 'top',
        horizontal: 'right',
    },
    targetPoint: {
        vertical: 'top',
        horizontal: 'left',
    },
};

function FirstTemplate() {
    return (
        <div className="firstTemplate controls-demo__infobox">
            <div className="firstTemplate__innerContent"></div>
        </div>
    );
}

function SecondTemplate() {
    return (
        <div className="secondTemplate controls-demo__infobox">
            <div>
                <Button viewMode="link" caption="Код налогового органа" />, в который
                предоставляется декаларация
            </div>
        </div>
    );
}

function ThirdTemplate() {
    return (
        <div className="thirdTemplate controls-demo__infobox">
            <div className="thirdTemplate__innerContent"></div>
        </div>
    );
}

function TemplatesVariantsInfobox(_: unknown, ref: LegacyRef<HTMLDivElement>) {
    return (
        <div ref={ref} className="tw-flex tw-justify-center controls-margin_top-2xl ">
            <div className="controlsDemo__maxWidth600 tw-grid tw-grid-cols-2 tw-justify-center tw-justify-items-center">
                <div className="controls-margin_right-2xl">
                    <InfoBox
                        content={FirstTemplate}
                        className="controls-margin_bottom-l controlsDemo__infobox__size"
                        stickyPosition={bottomStartConfig}
                    />
                    <InfoBox
                        content={SecondTemplate}
                        className="controlsDemo__infobox__size"
                        stickyPosition={bottomStartConfig}
                    />
                </div>
                <div>
                    <InfoBox
                        content={ThirdTemplate}
                        className="controlsDemo__infobox__size"
                        stickyPosition={bottomStartConfig}
                    />
                </div>
            </div>
        </div>
    );
}

export default forwardRef(TemplatesVariantsInfobox);
