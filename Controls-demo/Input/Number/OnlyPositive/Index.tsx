import { useState, forwardRef } from 'react';
import { Number } from 'Controls/input';

const STYLE = { width: '200px' };

export default forwardRef(function Component(props, ref) {
    const [value1, setValue1] = useState(null);
    const [value2, setValue2] = useState(null);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell demo-NumberBase__onlyPositive-false">
                <Number
                    onlyPositive={false}
                    value={value1}
                    onValueChanged={setValue1}
                    style={STYLE}
                />
            </div>
            <div className="controlsDemo__cell demo-NumberBase__onlyPositive-true">
                <Number
                    onlyPositive={true}
                    value={value2}
                    onValueChanged={setValue2}
                    style={STYLE}
                />
            </div>
        </div>
    );
});
