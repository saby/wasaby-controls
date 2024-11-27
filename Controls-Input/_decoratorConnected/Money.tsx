import { Money as MoneyDecorator } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from 'Controls-DataEnv/context';
import { IControlProps } from 'Controls/interface';
import { INameOptions } from 'Controls-Input/interface';

export interface IMoneyProps extends INameOptions {}

/**
 * Редактор типа декоратор деньг
 * @param props
 */
function Money(props: IMoneyProps & IControlProps) {
    const { value } = useConnectedValue(props.name);

    return <MoneyDecorator {...clearProps(props)} className={props.className} value={value} />;
}

Money.displayName = 'Controls-Input/decoratorConnected:Money';
export { Money };
