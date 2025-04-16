import { useState, forwardRef } from 'react';
import { Phone, Text } from 'Controls/input';
import { query } from 'Application/Env';

export default forwardRef(function Component(props, ref) {
    // eslint-disable-next-line react/hook-use-state
    const [forTest] = useState(() => {
        return query.get.forTest;
    });
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div
                className="controlsDemo__cell"
                data-qa="Controls-demo_Input_Phone_FlagVisible__cell-true"
            >
                <div className="controls-text-label">flagVisible = true</div>
                <Phone
                    className="ControlsDemo-PhoneInput_phoneField"
                    data-qa="Controls-demo_Input_Phone_FlagVisible__true"
                    onlyMobile={true}
                    placeholder="+7 Телефон"
                    fontSize="xl"
                    inlineHeight="2xl"
                    flagVisible={true}
                />
            </div>
            <div
                className="controlsDemo__cell"
                data-qa="Controls-demo_Input_Phone_FlagVisible__cell-false"
            >
                <div className="controls-text-label">flagVisible = false</div>
                <Phone
                    className="ControlsDemo-PhoneInput_phoneField"
                    data-qa="Controls-demo_Input_Phone_FlagVisible__false"
                    onlyMobile={true}
                    placeholder="+7 Телефон"
                    fontSize="xl"
                    inlineHeight="2xl"
                    flagVisible={false}
                />
            </div>
            {forTest && (
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">for copy to clipboard</div>
                    <Text data-qa="Controls-demo_Input_Phone_FlagVisible__for-copy" />
                </div>
            )}
        </div>
    );
});
