import { useState, forwardRef } from 'react';
import { Mask } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [value3, setValue3] = useState('');
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Mask
                    replacer=" "
                    mask="dddd-dddd-dddd-dddd"
                    value={value1}
                    onValueChanged={setValue1}
                    className="ControlsDemo-MaskInput_ipField"
                />
            </div>
            <div className="controlsDemo__cell">
                <Mask
                    replacer="_"
                    mask="dddd-dddd-dddd-dddd"
                    value={value2}
                    onValueChanged={setValue2}
                    className="ControlsDemo-MaskInput_cardField"
                />
            </div>
            <div className="controlsDemo__cell">
                <Mask
                    replacer="x"
                    mask="dddd-dddd-dddd-dddd"
                    value={value3}
                    onValueChanged={setValue3}
                    className="ControlsDemo-MaskInput_phoneField"
                />
            </div>
        </div>
    );
});
