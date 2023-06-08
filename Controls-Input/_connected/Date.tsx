import { Input as DateInput } from 'Controls/date';
import { clearProps, useConnectedValue, WidgetProps } from './useConnectedValue';

/**
 * Редактор типа "Дата", работающий со слайсом формы
 * @param props
 */
function Date(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return (
        <DateInput
            value={value}
            onValueChanged={(event, value) => onChange(value)}
            {...clearProps(props)}
        />
    );
}

Date.displayName = 'Controls-Input/connected:Date';
export { Date };
