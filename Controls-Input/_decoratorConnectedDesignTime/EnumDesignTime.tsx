import { Enum as EnumDecorator, IEnumProps } from 'Controls-Input/decoratorConnected';
import { BaseDesignTimeDecorator } from './BaseDesignTimeDecorator';

/**
 * Декоратор "Enum" для дизайн-тайма
 * @param props
 */
function Enum(props: IEnumProps) {
    return (
        <BaseDesignTimeDecorator {...props}>
            <EnumDecorator {...props} />
        </BaseDesignTimeDecorator>
    );
}

Enum.displayName = 'Controls-Input/decoratorConnectedDesignTime:Enum';
export { Enum };
