import { useCallback, useEffect, useRef, useState } from 'react';
import { InputLabel } from 'Controls-Input/inputConnected';
import { IComponentProps } from 'Controls/interface';
import { SNILS as SNILSInput } from 'ExtControls/input';
import { clearProps, useConnectedValue, useFormReadonly } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import {
    IInputDefaultValueOptions,
    ILabelOptions,
    INameOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { getDefaultPlaceholder, getStyleProps } from 'Controls-Input/utils';

/**
 * Интерфейс, описывающий опции редактора типа "SNILS"
 * @public
 * @implements Controls-Input/interface:INameOptions
 * @implements Controls-Input/interface:IInputDefaultValueOptions
 * @implements Controls-Input/interface:ILabelOptions
 * @implements Controls-Input/interface:IMaskOptions
 * @implements Controls-Input/interface:IPlaceholderOptions
 * @implements Controls-Input/interface:IRequiredOptions
 * @implements Controls-Input/interface:IValidateOptions
 */
export interface ISNILSProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IPlaceholderOptions,
        IRequiredOptions,
        IValidateOptions,
        IComponentProps {}

/**
 * Редактор типа "SNILS", работающий со слайсом формы
 * @param {Controls-Input/extInputConnected:ISNILSProps} props Пропсы компонента
 * @public
 */
function SNILS(props: ISNILSProps) {
    const { placeholder = getDefaultPlaceholder() } = props;
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [snilsValue, setSNILSValue] = useState<string>(value);
    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
    );

    const onValueChanged = useCallback((result) => {
        resetValidation();
        setSNILSValue(result);
    }, []);
    const onInputCompleted = useCallback((result) => {
        onChange(result);
        validate();
    }, []);

    useEffect(() => {
        setSNILSValue(value);
    }, [value]);
    const classes = `${props.className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    const styleProps = getStyleProps(props);
    const readOnly = useFormReadonly(props.name);

    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={snilsValue}
            label={props.label}
            className={classes}
            fontSize={styleProps.fontSize}
        >
            <SNILSInput
                ref={ref}
                placeholder={placeholder}
                placeholderVisibility="empty"
                value={snilsValue}
                valueChangedCallback={onValueChanged}
                onInputCompleted={onInputCompleted}
                onFocus={onFocus}
                validationStatus={validationStatus}
                {...clearProps(props)}
                {...styleProps}
                readOnly={readOnly}
            />
        </InputLabel>
    );
}

SNILS.displayName = 'Controls-Input/extInputConnected:SNILS';
export { SNILS };
