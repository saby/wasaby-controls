import { Number as NumberDecorator } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from 'Controls-DataEnv/context';
import { IControlProps } from 'Controls/interface';
import { INameOptions, IPrecisionOptions } from 'Controls-Input/interface';

export interface INumberProps extends INameOptions, IPrecisionOptions {}

/**
 * Редактор типа декоратор числа
 * @param props
 */
function Number(props: INumberProps & IControlProps) {
    const { value } = useConnectedValue(props.name);

    return (
        <NumberDecorator
            {...clearProps(props)}
            className={props.className}
            value={value}
            precision={props.precision}
        />
    );
}

Number.displayName = 'Controls-Input/decoratorConnected:Number';
export { Number };
