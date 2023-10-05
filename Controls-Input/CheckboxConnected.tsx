import { useConnectedValue, clearProps } from './useConnectedValue';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { Checkbox } from 'Controls/checkbox';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useValidation, getValidators } from 'Controls-Input/validators';
import {
    INameOptions,
    ICaptionLabelOptions,
    IRequiredOptions,
    IWrapOptions,
} from 'Controls-Input/interface';
import * as rk from 'i18n!Controls-Input';

export interface ICheckBoxProps
    extends INameOptions,
        ICaptionLabelOptions,
        IRequiredOptions,
        IWrapOptions {
}

/**
 * Редактор "чекбокса", работающий со слайсом формы
 * @param props
 */
function CheckboxConnected(props: ICheckBoxProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name);
    const [localValue, setLocalValue] = useState(value);
    const {
        label = {
            label: rk('Метка'),
            labelPosition: 'captionEnd'
        }, wrapText = false
    } = props;
    let captionPosition;
    if (label?.labelPosition === 'captionStart') {
        captionPosition = 'start';
    } else if (label?.labelPosition === 'captionEnd') {
        captionPosition = 'end';
    }

    const defaultValidators = useMemo(() => {
        if (props.required) {
            return [(res) => {
                return res.value;
            }];
        }
        return [];
    }, []);

    const {resetValidation, validate, validationStatus} = useValidation(
        props.name,
        getValidators(props, defaultValidators)
    );

    const onValueChanged = useCallback((result) => {
        resetValidation();
        onChange(result);
        setLocalValue(result);
    }, [onChange]);

    const onBlurHandler = useCallback(() => {
        validate();
    }, []);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    return (
        <InputLabel value={value} label={label} className={props.className}>
            <Checkbox
                value={localValue}
                onValueChanged={onValueChanged}
                customEvents={['onValueChanged']}
                caption={captionPosition ? label?.label : ''}
                captionPosition={captionPosition}
                multiline={wrapText}
                validationStatus={validationStatus}
                onBlur={onBlurHandler}
                {...clearProps(props)}
            />
        </InputLabel>
    );
}

CheckboxConnected.displayName = 'Controls-Input/CheckboxConnected';
export default CheckboxConnected;
