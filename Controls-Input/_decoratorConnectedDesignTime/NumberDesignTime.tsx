import { Number as NumberDecorator, INumberProps } from 'Controls-Input/decoratorConnected';
import { BaseDesignTimeDecorator } from './BaseDesignTimeDecorator';

/**
 * Декоратор числа для дизайн-тайма
 * @param props
 */
function Number(props: INumberProps) {
    return (
        <BaseDesignTimeDecorator {...props}>
            <NumberDecorator {...props} />
        </BaseDesignTimeDecorator>
    );
}

Number.displayName = 'Controls-Input/decoratorConnectedDesignTime:Number';
export { Number };
