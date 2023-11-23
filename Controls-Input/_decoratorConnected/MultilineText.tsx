import { MultilineText as MultilineTextDecorator } from 'Controls/extendedDecorator';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { IControlProps } from 'Controls/interface';
import { INameOptions } from 'Controls-Input/interface';

export interface IMultilineTextProps extends INameOptions {
}

/**
 * Редактор типа декоратор строки
 * @param props
 */
function MultilineText(props: IMultilineTextProps & IControlProps) {
    const {value} = useConnectedValue(props.name);

    return (
        <MultilineTextDecorator
            {...clearProps(props)}
            className={props.className}
            value={value}
        />
    );
}

MultilineText.displayName = 'Controls-Input/decoratorConnected:MultilineText';
export { MultilineText };
