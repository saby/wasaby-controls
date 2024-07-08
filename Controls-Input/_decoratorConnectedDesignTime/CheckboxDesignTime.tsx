import { Checkbox as CheckboxDecorator, ICheckboxProps } from 'Controls-Input/decoratorConnected';
import { BaseDesignTimeDecorator } from './BaseDesignTimeDecorator';

/**
 * Декоратор "Флаг" для дизайн-тайма
 * @param props
 */
function Checkbox(props: ICheckboxProps) {
    return (
        <BaseDesignTimeDecorator {...props}>
            <CheckboxDecorator {...props} />
        </BaseDesignTimeDecorator>
    );
}

Checkbox.displayName = 'Controls-Input/decoratorConnectedDesignTime:Checkbox';
export { Checkbox };
