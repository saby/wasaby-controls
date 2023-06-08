import { useConnectedValue, clearProps } from './useConnectedValue';
import { Combobox as ComboboxInput } from 'Controls/dropdown';
import { InputLabel } from './_inputConnected/InputLabel';
import { useMemo } from 'react';
import { Memory } from 'Types/source';
import {
    INameOptions,
    ILabelOptions,
    IRequiredOptions,
    IItemsOptions,
    IVisibleItemsCountOptions,
} from 'Controls-Input/interface';
import { IControlProps } from 'Controls/interface';
import * as rk from 'i18n!Controls';

interface IItem {
    id: number;
    title: string;
    additional: boolean;
}

export interface IComboboxProps
    extends INameOptions,
        ILabelOptions,
        IItemsOptions,
        IRequiredOptions,
        IVisibleItemsCountOptions {}

const defaultItems: IItem[] = [
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

function setAdditionalProperty(data: IItem[], visibleItemsCount: number | null): void {
    data.forEach((item, index) => {
        item.additional = !!visibleItemsCount ? index + 1 > visibleItemsCount : false;
    });
}

/**
 * Редактор типа "Значение из списка", работающий со слайсом формы
 * @param props
 */
function ComboboxConnected(props: IComboboxProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name);
    const source = useMemo(() => {
        const data = props.items?.getRawData() || defaultItems;
        setAdditionalProperty(data, props.visibleItemsCount);
        return new Memory({
            keyProperty: 'id',
            data,
        });
    }, [props.items, props.visibleItemsCount]);
    return (
        <InputLabel value={value} label={props.label} className={props.className}>
            <ComboboxInput
                placeholder={props.field?.title || rk('Выберите вариант')}
                selectedKey={value}
                onSelectedKeyChanged={onChange}
                customEvents={['onSelectedKeyChanged']}
                displayProperty="title"
                keyProperty="id"
                {...clearProps(props)}
                source={source}
                additionalProperty="additional"
            />
        </InputLabel>
    );
}

ComboboxConnected.displayName = 'Controls-Input/ComboboxConnected';
export default ComboboxConnected;
