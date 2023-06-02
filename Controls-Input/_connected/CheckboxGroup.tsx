import { useConnectedValue, clearProps, WidgetProps } from './useConnectedValue';
import { Control as CheckboxGroup } from 'Controls/CheckboxGroup';

/**
 * Редактор "Группа чекбоксов", работающий со слайсом формы
 * @param props
 */
export function ConnectedCheckboxGroup(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return (
        <CheckboxGroup
            selectedKeys={value}
            onSelectedKeysChanged={onChange}
            {...clearProps(props)}
        />
    );
}
