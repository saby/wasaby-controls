import { useState, forwardRef } from 'react';
import { Number } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const [value1, setValue1] = useState(null);
    const [value2, setValue2] = useState(null);
    const [value3, setValue3] = useState(null);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Number value={value1} onValueChanged={setValue1} style={{ width: '200px' }} />
            </div>
            <div className="controlsDemo__cell">
                <Number
                    value={value2}
                    onValueChanged={setValue2}
                    precision={0}
                    style={{ width: '200px' }}
                />
            </div>
            <div className="controlsDemo__cell">
                <Number
                    precision={1}
                    value={value3}
                    onValueChanged={setValue3}
                    style={{ width: '200px' }}
                />
            </div>
        </div>
    );
});
