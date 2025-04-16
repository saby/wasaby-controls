import { Date as DateDecorator } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from 'Controls-DataEnv/context';
import { IComponentProps, IDateMaskOptions } from 'Controls/interface';
import { ILabelOptions, INameOptions } from 'Controls-Input/interface';
import { DecoratorLabel } from './DecoratorLabel';
import { DecoratorPlaceholder } from './DecoratorPlaceholder';

/**
 * Интерфейс для декоратора "Дата"
 * @public
 */
export interface IDateProps extends INameOptions, IDateMaskOptions, ILabelOptions {}

/**
 * Редактор типа декоратор даты
 * @param {IDateProps} props
 * @public
 */
function Date(props: IDateProps & IComponentProps) {
    const { value } = useConnectedValue(props.name);
    const { mask = 'DD.MM.YY' } = props;

    return (
        <DecoratorPlaceholder name={props.name}>
            <DecoratorLabel value={value} className={props.className} label={props.label}>
                <DateDecorator {...clearProps(props)} value={value} format={mask} />
            </DecoratorLabel>
        </DecoratorPlaceholder>
    );
}

Date.displayName = 'Controls-Input/decoratorConnected:Date';
export { Date };
