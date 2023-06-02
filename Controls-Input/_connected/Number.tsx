import { Number as NumberInput } from 'Controls/input';
import { clearProps, useConnectedValue, WidgetProps } from './useConnectedValue';

/**
 * Редактор типа "Число", работающий со слайсом формы
 * @param props
 */
export function ConnectedNumber(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return <NumberInput value={value} valueChangedCallback={onChange} {...clearProps(props)} />;
}
