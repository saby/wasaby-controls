/**
 * @kaizen_zone 5b9ef316-9f00-45a5-a6b7-3b9f6627b1da
 */
import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { Selector } from 'Controls/dropdown';
import { default as ComboboxInput } from 'Controls/ComboBox';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RecordSet } from 'Types/collection';
import {
    IComboboxItem,
    IComboboxItemsOptions,
    ILabelOptions,
    IMultiSelectOptions,
    INameOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IVisibleItemsCountOptions,
} from 'Controls-Input/interface';
import { IControlProps, TSelectedKey } from 'Controls/interface';
import * as rk from 'i18n!Controls-Input';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { useReadonly } from 'UICore/Contexts';
import { getSizeProps } from 'Controls-Input/utils';
import { Enum } from 'Types/collection';
import { getArrayFromEnum } from 'Controls/source';

export interface IComboboxProps
    extends INameOptions,
        ILabelOptions,
        IComboboxItemsOptions,
        IRequiredOptions,
        IMultiSelectOptions,
        IVisibleItemsCountOptions,
        IPlaceholderOptions {}

const defaultItems: IComboboxItem[] = [
    {
        id: 1,
        title: rk('Первый'),
        additional: false,
    },
    {
        id: 2,
        title: rk('Второй'),
        additional: false,
    },
];

function setAdditionalProperty(data: IComboboxItem[], visibleItemsCount: number | null): void {
    data.forEach((item, index) => {
        item.additional = !!visibleItemsCount ? index + 1 > visibleItemsCount : false;
    });
}

/**
 * Редактор типа "Значение из списка", работающий со слайсом формы
 * @param props
 */
function ComboboxConnected(props: IComboboxProps & IControlProps) {
    const selectedValue = props.multiSelect
        ? props.variants?.selectedKeys
        : props.variants?.selectedKeys?.[0];
    const { value, onChange } = useConnectedValue(props.name, null);
    const selectedKey = value instanceof Enum ? value.getAsValue(true) : value;
    const contextReadonly = useReadonly(props);
    const [localValue, setLocalValue] = useState<TSelectedKey>(selectedValue);
    const items = useMemo(() => {
        const data =
            value instanceof Enum
                ? getArrayFromEnum(value, 'id', 'title')
                : props.variants?.items || defaultItems;
        setAdditionalProperty(data, props.visibleItemsCount);
        return new RecordSet({
            keyProperty: 'id',
            rawData: data,
        });
    }, [props.variants, props, value]);
    const placeholder = props.placeholder || rk('Выберите вариант');
    const commonProps = {
        placeholder,
        customEvents: ['onSelectedKeyChanged', 'onSelectedKeysChanged'],
        displayProperty: 'title',
        keyProperty: 'id',
        items,
        multiSelect: props.multiSelect,
        additionalProperty: 'additional',
        placeholderVisibility: 'empty',
        readOnly: contextReadonly,
    };

    const ref = useRef();
    const { resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
    );

    const onBlurHandler = useCallback(() => {
        validate();
    }, []);

    useEffect(() => {
        setLocalValue(selectedValue);
    }, [selectedValue]);

    const onValueChanged = useCallback(
        (changedValue: TSelectedKey) => {
            if (value instanceof Enum) {
                value.setByValue(changedValue, true);
            }
            resetValidation();
            onChange(value instanceof Enum ? value : changedValue);
            setLocalValue(changedValue);
        },
        [onChange]
    );

    const classes = `${props.className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    const sizeProps = getSizeProps(props);
    return (
        <InputLabel
            value={value}
            label={props.label}
            className={classes}
            fontSize={sizeProps.fontSize}
        >
            {props.multiSelect ? (
                <Selector
                    ref={ref}
                    onSelectedKeysChanged={onValueChanged}
                    {...commonProps}
                    {...clearProps(props)}
                    selectedKeys={value || localValue}
                    emptyText={placeholder}
                    validationStatus={validationStatus}
                    onBlur={onBlurHandler}
                    {...sizeProps}
                />
            ) : (
                <ComboboxInput
                    ref={ref}
                    onSelectedKeyChanged={onValueChanged}
                    {...commonProps}
                    selectedKey={selectedKey || localValue}
                    emptyText={placeholder}
                    validationStatus={validationStatus}
                    onBlur={onBlurHandler}
                    {...clearProps(props)}
                    {...sizeProps}
                />
            )}
        </InputLabel>
    );
}

ComboboxConnected.displayName = 'Controls-Input/ComboboxConnected';
export default ComboboxConnected;
