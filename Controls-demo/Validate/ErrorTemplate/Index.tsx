import { forwardRef, useState, LegacyRef } from 'react';
import { InputContainer, isEmail } from 'Controls/validate';
import { Text } from 'Controls/input';
import { Button } from 'Controls/buttons';

export default forwardRef((_, ref: LegacyRef<HTMLDivElement>) => {
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');

    return (
        <div className="controlsDemo__flexColumn controlsDemo__ml2" ref={ref}>
            <div className="controlsDemo__cell controlsDemo__mb2">
                <div className="controls-text-label controlsDemo__maxWidth550">
                    Кастомное сообщение об ошибке
                </div>
                <InputContainer
                    className="validate_item_input ControlsDemo-ValidateInfobox_inputValidate2"
                    validators={[() => isEmail({ value: value1 })]}
                    onValueChanged={setValue1}
                    errorTemplate={
                        <div>
                            Вместо адреса электронной почты введено :
                            <div>
                                <Button
                                    caption={value1}
                                    fontColorStyle="link"
                                    viewMode="linkButton"
                                    fontSize="m"
                                />
                            </div>
                        </div>
                    }
                >
                    <Text name="textBox" value={value1} placeholder="Введите Email" />
                </InputContainer>
            </div>
            <div className="controlsDemo__cell controlsDemo__mb2">
                <div className="controls-text-label controlsDemo__maxWidth550">
                    Стандартное сообщение об ошибке
                </div>
                <InputContainer
                    className="validate_item_input ControlsDemo-ValidateInfobox_inputValidate2"
                    validators={[() => isEmail({ value: value2 })]}
                    onValueChanged={setValue2}
                >
                    <Text name="textBox" value={value2} placeholder="Введите Email" />
                </InputContainer>
            </div>
        </div>
    );
});
