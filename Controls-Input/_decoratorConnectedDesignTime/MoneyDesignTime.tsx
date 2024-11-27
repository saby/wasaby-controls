import { Money as MoneyDecorator, IMoneyProps } from 'Controls-Input/decoratorConnected';
import { BaseDesignTimeDecorator } from './BaseDesignTimeDecorator';

/**
 * Декоратор денег для дизайн-тайма
 * @param props
 */
function Money(props: IMoneyProps) {
    return (
        <BaseDesignTimeDecorator {...props}>
            <MoneyDecorator {...props} />
        </BaseDesignTimeDecorator>
    );
}

Money.displayName = 'Controls-Input/decoratorConnectedDesignTime:Money';
export { Money };
