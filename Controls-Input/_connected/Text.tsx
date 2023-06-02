import { useConnectedValue, clearProps, WidgetProps } from './useConnectedValue';
import { Area } from 'Controls/input';

/**
 * Редактор типа "Многострочный текст", работающий со слайсом формы
 * @param props
 */
export function ConnectedText(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return <Area value={value} onValueChanged={onChange} {...clearProps(props)} />;
}
