import { forwardRef, useMemo } from 'react';
import Multiple, { IInputSetting } from 'Controls-Input/Multiple';
import * as React from 'react';
import { Phone, Text } from 'Controls/input';
import { Controller, isPhoneMobile } from 'Controls/validate';
import { Button } from 'Controls/buttons';

export default forwardRef(function ValidationStatusMultipleInput(_, ref) {
    const validationRef = React.useRef();
    const [firstValue, setFirstValue] = React.useState('');
    const [secondValue, setSecondValue] = React.useState('');
    const [phoneNumberValue, setPhoneNumberValue] = React.useState('');
    const firstValidators = [
        (): boolean | string => {
            if (firstValue.length > 10) {
                return 'Максимально разрешённое число символов - 10';
            }
            return true;
        },
    ];
    const phoneValidators = [
        (): boolean | string => {
            if (!phoneNumberValue.length) {
                return 'Номер телефона не указан';
            }
            return true;
        },
        () => isPhoneMobile({ value: phoneNumberValue, doNotValidate: false }),
    ];
    const secondValidators = [
        (): boolean | string => {
            if (secondValue.length > 10) {
                return 'Максимально разрешённое число символов - 10';
            }
            return true;
        },
    ];
    // @ts-ignore
    const inputSetting: IInputSetting[] = useMemo(() => {
        return [
            {
                component: Text,
                componentProps: {
                    placeholder: 'Примечание',
                    value: firstValue,
                    onValueChanged: (event: Event, value: string) => {
                        setFirstValue(value);
                    },
                    validators: firstValidators,
                },
            },
            {
                component: Phone,
                componentProps: {
                    placeholder: '+7 Телефон',
                    onlyMobile: true,
                    value: phoneNumberValue,
                    onValueChanged: (event: Event, value: string) => {
                        setPhoneNumberValue(value);
                    },
                    validators: phoneValidators,
                },
            },
            {
                component: Text,
                componentProps: {
                    placeholder: 'Примечание',
                    value: secondValue,
                    onValueChanged: (event: Event, value: string) => {
                        setSecondValue(value);
                    },
                    validators: secondValidators,
                },
            },
        ];
    }, [firstValue, secondValue]);

    const handleBtnClick = () => {
        if (validationRef.current) {
            validationRef.current?.submit();
        }
    };

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
                        <Button onClick={handleBtnClick} caption="Запустить валидацию" />
                    </div>
                </div>
            </div>
        </div>
    );
});
