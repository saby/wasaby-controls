import { MultilineText as MultilineTextDecorator } from 'Controls/extendedDecorator';
import { useConnectedValue, clearProps } from 'Controls-DataEnv/context';
import { IComponentProps } from 'Controls/interface';
import { ILabelOptions, INameOptions } from 'Controls-Input/interface';
import { DecoratorLabel } from './DecoratorLabel';
import { DecoratorPlaceholder } from './DecoratorPlaceholder';

/**
 * Интерфейс для декоратора "Строки"
 * @public
 */
export interface IMultilineTextProps extends INameOptions, ILabelOptions {}

/**
 * Редактор типа декоратор строки
 * @param {IMultilineTextProps} props
 * @public
 */
function MultilineText(props: IMultilineTextProps & IComponentProps) {
    const { value } = useConnectedValue(props.name);

    return (
        <DecoratorPlaceholder name={props.name}>
            <DecoratorLabel value={value} className={props.className} label={props.label}>
                <MultilineTextDecorator {...clearProps(props)} value={value} />
            </DecoratorLabel>
        </DecoratorPlaceholder>
    );
}

MultilineText.displayName = 'Controls-Input/decoratorConnected:MultilineText';
export { MultilineText };
