import { useState, forwardRef } from 'react';
import { Phone } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const [value, setValue] = useState('');
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div
                className="controlsDemo__cell"
                data-qa="Controls-demo_Input_Phone_OnlyMobile__cell-true"
            >
                <div className="controls-text-label">onlyMobile = true</div>
                <Phone
                    className="ControlsDemo-PhoneInput_phoneField"
                    data-qa="Controls-demo_Input_Phone_OnlyMobile__true"
                    value={value}
                    onValueChanged={setValue}
                    placeholder="+7 Телефон"
                    onlyMobile={true}
                />
            </div>
            <div
                className="controlsDemo__cell"
                data-qa="Controls-demo_Input_Phone_OnlyMobile__cell-false"
            >
                <div className="controls-text-label">onlyMobile = false</div>
                <Phone
                    className="ControlsDemo-PhoneInput_phoneField"
                    data-qa="Controls-demo_Input_Phone_OnlyMobile__false"
                    placeholder="+7 (999)"
                    onlyMobile={false}
                />
            </div>
        </div>
    );
});
