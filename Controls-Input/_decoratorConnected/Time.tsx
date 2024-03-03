import { Date as TimeDecorator } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { IControlProps } from 'Controls/interface';
import { INameOptions, ITimeMaskOptions } from 'Controls-Input/interface';

export interface ITimeProps extends INameOptions, ITimeMaskOptions {
}

/**
 * Редактор типа декоратор времени
 * @param props
 */
function Time(props: ITimeProps & IControlProps) {
    const {value} = useConnectedValue(props.name);
    const {mask = 'HH:mm'} = props;

    return (
        <TimeDecorator
            {...clearProps(props)}
            className={props.className}
            value={value}
            format={mask}
        />
    );
}

Time.displayName = 'Controls-Input/decoratorConnected:Time';
export { Time };
