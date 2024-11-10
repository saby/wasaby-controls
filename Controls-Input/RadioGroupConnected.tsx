/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import { getValidators, useValidation } from 'Controls-Input/validators';
import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { Control } from 'Controls/RadioGroup';
import { RecordSet } from 'Types/collection';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import { IControlProps, TSelectedKey } from 'Controls/interface';
import { InputLabel } from 'Controls-Input/inputConnected';
import {
    IDirectionOptions,
    IItemsOptions,
    ILabelOptions,
    INameOptions,
    IRequiredOptions,
    IWrapOptions,
} from 'Controls-Input/interface';
import * as rk from 'i18n!Controls-Input';
import { Enum } from 'Types/collection';
import { getArrayFromEnum } from 'Controls/source';

export interface IRadioGroupProps
    extends INameOptions,
        ILabelOptions,
        IRequiredOptions,
        IItemsOptions,
        IDirectionOptions,
        IWrapOptions {}

const defaultItems = new RecordSet({
    keyProperty: 'id',
    rawData: [
        {
            id: 1,
            title: rk('Первый'),
            parent: null,
            node: false,
        },
        {
            id: 2,
            title: rk('Второй'),
            parent: null,
            node: false,
        },
    ],
});

/**
 * Редактор типа "Группа радиокнопок", работающий со слайсом формы
 * @param props
 */
function RadioGroupConnected(props: IRadioGroupProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name);
    const selectedKey = value instanceof Enum ? value.getAsValue(true) : value;
    const [localValue, setLocalValue] = useState<TSelectedKey>(props.variants?.selectedKeys?.[0]);
    const { label, className, wrapText = false } = props;
    const ref = useRef();
    const { resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
    );

    useEffect(() => {
        setLocalValue(props.variants?.selectedKeys?.[0]);
    }, [props.variants?.selectedKeys?.[0]]);

    const onSelectedKeyChanged = useCallback(
        (event: SyntheticEvent, changedValue: TSelectedKey) => {
            if (value instanceof Enum) {
                value.setByValue(changedValue, true);
            }
            resetValidation();
            onChange(value instanceof Enum ? value : changedValue);
            setLocalValue(changedValue);
        },
        [onChange]
    );
    const variantsItems =
        value instanceof Enum ? getArrayFromEnum(value, 'id', 'title') : props.variants?.items;
    const items = useMemo(() => {
        return variantsItems
            ? new RecordSet({
                  keyProperty: 'id',
                  rawData: variantsItems,
              })
            : defaultItems;
    }, [variantsItems, defaultItems, value]);
    const onBlurHandler = useCallback(() => {
        validate();
    }, []);
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    return (
        <InputLabel value={value} label={label} className={classes}>
            <Control
                ref={ref}
                selectedKey={selectedKey || localValue}
                onSelectedKeyChanged={onSelectedKeyChanged}
                parentProperty="parent"
                nodeProperty="node"
                keyProperty="id"
                {...clearProps(props)}
                items={items}
                multiline={wrapText || props.direction === 'horizontal'}
                validationStatus={validationStatus}
                onBlur={onBlurHandler}
            />
        </InputLabel>
    );
}

RadioGroupConnected.displayName = 'Controls-Input/RadioGroupConnected';
export default RadioGroupConnected;
