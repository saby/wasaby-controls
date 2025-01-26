import { Money as MoneyDecorator } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from 'Controls-DataEnv/context';
import { IComponentProps } from 'Controls/interface';
import { ILabelOptions, INameOptions } from 'Controls-Input/interface';
import { DecoratorLabel } from './DecoratorLabel';

/**
 * Интерфейс для декоратора "Денег"
 * @public
 */
export interface IMoneyProps extends INameOptions, ILabelOptions {}

/**
 * Редактор типа декоратор деньг
 * @param {IMoneyProps} props
 * @public
 */
function Money(props: IMoneyProps & IComponentProps) {
    const { value } = useConnectedValue(props.name);

    return (
        <DecoratorLabel value={value} className={props.className} label={props.label}>
            <MoneyDecorator {...clearProps(props)} value={value} />
        </DecoratorLabel>
    );
}

Money.displayName = 'Controls-Input/decoratorConnected:Money';
export { Money };
