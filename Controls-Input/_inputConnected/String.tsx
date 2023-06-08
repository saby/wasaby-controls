import { useConnectedValue, clearProps, WidgetProps } from '../useConnectedValue';
import { Text as TextInput } from 'Controls/input';
import { InputLabel } from './InputLabel';

// todo удалить
/**
 * Редактор типа "Строка", работающий со слайсом формы
 * @param props
 */
function String(props: WidgetProps) {
    const {value = props.defaultValue, onChange} = useConnectedValue(props.name);
    return <InputLabel value={value} label={props.label}>
        <TextInput value={value} valueChangedCallback={onChange} {...clearProps(props)} />
    </InputLabel>;
}

String.displayName = 'Controls-Input/inputConnected:String';
export { String };
