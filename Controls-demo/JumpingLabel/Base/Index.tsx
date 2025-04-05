import { useState, forwardRef } from 'react';
import { Text } from 'Controls/input';
import { InputContainer } from 'Controls/jumpingLabel';

export default forwardRef(function Component(props, ref) {
    const [name, setName] = useState('Maxim');
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell controlsDemo_fixedWidth350">
                <InputContainer
                    className="controlsDemo__input"
                    caption="Enter your name"
                    content={<Text />}
                />
            </div>
            <div className="controlsDemo__cell controlsDemo_fixedWidth350">
                <InputContainer
                    className="controlsDemo__input"
                    value={name}
                    caption="Enter your name"
                    onValueChanged={setName}
                    content={<Text />}
                />
            </div>
        </div>
    );
});
