import { useConnectedValue, clearProps, WidgetProps } from './useConnectedValue';
import { Control } from 'Controls/CheckboxGroup';

/**
 * Редактор "Группа чекбоксов", работающий со слайсом формы
 * @param props
 */
function CheckboxGroup(props: WidgetProps) {
    const { value, onChange } = useConnectedValue(props.name);
    return (
        <Control
            selectedKeys={value}
            onSelectedKeysChanged={onChange}
            customEvents={['onSelectedKeysChanged']}
            {...clearProps(props)}
        />
    );
}

CheckboxGroup.displayName = 'Controls-Input/connected:CheckboxGroup';
export { CheckboxGroup };
