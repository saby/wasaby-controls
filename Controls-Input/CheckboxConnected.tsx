import { useConnectedValue, clearProps } from './useConnectedValue';
import { useState, useCallback, useEffect } from 'react';
import { Checkbox } from 'Controls/checkbox';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from 'Controls-Input/inputConnected';
import {
    INameOptions,
    ICaptionLabelOptions,
    IRequiredOptions,
    IWrapOptions,
} from 'Controls-Input/interface';

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
    const {label, wrapText = false} = props;
    let captionPosition;
    if (label?.labelPosition === 'captionStart') {
        captionPosition = 'start';
    } else if (label?.labelPosition === 'captionEnd') {
        captionPosition = 'end';
    }

    const onValueChanged = useCallback((result) => {
        onChange(result);
        setLocalValue(result);
    }, [onChange]);

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
                {...clearProps(props)}
            />
        </InputLabel>
    );
}

CheckboxConnected.displayName = 'Controls-Input/CheckboxConnected';
export default CheckboxConnected;
