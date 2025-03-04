import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';

const placeholder = 'Tooltip';
const defaultValue = 'text';

export default forwardRef(function Component(props, ref) {
    const [rightValue, setRightValue] = useState(defaultValue);
    const [leftValue, setLeftValue] = useState(defaultValue);
    const [centerValue, setCenterValue] = useState(defaultValue);
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    textAlign="left"
                    value={leftValue}
                    onValueChanged={setLeftValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    textAlign="right"
                    value={rightValue}
                    onValueChanged={setRightValue}
                    placeholder={placeholder}
                />
            </div>
            <div className="controlsDemo__cell">
                <Text
                    className="controlsDemo__input"
                    textAlign="center"
                    value={centerValue}
                    onValueChanged={setCenterValue}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
});
