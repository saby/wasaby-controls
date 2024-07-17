import { Enum as EnumDecorator, IEnumProps } from 'Controls-Input/decoratorConnected';
import { BaseDesignTimeDecorator } from './BaseDesignTimeDecorator';

/**
 * Декоратор "Enum" для дизайн-тайма
 * @param props
 */
function EnumDesignTime(props: IEnumProps) {
    return (
        <BaseDesignTimeDecorator {...props}>
            <EnumDecorator {...props} />
        </BaseDesignTimeDecorator>
    );
}

EnumDesignTime.displayName = 'Controls-Input/decoratorConnectedDesignTime:Enum';
export { EnumDesignTime };
