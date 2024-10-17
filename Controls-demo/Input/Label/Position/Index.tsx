import { forwardRef } from 'react';
import { Label, Text } from 'Controls/input';
import { InputContainer } from 'Controls/jumpingLabel';

export default forwardRef(function Position(_, ref) {
    return (
        <div
            ref={ref}
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
        >
            <div className="controlsDemo__label_wrapper controlsDemo_fixedWidth200">
                <div className="controlsDemo__label controls-fontsize-xs controls-text-unaccented">
                    Метка сбоку
                </div>
            </div>
            <div className="tw-flex  controlsDemo_fixedWidth200">
                <div className="tw-flex tw-flex-col">
                    <div className="controlsDemo__cell">
                        <Label caption="Метка" />
                    </div>
                    <div className="controlsDemo__cell">
                        <Label caption="Метка" required={true} />
                    </div>
                </div>
                <div className="tw-flex tw-flex-col">
                    <div className="controlsDemo__cell tw-flex">
                        <Text />
                    </div>
                    <div className="controlsDemo__cell tw-flex">
                        <Text />
                    </div>
                </div>
            </div>

            <div className="controlsDemo__label_wrapper controlsDemo_fixedWidth200">
                <div className="controlsDemo__label controls-fontsize-xs controls-text-unaccented">
                    Метка сверху
                </div>
            </div>
            <div className="controlsDemo__cell ws-flex-column tw-flex controlsDemo_fixedWidth200">
                <div className="controls-text-label controls-fontsize-xs">
                    Постоянная метка
                </div>
                <Text />
            </div>
            <div className="controlsDemo__cell ws-flex-column controlsDemo_fixedWidth200">
                <InputContainer caption="Прыгающая метка" required={true} content={<Text />} />
            </div>
        </div>
    );
});
