import { clearProps, useConnectedValue } from './useConnectedValue';
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
    const contextReadonly = useReadonly(props);
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
                    ref={ref}
                    onSelectedKeysChanged={onValueChanged}
                    {...commonProps}
                    {...clearProps(props)}
                    selectedKeys={value || localValue}
                    emptyText={placeholder}
                    validationStatus={validationStatus}
                    onBlur={onBlurHandler}
                />
            ) : (
                <ComboboxInput
                    ref={ref}
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
