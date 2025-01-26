import { Date as TimeDecorator } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from 'Controls-DataEnv/context';
import { IComponentProps } from 'Controls/interface';
import { INameOptions, ITimeMaskOptions, ILabelOptions } from 'Controls-Input/interface';
import { DecoratorLabel } from './DecoratorLabel';

/**
 * Интерфейс для декоратора "Время"
 * @public
 */
export interface ITimeProps extends INameOptions, ITimeMaskOptions, ILabelOptions {}

/**
 * Редактор типа декоратор времени
 * @param {ITimeProps} props
 * @public
 */
function Time(props: ITimeProps & IComponentProps) {
    const { value } = useConnectedValue(props.name);
    const { mask = 'HH:mm' } = props;

    return (
        <DecoratorLabel value={value} className={props.className} label={props.label}>
            <TimeDecorator {...clearProps(props)} value={value} format={mask} />
        </DecoratorLabel>
    );
}

Time.displayName = 'Controls-Input/decoratorConnected:Time';
export { Time };
