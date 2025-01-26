import { Checkbox as CheckboxControl, ICheckboxMarkerOptions } from 'Controls/checkbox';
import { useConnectedValue, clearProps } from 'Controls-DataEnv/context';
import { IComponentProps } from 'Controls/interface';
import { INameOptions, ILabelOptions } from 'Controls-Input/interface';
import { DecoratorLabel } from './DecoratorLabel';

/**
 * Интерфейс для декоратора "Флаг"
 * @public
 */
export type ICheckboxProps = INameOptions & ICheckboxMarkerOptions & ILabelOptions;

/**
 * Декоратор типа "Флаг"
 * @param {ICheckboxProps} props
 * @public
 */
function Checkbox(props: ICheckboxProps & IComponentProps) {
    const { value } = useConnectedValue(props.name);

    return (
        <DecoratorLabel value={value} className={props.className} label={props.label}>
            <CheckboxControl {...clearProps(props)} value={value} />
        </DecoratorLabel>
    );
}

Checkbox.displayName = 'Controls-Input/decoratorConnected:Checkbox';
export { Checkbox };
