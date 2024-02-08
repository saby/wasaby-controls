import { forwardRef, useMemo } from 'react';
import Multiple, { IInputSetting, TMultipleValidationStatus } from 'Controls-Input/Multiple';
import * as React from 'react';
import { Phone, Text } from 'Controls/input';
import { Controller } from 'Controls/validate';
import { Button } from 'Controls/buttons';

export default forwardRef(function ValidationStatusMultipleInput(_, ref) {
    const validationRef = React.useRef();
    const [validationStatus, setValidationStatus] =
        React.useState<TMultipleValidationStatus>('valid');
    const firstValue = React.useRef('');
    const secondValue = React.useRef('');
    const firstValidators = [
        (): boolean | string => {
            if (firstValue.current.length > 10) {
                return 'Максимально разрешённое число символов - 10';
            }
            return true;
        },
    ];
    const secondValidators = [
        (): boolean | string => {
            if (secondValue.current.length > 10) {
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
                    value: firstValue.current,
                    onValueChanged: (event: Event, value: string) => {
                        firstValue.current = value;
                        setValidationStatus('valid');
                    },
                    customEvents: ['onValueChanged'],
                    validators: firstValidators,
                },
            },
            {
                component: Phone,
                componentProps: {
                    placeholder: '+7 Телефон',
                    onlyMobile: true,
                },
            },
            {
                component: Text,
                componentProps: {
                    placeholder: 'Примечание',
                    value: secondValue.current,
                    onValueChanged: (event: Event, value: string) => {
                        secondValue.current = value;
                        setValidationStatus('valid');
                    },
                    customEvents: ['onValueChanged'],
                    validators: secondValidators,
                },
            },
        ];
    }, [firstValue.current, secondValue.current]);

    const handleBtnClick = () => {
        if (validationRef?.current && validationStatus === 'valid') {
            validationRef.current.submit().then((res) => {
                if (res.hasErrors) {
                    setValidationStatus('invalid');
                }
            });
        }
    };

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="extControlsDemo controls-margin_left-m controlsDemo_fixedWidth300">
                    <div className="controls-text-label">maxLength=10</div>
                    <div>
                        <Controller ref={validationRef} className="controls-margin_bottom-xl">
                            <Multiple
                                validationStatus={validationStatus}
                                inputSettings={inputSetting}
                            />
                        </Controller>
                        <Button onClick={handleBtnClick} caption="Запустить валидацию" />
                    </div>
                </div>
            </div>
        </div>
    );
});
