import { useState, forwardRef } from 'react';
import { Mask } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const [value, setValue] = useState('');
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const masks = [
        'L ddd LL ddd',
        'L dddd dd',
        'ddd LL d dd',
        'LL dddd dd',
        'xxxxxxxxxxxxxxxxxxxx',
    ];
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Mask
                    replacer=" "
                    mask="ddd.ddd.ddd.ddd"
                    value={value1}
                    onValueChanged={setValue1}
                    className="ControlsDemo-MaskInput_ipField"
                />
            </div>
            <div className="controlsDemo__cell">
                <Mask
                    replacer="_"
                    mask="dddd dddd dddd dddd"
                    value={value2}
                    onValueChanged={setValue2}
                    className="ControlsDemo-MaskInput_cardField"
                />
            </div>
            <div className="controlsDemo__cell">
                <div className="controls-text-label">Автомобильные номера</div>
                <Mask
                    placeholder="А 000 АА 00"
                    mask={masks}
                    value={value}
                    onValueChanged={setValue}
                    className="ControlsDemo-MaskInput_carField"
                />
            </div>
        </div>
    );
});
