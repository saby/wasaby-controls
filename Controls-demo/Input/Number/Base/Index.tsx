import { useState, forwardRef } from 'react';
import { Number } from 'Controls/input';

const STYLE = { width: '200px' };

export default forwardRef(function Component(props, ref) {
    const [value1, setValue1] = useState(null);
    const [value2, setValue2] = useState(null);
    const [value3, setValue3] = useState(null);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell demo-NumberBase__default">
                <div className="controls-text-label">Стандартная настройка</div>
                <Number value={value1} onValueChanged={setValue1} style={STYLE} />
            </div>
            <div className="controlsDemo__cell demo-NumberBase__length4Precision1">
                <div className="controls-text-label">4 знака до запятой и 1 после</div>
                <Number
                    integersLength={4}
                    precision={1}
                    placeholder="1234.5"
                    value={value2}
                    onValueChanged={setValue2}
                    style={STYLE}
                />
            </div>
            <div className="controlsDemo__cell demo-NumberBase__onlyPositive">
                <div className="controls-text-label">Только положительные числа</div>
                <Number
                    onlyPositive={true}
                    value={value3}
                    onValueChanged={setValue3}
                    style={STYLE}
                />
            </div>
        </div>
    );
});
