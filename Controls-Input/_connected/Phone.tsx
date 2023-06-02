import { Phone as PhoneInput } from 'Controls/input';
import { clearProps, useConnectedValue, WidgetProps } from './useConnectedValue';

/**
 * Редактор типа "Телефон", работающий со слайсом формы
 * @param props
 */
export function ConnectedPhone(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return <PhoneInput value={value} valueChangedCallback={onChange} {...clearProps(props)} />;
}
