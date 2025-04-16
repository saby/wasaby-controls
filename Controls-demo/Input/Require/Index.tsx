import { useState, forwardRef } from 'react';
import { Text, Label } from 'Controls/input';
import { InputContainer } from 'Controls/jumpingLabel';

export default forwardRef(function Component(props, ref) {
    const [requiredValue, setRequiredValue] = useState('');
    const [requiredValue1, setRequiredValue1] = useState('');
    const rootClass =
        props.className +
        ' controlsDemo__wrapper controlsDemo__flex ws-flex-column ws-align-items-center';
    return (
        <div className={rootClass} ref={ref}>
            <div className="controlsDemo__cell controlsDemo__flex controlsDemo_fixedWidth300">
                <Label caption="Label" required={true} />
                <Text
                    className="ws-flex-grow-1"
                    value={requiredValue}
                    onValueChanged={setRequiredValue}
                />
            </div>
            <div className="controlsDemo__cell controlsDemo__flex controlsDemo_fixedWidth300">
                <InputContainer
                    className="controlsDemo_fixedWidth300"
                    value={requiredValue1}
                    onValueChanged={setRequiredValue1}
                    required={true}
                    caption="Label"
                    content={<Text />}
                />
            </div>
        </div>
    );
});
