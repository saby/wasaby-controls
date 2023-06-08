import { useConnectedValue, clearProps } from './useConnectedValue';
import { Control } from 'Controls/RadioGroup';
import { RecordSet } from 'Types/collection';
import { useCallback } from 'react';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TSelectedKey } from 'Controls/interface';
import { InputLabel } from './_inputConnected/InputLabel';
import {
    INameOptions,
    ILabelOptions,
    IRequiredOptions,
    IItemsOptions,
    IDirectionOptions,
    IWrapOptions,
} from 'Controls-Input/interface';
import { IControlProps } from 'Controls/interface';
import * as rk from 'i18n!Controls';

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
    const defaultValue = 1;
    const { value, onChange } = useConnectedValue(props.name);

    const onSelectedkeychanged = useCallback(
        (event: SyntheticEvent, selectedKey: TSelectedKey) => {
            onChange(selectedKey);
        },
        [onChange]
    );

    return (
        <InputLabel value={value} label={props.label} className={props.className}>
            <Control
                selectedKey={value || defaultValue}
                onSelectedkeychanged={onSelectedkeychanged}
                customEvents={['onSelectedkeychanged']}
                parentProperty="parent"
                nodeProperty="node"
                keyProperty="id"
                {...clearProps(props)}
                items={props.items || defaultItems}
                multiline={props.wrapText}
            />
        </InputLabel>
    );
}

RadioGroupConnected.displayName = 'Controls-Input/RadioGroupConnected';
export default RadioGroupConnected;
