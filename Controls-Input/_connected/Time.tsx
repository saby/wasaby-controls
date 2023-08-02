import { BaseInput as TimeInput } from 'Controls/date';
import { clearProps, useConnectedValue, WidgetProps } from './useConnectedValue';

/**
 * Редактор типа "Время", работающий со слайсом формы
 * @param props
 */
function Time(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return (
        <TimeInput
            value={value}
            onValueChanged={(event, value) => onChange(value)}
            {...clearProps(props)}
        />
    );
}

Time.displayName = 'Controls-Input/connected:Time';
export { Time };
