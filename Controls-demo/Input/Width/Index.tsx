import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';

export default forwardRef(function Component(props, ref) {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__flex ws-flex-column ws-align-items-center">
                <div className="controls-text-label controls-margin_bottom-s">
                    Ширина ограничена в 200px
                </div>
                <Text value={value1} onValueChanged={setValue1} style={{ width: '200px' }} />
            </div>
            <div className="controlsDemo__flex ws-flex-column ws-align-items-center">
                <div className="controls-text-label controls-margin_bottom-s">
                    Ширина ограничена в 5 символов
                </div>
                <Text
                    value={value2}
                    onValueChanged={setValue2}
                    className="controls-Input__width-5ch"
                />
            </div>
        </div>
    );
});
