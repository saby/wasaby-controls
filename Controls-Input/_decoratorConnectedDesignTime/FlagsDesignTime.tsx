import { Flags as FlagsDecorator, IFlagsProps } from 'Controls-Input/decoratorConnected';
import { BaseDesignTimeDecorator } from './BaseDesignTimeDecorator';

/**
 * Декоратор "Flags" для дизайн-тайма
 * @param props
 */
function FlagsDesignTime(props: IFlagsProps) {
    return (
        <BaseDesignTimeDecorator {...props}>
            <FlagsDecorator {...props} />
        </BaseDesignTimeDecorator>
    );
}

FlagsDesignTime.displayName = 'Controls-Input/decoratorConnectedDesignTime:Enum';
export { FlagsDesignTime };
