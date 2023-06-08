import { useConnectedValue, clearProps, WidgetProps } from './useConnectedValue';
import { Control } from 'Controls/RadioGroup';

/**
 * Редактор типа "Группа радиокнопок", работающий со слайсом формы
 * @param props
 */
function RadioGroup(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return (
        <Control
            selectedKey={value}
            onSelectedKeyChanged={(e, value) => onChange(value)}
            {...clearProps(props)}
        />
    );
}

RadioGroup.displayName = 'Controls-Input/connected:RadioGroup';
export { RadioGroup };
