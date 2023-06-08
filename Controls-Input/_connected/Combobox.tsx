import { useConnectedValue, clearProps, WidgetProps } from './useConnectedValue';
import { Combobox as ComboboxInput } from 'Controls/dropdown';

/**
 * Редактор типа "Значение из списка", работающий со слайсом формы
 * @param props
 */
function Combobox(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return (
        <ComboboxInput
            selectedKey={value}
            onSelectedKeyChanged={onChange}
            customEvents={['onSelectedKeyChanged']}
            {...clearProps(props)}
        />
    );
}

Combobox.displayName = 'Controls-Input/connected:Combobox';
export { Combobox };
