import { useConnectedValue, clearProps, WidgetProps } from './useConnectedValue';
import { Text as TextInput } from 'Controls/input';

/**
 * Редактор типа "Строка", работающий со слайсом формы
 * @param props
 */
export function ConnectedString(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return <TextInput value={value} valueChangedCallback={onChange} {...clearProps(props)} />;
}
