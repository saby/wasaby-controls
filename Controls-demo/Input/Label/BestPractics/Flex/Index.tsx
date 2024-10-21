import { forwardRef } from 'react';
import { Label, Text } from 'Controls/input';
import { useDemoData } from '../resources/data';

export default forwardRef(function Flex(_, ref) {
    const { address, addressHandler, mail, mailHandler, tel, telHandler } = useDemoData();
    return (
        <div
            className="controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center"
            ref={ref}
        >
            <div className="tw-flex">
                <div className="controlsDemo__cell ws-flex-column tw-flex controlsDemo_fixedWidth200">
                    <Label caption="Адрес" />
                    <Text value={address} onValueChanged={addressHandler} />
                </div>
                <div className="controlsDemo__cell ws-flex-column tw-flex controlsDemo_fixedWidth200 controls-margin_left-s">
                    <Label caption="Телефон" />
                    <Text value={tel} onValueChanged={telHandler} />
                </div>
                <div className="controlsDemo__cell ws-flex-column tw-flex controlsDemo_fixedWidth200 controls-margin_left-s">
                    <Label caption="Email" />
                    <Text value={mail} onValueChanged={mailHandler} />
                </div>
            </div>
        </div>
    );
});
