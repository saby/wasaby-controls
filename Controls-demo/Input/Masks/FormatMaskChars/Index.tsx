import { useState, forwardRef } from 'react';
import { Mask } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const [value1, setValue1] = useState('53beecb9-4638-4473-8650-78c626babc26');
    const [value2, setValue2] = useState('1010');
    const formatMaskChars = {
        x: '[A-Fa-f0-9]',
        y: '[0-1]',
    };
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Mask
                    replacer=" "
                    mask="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    value={value1}
                    onValueChanged={setValue1}
                    formatMaskChars={formatMaskChars}
                    className="ControlsDemo-MaskInput_phoneField"
                />
            </div>
            <div className="controlsDemo__cell">
                <Mask
                    replacer=" "
                    mask="yyyy"
                    value={value2}
                    onValueChanged={setValue2}
                    formatMaskChars={formatMaskChars}
                    className="ControlsDemo-MaskInput_phoneField"
                />
            </div>
        </div>
    );
});
