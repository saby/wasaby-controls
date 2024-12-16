import { Checkbox as CheckboxControl, ICheckboxMarkerOptions } from 'Controls/checkbox';
import { useConnectedValue, clearProps } from 'Controls-DataEnv/context';
import { IControlProps } from 'Controls/interface';
import { INameOptions } from 'Controls-Input/interface';

export type ICheckboxProps = INameOptions & ICheckboxMarkerOptions;

/**
 * Декоратор типа "Флаг"
 * @param props
 */
function Checkbox(props: ICheckboxProps & IControlProps) {
    const { value } = useConnectedValue(props.name);

    return <CheckboxControl {...clearProps(props)} className={props.className} value={value} />;
}

Checkbox.displayName = 'Controls-Input/decoratorConnected:Checkbox';
export { Checkbox };
