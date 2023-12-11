import { useConnectedValue, clearProps } from './useConnectedValue';
import { Combobox as ComboboxInput, Selector } from 'Controls/dropdown';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { RecordSet } from 'Types/collection';
import {
    INameOptions,
    ILabelOptions,
    IRequiredOptions,
    IComboboxItem,
    IComboboxItemsOptions,
    IVisibleItemsCountOptions,
    IMultiSelectOptions,
    IPlaceholderOptions,
} from 'Controls-Input/interface';
import { IControlProps, TSelectedKey } from 'Controls/interface';
import * as rk from 'i18n!Controls-Input';
import { useValidation, getValidators } from 'Controls-Input/validators';

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
    const [localValue, setLocalValue] = useState<TSelectedKey>(selectedValue);
    const items = useMemo(() => {
        const data = props.variants?.items || defaultItems;
        setAdditionalProperty(data, props.visibleItemsCount);
        return new RecordSet({
            keyProperty: 'id',
            rawData: data,
        });
    }, [props.variants, props.visibleItemsCount]);
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
    };

    const { resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props)
    );

    const onBlurHandler = useCallback(() => {
        validate();
    }, []);

    useEffect(() => {
        setLocalValue(selectedValue);
    }, [selectedValue]);

    const onValueChanged = useCallback(
        (value: TSelectedKey) => {
            resetValidation();
            onChange(value);
            setLocalValue(value);
        },
        [onChange]
    );

    const classes = `${props.className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    return (
        <InputLabel value={value} label={props.label} className={classes}>
            {props.multiSelect ? (
                <Selector
                    onSelectedKeysChanged={onValueChanged}
                    {...commonProps}
                    {...clearProps(props)}
                    selectedKeys={value || localValue}
                    emptyText={placeholder}
                    validationStatus={validationStatus}
                    onBlur={onBlurHandler}
                    fontColorStyle={'readonly'}
                />
            ) : (
                <ComboboxInput
                    onSelectedKeyChanged={onValueChanged}
                    {...commonProps}
                    selectedKey={value || localValue}
                    emptyText={placeholder}
                    validationStatus={validationStatus}
                    onBlur={onBlurHandler}
                    {...clearProps(props)}
                />
            )}
        </InputLabel>
    );
}

ComboboxConnected.displayName = 'Controls-Input/ComboboxConnected';
export default ComboboxConnected;
