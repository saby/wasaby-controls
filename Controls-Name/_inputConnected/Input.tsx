import { useCallback, useEffect, useRef, useState } from 'react';
import { clearProps, useConnectedValue } from 'Controls-Input/useConnectedValue';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { INameProps, InputLabel } from 'Controls-Input/inputConnected';
import { IControlProps } from 'Controls/interface';
import { default as NameInput, INameValue } from 'Controls-Name/Input';
import { default as MultilineContainer } from 'Controls-Name/MultilineContainer';
import * as rk from 'i18n!Controls';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import { getSizeProps } from 'Controls-Input/utils';

function validateName({ value }: { value: INameValue }) {
    const isEmpty = !(value && (value.middleName || value.firstName || value.lastName));
    return isEmpty ? rk('Поле обязательно для заполнения') : true;
}

const VALIDATE_FNS = [validateName];

const FIRST_FIELD = ['lastName'];
const SECOND_FIELD = ['firstName', 'middleName'];

function FirstNameComponents(props) {
    return <NameInput {...props} onFocus={undefined} className={undefined} fields={FIRST_FIELD} />;
}

function SecondNameComponents(props) {
    return (
        <NameInput
            {...props}
            onFocus={undefined}
            className="controls-margin_top-s"
            fields={SECOND_FIELD}
        />
    );
}

/**
 * Редактор типа "ФИО", работающий со слайсом формы
 * @param props
 */
function Input(props: INameProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name);
    const [inputValue, setInputValue] = useState<INameValue>(value);
    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props, VALIDATE_FNS),
        ref
    );

    const onValueChanged = useCallback((_, result: INameValue) => {
        resetValidation();
        setInputValue(result);
    }, []);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const onInputCompleted = useCallback((_, result: INameValue) => {
        onChange(result);
        validate();
    }, []);
    const onFocusHandler = () => {
        onFocus();
        onChange(inputValue);
        validate();
    };
    const sizeProps = getSizeProps(props);

    return (
        <InputLabel
            value={value}
            label={props.label}
            className={props.className}
            fontSize={sizeProps.fontSize}
        >
            {unsafe_getRootAdaptiveMode().device.isPhone() ? (
                <MultilineContainer
                    ref={ref}
                    // @ts-ignore
                    {...clearProps(props)}
                    className="Name-Input-connected tw-flex tw-flex-col"
                    value={inputValue}
                    // @ts-ignore
                    onValueChanged={onValueChanged}
                    onFocus={onFocusHandler}
                    // @ts-ignore
                    customEvents={['onValueChanged']}
                    validationStatus={validationStatus}
                    {...sizeProps}
                    firstLineTemplate={FirstNameComponents}
                    secondLineTemplate={SecondNameComponents}
                />
            ) : (
                <NameInput
                    ref={ref}
                    // @ts-ignore
                    {...clearProps(props)}
                    className="Name-Input-connected"
                    value={inputValue}
                    // @ts-ignore
                    onValueChanged={onValueChanged}
                    onInputCompleted={onInputCompleted}
                    onFocus={onFocus}
                    // @ts-ignore
                    customEvents={['onValueChanged', 'onInputCompleted']}
                    validationStatus={validationStatus}
                    {...sizeProps}
                />
            )}
        </InputLabel>
    );
}

Input.displayName = 'Controls-Name/inputConnected:Input';
export { Input };
