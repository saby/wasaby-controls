import { Number as NumberInput } from 'Controls/input';
import { clearProps, useConnectedValue, WidgetProps } from './useConnectedValue';

/**
 * Редактор типа "Число", работающий со слайсом формы
 * @param props
 */
function Number(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return <NumberInput value={value} valueChangedCallback={onChange} {...clearProps(props)} />;
}

Number.displayName = 'Controls-Input/connected:Number';
export { Number };
