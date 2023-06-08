import { useConnectedValue, clearProps, WidgetProps } from './useConnectedValue';
import { Area } from 'Controls/input';

/**
 * Редактор типа "Многострочный текст", работающий со слайсом формы
 * @param props
 */
function Text(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return (
        <Area
            value={value}
            valueChangedCallback={(event, value) => onChange(value)}
            {...clearProps(props)}
        />
    );
}

Text.displayName = 'Controls-Input/connected:Text';
export { Text };
