import { forwardRef, useRef, useState, LegacyRef } from 'react';
import { InputContainer, isEmail } from 'Controls/validate';
import { Text } from 'Controls/input';

export default forwardRef((_, ref: LegacyRef<HTMLDivElement>) => {
    const inputValidateRef = useRef<InputContainer>();
    const [value, setValue] = useState('');
    const [validityState, setValidityState] = useState<boolean>(false);
    const validateHandler = () => {
        if (inputValidateRef.current) {
            setValidityState(inputValidateRef.current.isValid());
        }
    };

    return (
        <div className="controlsDemo__ml2" ref={ref}>
            <div className="controlsDemo__cell ws-flexbox ws-align-items-end">
                <InputContainer
                    ref={inputValidateRef}
                    value={value}
                    onValidateFinished={validateHandler}
                    validators={[() => isEmail({ value })]}
                    onValueChanged={setValue}
                    className="validate_item_input ControlsDemo-ValidateInfobox_inputValidate2"
                >
                    <Text value={value} placeholder="Введите Email" />
                </InputContainer>
                <div
                    className={`controlsDemo__ml2 controls-text-${
                        validityState ? 'success' : 'danger'
                    }`}
                >
                    Валидность введенных данных
                </div>
            </div>
        </div>
    );
});
