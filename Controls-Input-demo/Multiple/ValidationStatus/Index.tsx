import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';
import Multiple, { IInputSetting } from 'Controls-Input/Multiple';
import { Phone, Text } from 'Controls/input';
import { Controller, isPhoneMobile } from 'Controls/validate';
import { Button } from 'Controls/buttons';

function maxLengthValidator({ value }): boolean | string {
    if (value.length > 10) {
        return 'Максимально разрешённое число символов - 10';
    }
    return true;
}

function emptyPhoneValidator({ value }): boolean | string {
    if (!value.length) {
        return 'Номер телефона не указан';
    }
    return true;
}

export default forwardRef(function ValidationStatusMultipleInput(_, ref) {
    const validationRef = useRef();
    const [firstValue, setFirstValue] = useState('');
    const [secondValue, setSecondValue] = useState('');
    const [phoneNumberValue, setPhoneNumberValue] = useState('');
    const firstValidators = useCallback(
        [maxLengthValidator.bind(null, { value: firstValue })],
        [firstValue]
    );
    const phoneValidators = useCallback(
        [
            emptyPhoneValidator.bind(null, { value: phoneNumberValue }),
            isPhoneMobile.bind(null, { value: phoneNumberValue, doNotValidate: false }),
        ],
        [phoneNumberValue]
    );
    const secondValidators = useCallback(
        [maxLengthValidator.bind(null, { value: secondValue })],
        [secondValue]
    );
    const inputSetting: IInputSetting[] = useMemo(() => {
        return [
            {
                component: Text,
                componentProps: {
                    placeholder: 'Примечание',
                    value: firstValue,
                    onValueChanged: setFirstValue,
                    validators: firstValidators,
                },
            },
            {
                component: Phone,
                componentProps: {
                    placeholder: '+7 Телефон',
                    onlyMobile: true,
                    value: phoneNumberValue,
                    onValueChanged: setPhoneNumberValue,
                    validators: phoneValidators,
                },
            },
            {
                component: Text,
                componentProps: {
                    placeholder: 'Примечание',
                    value: secondValue,
                    onValueChanged: setSecondValue,
                    validators: secondValidators,
                },
            },
        ];
    }, [
        firstValue,
        phoneNumberValue,
        secondValue,
        firstValidators,
        phoneValidators,
        secondValidators,
    ]);

    const handleBtnClick = useCallback(() => {
        if (validationRef.current) {
            validationRef.current?.submit();
        }
    }, []);

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="extControlsDemo controls-margin_left-m controlsDemo_fixedWidth300">
                    <div className="controls-text-label">
                        <p>
                            Ограничение на количество введённых символов в левом и правом поле - 10.
                        </p>
                        <p>Проверка на пустоту в поле ввода номера телефона</p>
                    </div>
                    <div>
                        <Controller ref={validationRef} className="controls-margin_bottom-xl">
                            <Multiple inputSettings={inputSetting} />
                        </Controller>
                        <Button
                            onClick={handleBtnClick}
                            caption="Запустить валидацию"
                            data-qa={'Controls-Input-demo_Multiple_ValidationStatus__check'}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
});
