import { useConnectedValue, clearProps } from './useConnectedValue';
import { Control } from 'Controls/RadioGroup';
import { RecordSet } from 'Types/collection';
import { useCallback, useMemo } from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TSelectedKey } from 'Controls/interface';
import { InputLabel } from 'Controls-Input/inputConnected';
import {
    INameOptions,
    ILabelOptions,
    IRequiredOptions,
    IItemsOptions,
    IDirectionOptions,
    IWrapOptions,
} from 'Controls-Input/interface';
import { IControlProps } from 'Controls/interface';
import * as rk from 'i18n!Controls-Input';

export interface IRadioGroupProps
    extends INameOptions,
        ILabelOptions,
        IRequiredOptions,
        IItemsOptions,
        IDirectionOptions,
        IWrapOptions {
}

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
    const {value, onChange} = useConnectedValue(props.name);
    const defaultValue = props.variants?.selectedKeys?.[0] || 1;
    const {label, className, wrapText = false} = props;

    const onSelectedKeyChanged = useCallback(
        (event: SyntheticEvent, selectedKey: TSelectedKey) => {
            onChange(selectedKey);
        },
        [onChange]
    );
    const variantsItems = props.variants?.items;
    const items = useMemo(() => {
        return variantsItems ? new RecordSet({
            keyProperty: 'id',
            rawData: variantsItems,
        }) : defaultItems;
    }, [variantsItems, defaultItems]);

    return (
        <InputLabel value={value} label={label} className={className}>
            <Control
                selectedKey={value || defaultValue}
                onSelectedKeyChanged={onSelectedKeyChanged}
                parentProperty="parent"
                nodeProperty="node"
                keyProperty="id"
                {...clearProps(props)}
                items={items}
                multiline={wrapText}
            />
        </InputLabel>
    );
}

RadioGroupConnected.displayName = 'Controls-Input/RadioGroupConnected';
export default RadioGroupConnected;
