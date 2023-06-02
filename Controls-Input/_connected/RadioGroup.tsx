import { useConnectedValue, clearProps, WidgetProps } from './useConnectedValue';
import { Control as RadioGroup } from 'Controls/RadioGroup';

/**
 * Редактор типа "Группа радиокнопок", работающий со слайсом формы
 * @param props
 */
export function ConnectedRadioGroup(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return (
        <RadioGroup selectedKey={value} onSelectedKeyChanged={onChange} {...clearProps(props)} />
    );
}
