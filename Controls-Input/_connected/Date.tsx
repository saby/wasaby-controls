import { Input as DateInput } from 'Controls/date';
import { clearProps, useConnectedValue, WidgetProps } from './useConnectedValue';

/**
 * Редактор типа "Дата", работающий со слайсом формы
 * @param props
 */
export function ConnectedDate(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return (
        <DateInput
            value={value}
            onValueChanged={(event, value) => onChange(value)}
            {...clearProps(props)}
        />
    );
}
