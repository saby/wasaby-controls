import { useConnectedValue, clearProps } from './useConnectedValue';
import { Combobox as ComboboxInput, Selector } from 'Controls/dropdown';
import { InputLabel } from './_inputConnected/InputLabel';
import { useMemo } from 'react';
import { Memory } from 'Types/source';
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
import { IControlProps } from 'Controls/interface';
import * as rk from 'i18n!Controls';
export interface IComboboxProps
    extends INameOptions,
        ILabelOptions,
        IComboboxItemsOptions,
        IRequiredOptions,
        IMultiSelectOptions,
        IVisibleItemsCountOptions,
        IPlaceholderOptions {
}

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
    const {value, onChange} = useConnectedValue(props.name, props.multiSelect ? [] : null);
    const source = useMemo(() => {
        const data = props.variants?.items || defaultItems;
        setAdditionalProperty(data, props.visibleItemsCount);
        return new Memory({
            keyProperty: 'id',
            data,
        });
    }, [props.variants, props.visibleItemsCount]);
    const placeholder = props.placeholder || rk('Выберите вариант');
    const commonProps = {
        placeholder,
        customEvents: ['onSelectedKeyChanged', 'onSelectedKeysChanged'],
        displayProperty: 'title',
        keyProperty: 'id',
        source,
        multiSelect: props.multiSelect,
        additionalProperty: 'additional',
        placeholderVisibility: 'empty'
    };
    return (
        <InputLabel value={value} label={props.label} className={props.className}>
            {
                (props.multiSelect) ? (
                    <Selector
                        onSelectedKeysChanged={onChange}
                        {...commonProps}
                        {...clearProps(props)}
                        selectedKeys={value}
                        emptyText={placeholder}
                        fontColorStyle={'readonly'}

                    />
                ) : (
                    <ComboboxInput
                        onSelectedKeyChanged={onChange}
                        {...commonProps}
                        selectedKey={value}
                        {...clearProps(props)}
                    />
                )
            }
        </InputLabel>
    );
}

ComboboxConnected.displayName = 'Controls-Input/ComboboxConnected';
export default ComboboxConnected;
