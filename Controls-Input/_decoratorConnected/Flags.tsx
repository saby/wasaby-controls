import { clearProps, useConnectedValue } from 'Controls-DataEnv/context';
import { IComponentProps } from 'Controls/interface';
import { ILabelOptions, INameOptions } from 'Controls-Input/interface';
import { Flags as FlagsType } from 'Types/collection';
import { DecoratorLabel } from './DecoratorLabel';
import { DecoratorPlaceholder } from './DecoratorPlaceholder';

/**
 * Интерфейс для декоратора "Flags"
 * @public
 */
export type IFlagsProps = INameOptions & ILabelOptions;

/**
 * Декоратор типа "Flags"
 * @param {IFlagsProps} props
 * @public
 */
function Flags(props: IFlagsProps & IComponentProps) {
    const { value } = useConnectedValue(props.name) as { value: FlagsType<string> };

    const result: string[] = [];

    if (value && value['[Types/_collection/IFlags]']) {
        value.getDictionary(true)?.forEach?.((flagEntry) => {
            if (value.get(flagEntry) === true) {
                result.push(flagEntry);
            }
        });
    }

    return (
        <DecoratorPlaceholder name={props.name}>
            <DecoratorLabel value={value} className={props.className} label={props.label}>
                {result.length ? <span {...clearProps(props)}>{result.join(', ')}</span> : null}
            </DecoratorLabel>
        </DecoratorPlaceholder>
    );
}

Flags.displayName = 'Controls-Input/decoratorConnected:Flags';
export { Flags };
