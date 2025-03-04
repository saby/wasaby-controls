import { forwardRef } from 'react';
import { Phone } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div
                className="controlsDemo__cell"
                data-qa="Controls-demo_Input_Phone_FlagPosition__cell-start"
            >
                <div className="controls-text-label">flagPosition = start</div>
                <Phone
                    className="ControlsDemo-PhoneInput_phoneField"
                    data-qa="Controls-demo_Input_Phone_FlagPosition__start"
                    onlyMobile={true}
                    flagVisible={true}
                    fontSize="xl"
                    inlineHeight="2xl"
                    placeholder="+7 Телефон"
                    flagPosition="start"
                />
            </div>
            <div
                className="controlsDemo__cell"
                data-qa="Controls-demo_Input_Phone_FlagPosition__cell-end"
            >
                <div className="controls-text-label">flagPosition = end</div>
                <Phone
                    className="ControlsDemo-PhoneInput_phoneField"
                    data-qa="Controls-demo_Input_Phone_FlagPosition__end"
                    onlyMobile={true}
                    flagVisible={true}
                    fontSize="xl"
                    inlineHeight="2xl"
                    placeholder="+7 Телефон"
                    flagPosition="end"
                />
            </div>
        </div>
    );
});
