import { useCallback, useEffect, useRef, useState } from 'react';
import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { INameProps, InputLabel } from 'Controls-Input/inputConnected';
import { IControlProps } from 'Controls/interface';
import { default as NameInput, INameValue as IDefaultNameProps, ISuggestInput, } from 'Controls-Name/Input';
import { default as MultilineContainer } from 'Controls-Name/MultilineContainer';
import { Model } from 'Types/entity';
import * as rk from 'i18n!Controls';
import { unsafe_getRootAdaptiveMode } from 'UI/Adaptive';
import { getSizeProps } from 'Controls-Input/utils';

function validateName({value}: { value: INameProps['value'] }) {
    const isEmpty = !(value && (value.get('MiddleName') || value.get('FirstName') || value.get('LastName')));
    return isEmpty ? rk('Поле обязательно для заполнения') : true;
}

const VALIDATE_FNS = [validateName];

const FIRST_FIELD = ['lastName'];
const SECOND_FIELD = ['firstName', 'middleName'];

function FirstNameComponents(props: ISuggestInput) {
    return <NameInput {...props} onFocus={undefined} className={undefined} fields={FIRST_FIELD} />;
}

function SecondNameComponents(props: ISuggestInput) {
    return (
        <NameInput
            {...props}
            onFocus={undefined}
            className="controls-margin_top-s"
            fields={SECOND_FIELD}
        />
    );
}

function getCorrectValue(value: INameProps['value']): IDefaultNameProps | undefined {
    if (value) {
        return {
            firstName: value.get?.('FirstName') || value.firstName,
            lastName: value.get?.('LastName') || value.lastName,
            middleName: value.get?.('MiddleName') || value.middleName,
        };
    }
    return value;
}

function setValue(model: INameProps['value'], value: IDefaultNameProps | undefined): INameProps['value'] {
    if (model && typeof model.set === 'function') {
        model.set('FirstName', value?.firstName);
        model.set('LastName', value?.lastName);
        model.set('MiddleName', value?.middleName);
        return model;
    }
    return new Model({
        rawData: {
            FirstName: value?.firstName,
            LastName: value?.lastName,
            MiddleName: value?.middleName,
        }
    })
}

/**
 * Редактор типа "ФИО", работающий со слайсом формы
 * @param {INameProps} props
 */
function Input(props: INameProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name);
    const [inputValue, setInputValue] = useState<IDefaultNameProps | undefined>(
        getCorrectValue(value as INameProps['value'])
    );
    const ref = useRef();
    const {onFocus, resetValidation, validate, validationStatus} = useValidation(
        props.name,
        getValidators(props, VALIDATE_FNS),
        ref
    );

    const onValueChanged = useCallback((_, result: IDefaultNameProps) => {
        resetValidation();
        setInputValue(result);
    }, []);

    useEffect(() => {
        setInputValue(getCorrectValue(value as INameProps['value']));
    }, [value]);

    const onInputCompleted = useCallback((_, result: IDefaultNameProps) => {
        onChange(setValue(value as INameProps['value'], result));
        validate();
    }, []);
    const onFocusHandler = () => {
        onFocus();
        onChange(setValue(value as INameProps['value'], inputValue));
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
