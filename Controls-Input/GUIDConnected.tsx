import { useCallback, useEffect, useMemo, useRef, useState, LegacyRef } from 'react';
import { useConnectedValue } from 'Controls-DataEnv/context';
import { getValidators, MinMaxLength, useValidation } from 'Controls-Input/validators';
import { InputLabel } from 'Controls-Input/inputConnected';
import { ILabelOptions, INameOptions, IRequiredOptions } from 'Controls-Input/interface';
import { getSizeProps } from 'Controls-Input/utils';
import { default as GUID, IGUIDInputProps } from 'Controls-Input/GUID';
import * as translate from 'i18n!Controls-Input';

/**
 * Интерфейс, описывающий опции редактора типа "GUID"
 * @public
 * @implements Controls-Input/interface:INameOptions
 * @implements Controls-Input/interface:ILabelOptions
 * @implements Controls-Input/interface:IPlaceholderOptions
 * @implements Controls-Input/interface:IRequiredOptions
 * @implements Controls-Input/interface:IValidateOptions
 */
export interface IGUIDConnectedProps
    extends INameOptions,
        ILabelOptions,
        IRequiredOptions,
        Omit<IGUIDInputProps, 'name'> {
    readOnly?: boolean;
}

/**
 * Редактор типа "GUID", работающий со слайсом формы
 * @demo Controls-Input-demo/GUIDConnected/Index
 */
function GUIDConnected(props: IGUIDConnectedProps) {
    const { value, onChange } = useConnectedValue(props.name);
    const [textValue, setTextValue] = useState<string>(value);
    const defaultValidators = useMemo(() => {
        if (props.length?.minLength || props.length?.maxLength) {
            return [
                (res) => {
                    return MinMaxLength(props.length, res);
                },
            ];
        }
        return [];
    }, []);
    const ref = useRef<LegacyRef<unknown>>();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props, defaultValidators),
        ref
    );

    const onValueChanged = useCallback((result) => {
        resetValidation();
        setTextValue(result);
    }, []);
    const onInputCompleted = useCallback((result) => {
        onChange(result);
        validate();
    }, []);

    useEffect(() => {
        setTextValue(value);
    }, [value]);
    const { label, className, placeholder = translate('Введите GUID') } = props;
    const classes = `${className || ''}${!!value ? ' controls-Input-connected_filled' : ''}`;
    const sizeProps = getSizeProps(props);
    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={textValue}
            label={label}
            placeholder={placeholder}
            validationStatus={validationStatus}
            className={classes}
            fontSize={sizeProps.fontSize}
        >
            <GUID
                ref={ref}
                attrs={props.attrs}
                data-qa={props.dataQa || props['data-qa']}
                className={className}
                value={textValue}
                valueChangedCallback={onValueChanged}
                onInputCompleted={onInputCompleted}
                placeholder={placeholder}
                placeholderVisibility="empty"
                onFocus={onFocus}
                leftFieldTemplate={props.leftFieldTemplate}
                rightFieldTemplate={props.rightFieldTemplate}
                validationStatus={validationStatus}
                {...sizeProps}
                readOnly={props.readOnly}
            />
        </InputLabel>
    );
}

GUIDConnected.displayName = 'Controls-Input/GUIDConnected';
export default GUIDConnected;
