import {
    MultilineText as MultilineTextDecorator,
    IMultilineTextProps,
} from 'Controls-Input/decoratorConnected';
import { BaseDesignTimeDecorator } from './BaseDesignTimeDecorator';

/**
 * Декоратор строки для дизайн-тайма
 * @param props
 */
function MultilineText(props: IMultilineTextProps) {
    return (
        <BaseDesignTimeDecorator {...props}>
            <MultilineTextDecorator {...props} />
        </BaseDesignTimeDecorator>
    );
}

MultilineText.displayName = 'Controls-Input/decoratorConnectedDesignTime:MultilineText';
export { MultilineText };
