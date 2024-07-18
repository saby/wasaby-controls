import { Date as DateDecorator } from 'Controls/baseDecorator';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { IControlProps, IDateMaskOptions } from 'Controls/interface';
import { INameOptions } from 'Controls-Input/interface';

export interface IDateProps extends INameOptions, IDateMaskOptions {
}

/**
 * Редактор типа декоратор даты
 * @param props
 */
function Date(props: IDateProps & IControlProps) {
    const {value} = useConnectedValue(props.name);
    const {mask = 'DD.MM.YY'} = props;

    return (
        <DateDecorator
            {...clearProps(props)}
            className={props.className}
            value={value}
            format={mask}
        />
    );
}

Date.displayName = 'Controls-Input/decoratorConnected:Date';
export { Date };
