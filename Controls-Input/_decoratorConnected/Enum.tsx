import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { IControlProps } from 'Controls/interface';
import { INameOptions } from 'Controls-Input/interface';
import { Enum as EnumType } from 'Types/collection';

export type IEnumProps = INameOptions;

/**
 * Декоратор типа "Enum"
 * @param props
 */
function Enum(props: IEnumProps & IControlProps) {
    const { value } = useConnectedValue(props.name) as { value: EnumType<string> };

    if (value && value['[Types/_collection/IEnum]']) {
        return (
            <span {...clearProps(props)} className={props.className}>
                {value.getAsValue(true)}
            </span>
        );
    }
    return null;
}

Enum.displayName = 'Controls-Input/decoratorConnected:Enum';
export { Enum };
