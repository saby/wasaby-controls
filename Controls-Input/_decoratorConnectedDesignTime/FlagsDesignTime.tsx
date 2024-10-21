import { Flags as FlagsDecorator, IFlagsProps } from 'Controls-Input/decoratorConnected';
import { BaseDesignTimeDecorator } from './BaseDesignTimeDecorator';

/**
 * Декоратор "Flags" для дизайн-тайма
 * @param props
 */
function Flags(props: IFlagsProps) {
    return (
        <BaseDesignTimeDecorator {...props}>
            <FlagsDecorator {...props} />
        </BaseDesignTimeDecorator>
    );
}

Flags.displayName = 'Controls-Input/decoratorConnectedDesignTime:Flags';
export { Flags };
