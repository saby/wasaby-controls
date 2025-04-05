import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const [value, setValue] = useState('text');
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell controlsDemo__flex ws-align-items-center">
                <div className="controls-text-label controlsDemo_fixedWidth300">
                    Поле ввода с привязкой состояния:
                </div>
                <Text className="controlsDemo__input" value={value} onValueChanged={setValue} />
            </div>
            <div className="controlsDemo__cell controlsDemo__flex ws-align-items-center">
                <div className="controls-text-label controlsDemo_fixedWidth300">
                    Режим только чтение:
                </div>
                <Text className="controlsDemo__input" value="text" readOnly={true} />
            </div>
        </div>
    );
});
