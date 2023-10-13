import { Time as TimeDecorator, ITimeProps } from 'Controls-Input/decoratorConnected';
import { BaseDesignTimeDecorator } from './BaseDesignTimeDecorator';
/**
 * Декоратор времени для дизайн-тайма
 * @param props
 */
function Time(props: ITimeProps) {
    return (
        <BaseDesignTimeDecorator {...props}>
            <TimeDecorator {...props} />
        </BaseDesignTimeDecorator>
    );
}

Time.displayName = 'Controls-Input/decoratorConnectedDesignTime:Time';
export { Time };
