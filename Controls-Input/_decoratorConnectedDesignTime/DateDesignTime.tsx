import { Date as DateDecorator, IDateProps } from 'Controls-Input/decoratorConnected';
import { BaseDesignTimeDecorator } from './BaseDesignTimeDecorator';

/**
 * Декоратор даты для дизайн-тайма
 * @param props
 */
function Date(props: IDateProps) {
    return (
        <BaseDesignTimeDecorator {...props}>
            <DateDecorator {...props} />
        </BaseDesignTimeDecorator>
    );
}

Date.displayName = 'Controls-Input/decoratorConnectedDesignTime:Date';
export { Date };
