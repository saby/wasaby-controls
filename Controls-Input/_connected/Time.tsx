import { BaseInput as TimeInput } from 'Controls/date';
import { clearProps, useConnectedValue, WidgetProps } from './useConnectedValue';

/**
 * Редактор типа "Время", работающий со слайсом формы
 * @param props
 */
export function ConnectedTime(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return <TimeInput value={value} onValueChanged={onChange} {...clearProps(props)} />;
}
