import { Number as NumberDecorator } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from 'Controls-DataEnv/context';
import { IComponentProps } from 'Controls/interface';
import { ILabelOptions, INameOptions, IPrecisionOptions } from 'Controls-Input/interface';
import { DecoratorLabel } from './DecoratorLabel';

/**
 * Интерфейс для декоратора "Числа"
 * @public
 */
export interface INumberProps extends INameOptions, IPrecisionOptions, ILabelOptions {}

/**
 * Редактор типа декоратор числа
 * @param {INumberProps} props
 * @public
 */
function Number(props: INumberProps & IComponentProps) {
    const { value } = useConnectedValue(props.name);

    return (
        <DecoratorLabel value={value} className={props.className} label={props.label}>
            <NumberDecorator {...clearProps(props)} value={value} precision={props.precision} />
        </DecoratorLabel>
    );
}

Number.displayName = 'Controls-Input/decoratorConnected:Number';
export { Number };
