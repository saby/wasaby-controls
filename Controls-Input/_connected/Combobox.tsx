import { useConnectedValue, clearProps, WidgetProps } from './useConnectedValue';
import { Combobox } from 'Controls/dropdown';

/**
 * Редактор типа "Значение из списка", работающий со слайсом формы
 * @param props
 */
export function ConnectedCombobox(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return <Combobox selectedKey={value} onSelectedKeyChanged={onChange} {...clearProps(props)} />;
}
