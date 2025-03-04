import { useState, forwardRef } from 'react';
import { Mask } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('1234 0000 1253 4321');
    const [value3, setValue3] = useState('С065мк');

    const formatMaskChars = {
        x: '[А-Яa-я]',
        y: '[0-9]',
    };
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div>
                <div className="controlsDemo__cell">
                    <div className="controls-text-label">Ввод IP адреса</div>
                    <Mask
                        mask="ddd.ddd.ddd.ddd"
                        placeholder="ddd.ddd.ddd.ddd"
                        value={value1}
                        onValueChanged={setValue1}
                        className="ControlsDemo-MaskInput_ipField"
                    />
                </div>
                <div className="controlsDemo__cell controlsDemo__flex ws-flex-column ws-align-items-start">
                    <div className="controls-text-label">Ввод кредитной карты</div>
                    <Mask
                        replacer="_"
                        mask="dddd dddd dddd dddd"
                        value={value2}
                        onValueChanged={setValue2}
                        className="ControlsDemo-MaskInput_cardField"
                    />
                </div>
                <div className="controlsDemo__cell controlsDemo__flex ws-flex-column ws-align-items-start">
                    <div className="controls-text-label">Ввод автомобильного номера</div>
                    <Mask
                        replacer=" "
                        mask="xyyyxx"
                        formatMaskChars={formatMaskChars}
                        value={value3}
                        onValueChanged={setValue3}
                        className="ControlsDemo-MaskInput_phoneField"
                    />
                </div>
            </div>
        </div>
    );
});
