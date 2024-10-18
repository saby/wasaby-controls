import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { IControlProps } from 'Controls/interface';
import { INameOptions } from 'Controls-Input/interface';
import { Flags as FlagsType } from 'Types/collection';

export type IFlagsProps = INameOptions;

/**
 * Декоратор типа "Flags"
 * @param props
 */
function Flags(props: IFlagsProps & IControlProps) {
    const { value } = useConnectedValue(props.name) as { value: FlagsType<string> };

    const result: string[] = [];

    if (value && value['[Types/_collection/IFlags]']) {
        value.getDictionary(true)?.forEach?.((flagEntry) => {
            if (value.get(flagEntry) === true) {
                result.push(flagEntry);
            }
        });
    }
    if (result.length) {
        return (
            <span {...clearProps(props)} className={props.className}>
                {result.join(', ')}
            </span>
        );
    }
    return null;
}

Flags.displayName = 'Controls-Input/decoratorConnected:Flags';
export { Flags };
