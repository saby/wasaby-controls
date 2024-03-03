import { forwardRef, useCallback } from 'react';
import { Input } from 'Controls/multipleLookup';
import { Controller } from 'Controls/validate';
import * as React from 'react';
import { Button } from 'Controls/buttons';
import { TMultipleLookupValidationStatus } from 'Controls/multipleLookup';
import * as placeholder from 'wml!Controls-demo/Lookup/ValidationStatus/resources/placeholder';
import * as placeholder2 from 'wml!Controls-demo/Lookup/ValidationStatus/resources/placeholder2';
import { Memory } from 'Types/source';

export default forwardRef(function ValidationStatusMultipleInput(_, ref) {
    const validationRef = React.useRef();

    const handleBtnClick = () => {
        if (validationRef?.current && validationStatus === 'valid') {
            validationRef.current.submit().then((res) => {
                if (res.hasErrors) {
                    setValidationStatus('invalid');
                }
            });
        }
    };

    const [validationStatus, setValidationStatus] =
        React.useState<TMultipleLookupValidationStatus>();
    const [firstValue, setFirstValue] = React.useState('');
    const [selectedKeys1, setSelectedKeys1] = React.useState([0]);
    const [selectedKeys2, setSelectedKeys2] = React.useState([0]);

    const firstValidators = [
        (): boolean | string => {
            if (firstValue.length > 10) {
                return 'Максимально разрешённое число символов - 10';
            }
            return true;
        },
    ];

    const secondValidators = [
        (): boolean | string => {
            if (!selectedKeys2.length) {
                return 'Не выбрано значение';
            }
            return true;
        },
    ];

    const lookupsOptions = [
        {
            name: 'lookup1',
            placeholder,
            searchParam: 'title',
            multiSelect: false,
            fontSize: 'xl',
            fontColorStyle: 'link',
            'data-qa': 'company',
            selectorTemplate: {
                templateName: 'Controls-demo/Lookup/ValidationStatus/resources/selector',
            },
            suggestTemplate: {
                templateName: 'Controls/suggestPopup:SuggestTemplate',
            },
            source: new Memory({
                data: [
                    {
                        id: 0,
                        title: 'Значение 1',
                    },
                    {
                        id: 1,
                        title: 'Значение 2',
                    },
                ],
                keyProperty: 'id',
            }),
            keyProperty: 'id',
            selectedKeys: selectedKeys1,
        },
        {
            name: 'lookup2',
            placeholder: placeholder2,
            searchParam: 'title',
            multiSelect: false,
            fontSize: 'xl',
            fontColorStyle: 'link',
            'data-qa': 'company',
            selectorTemplate: {
                templateName: 'Controls-demo/Lookup/ValidationStatus/resources/selector',
            },
            suggestTemplate: {
                templateName: 'Controls/suggestPopup:SuggestTemplate',
            },
            source: new Memory({
                data: [
                    {
                        id: 0,
                        title: 'Значение 1',
                    },
                    {
                        id: 1,
                        title: 'Значение 2',
                    },
                ],
                keyProperty: 'id',
            }),
            keyProperty: 'id',
            selectedKeys: selectedKeys2,
            validator: secondValidators,
        },
        {
            name: 'input',
            placeholder: 'input',
            keyProperty: 'id',
            value: firstValue,
            'data-qa': 'input',
            validator: firstValidators,
        },
    ];

    const onValueChanged = useCallback(
        (value: object) => {
            setFirstValue(value.input);
            setValidationStatus('valid');
        },
        [firstValue, validationStatus]
    );

    const onSelectedKeysChanged = useCallback(
        (value: object, inputName: string) => {
            if (inputName === 'input1') {
                setSelectedKeys1(value.lookup1);
            } else {
                setSelectedKeys2(value.lookup2);
            }
            setValidationStatus('valid');
        },
        [selectedKeys1, validationStatus]
    );

    return (
        <div ref={ref} className="tw-flex tw-justify-center">
            <div>
                <div className="extControlsDemo controls-margin_left-m controlsDemo_fixedWidth500">
                    <div className="controls-text-label">
                        2-ое и 3-е поля с валидацией, для второго maxLength=10
                    </div>
                    <div>
                        <Controller ref={validationRef} className="controls-margin_bottom-xl">
                            <Input
                                lookupsOptions={lookupsOptions}
                                validationStatus={validationStatus}
                                onValueChanged={onValueChanged}
                                onSelectedKeysChanged={onSelectedKeysChanged}
                                customEvents={['onValueChanged', 'onSelectedKeysChanged']}
                            />
                        </Controller>
                        <Button onClick={handleBtnClick} caption="Запустить валидацию" />
                    </div>
                </div>
            </div>
        </div>
    );
});
