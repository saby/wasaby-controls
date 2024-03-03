import { clearProps, useConnectedValue } from '../useConnectedValue';
import { ISelectorOptions, Selector } from 'Controls/dropdown';
import { InputLabel } from 'Controls-Input/inputConnected';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RecordSet } from 'Types/collection';
import {
    IItem,
    ILabelOptions,
    IMultiSelectOptions,
    INameOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IVisibleItemsCountOptions,
} from 'Controls-Input/interface';
import { IControlProps, IItemsOptions, TSelectedKey } from 'Controls/interface';
import * as rk from 'i18n!Controls-Input';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { getSizeProps } from 'Controls-Input/utils';

export interface ISelectorProps
    extends INameOptions,
        ISelectorOptions,
        ILabelOptions,
        IItemsOptions<IItem>,
        IRequiredOptions,
        IMultiSelectOptions,
        IVisibleItemsCountOptions,
        IPlaceholderOptions {}

const defaultItems: IItem[] = [
    {
        id: 1,
        title: rk('Первый'),
        node: null,
    },
    {
        id: 2,
        title: rk('Второй'),
        node: null,
    },
    {
        id: 3,
        title: rk('Третий'),
        node: null,
    },
];

/**
 * Редактор типа "Значение из списка", работающий со слайсом формы
 * @param props
 */
function SelectorConnected(props: ISelectorProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name, null);
    const [localValue, setLocalValue] = useState<TSelectedKey>(props.variants?.selectedKeys);

    const items = useMemo(
        () =>
            props.items ||
            new RecordSet({
                keyProperty: 'id',
                rawData: defaultItems,
            }),
        [props.items]
    );

    const placeholder = props.placeholder || rk('Выберите вариант');

    const commonProps = {
        placeholder,
        customEvents: ['onSelectedKeyChanged', 'onSelectedKeysChanged'],
        displayProperty: 'title',
        keyProperty: 'id',
        items,
        additionalProperty: 'additional',
        placeholderVisibility: 'empty',
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
        setLocalValue(props.variants?.selectedKeys);
    }, [props.variants?.selectedKeys]);

    const onValueChanged = useCallback(
        (value: TSelectedKey[]) => {
            resetValidation();
            onChange(value);
            setLocalValue(value);
        },
        [onChange]
    );

    const classes = `${props.className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
    const sizeProps = getSizeProps(props);
    return (
        <InputLabel
            value={value as string}
            label={props.label}
            className={classes}
            fontSize={sizeProps.fontSize}
        >
            <Selector
                ref={ref}
                {...commonProps}
                onSelectedKeysChanged={onValueChanged}
                selectedKeys={value || localValue}
                emptyText={placeholder}
                validationStatus={validationStatus}
                onBlur={onBlurHandler}
                {...clearProps(props)}
                {...sizeProps}
            />
        </InputLabel>
    );
}

SelectorConnected.displayName = 'Controls-Input/dropdownConnected:Selector';
export default SelectorConnected;
