import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { IComponentProps } from 'Controls/interface';
import { ILabelOptions, INameOptions } from 'Controls-Input/interface';
import { Enum as EnumType } from 'Types/collection';
import { DecoratorLabel } from './DecoratorLabel';

/**
 * Интерфейс для декоратора "Enum"
 * @public
 */
export type IEnumProps = INameOptions & ILabelOptions;

/**
 * Декоратор типа "Enum"
 * @param {IEnumProps} props
 * @public
 */
function Enum(props: IEnumProps & IComponentProps) {
    const { value } = useConnectedValue(props.name) as { value: EnumType<string> };

    if (value && value['[Types/_collection/IEnum]']) {
        return (
            <DecoratorLabel value={value} className={props.className} label={props.label}>
                <span {...clearProps(props)}>{value.getAsValue(true)}</span>
            </DecoratorLabel>
        );
    }
    return null;
}

Enum.displayName = 'Controls-Input/decoratorConnected:Enum';
export { Enum };
