import { InputLabel } from '../_inputConnected/InputLabel';
import { useConnectedValue } from '../useConnectedValue';
import { IDateMaskOptions } from 'Controls/interface';
import { IControlProps } from 'Controls/interface';
import { Input as DateInput } from 'Controls/date';
import {
    INameOptions,
    IDateDefaultValueOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IPeriodLimitOptions,
} from 'Controls-Input/interface';

export interface IDateProps extends INameOptions, IDateDefaultValueOptions, IDateMaskOptions, INoJumpingLabelOptions,
    IPlaceholderOptions, IRequiredOptions, IPeriodLimitOptions {
}

/**
 * Редактор типа "Дата", работающий со слайсом формы
 * @param props
 */
function Date(props: IDateProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    const {label, className, placeholder, mask = 'DD.MM.YYYY'} = props;
    return (
        <InputLabel value={value} label={label} className={className}>
            <DateInput
                mask={mask}
                placeholder={placeholder}
                value={value}
                onValueChanged={(event, value) => onChange(value)}
                customEvents={['onValueChanged']}
            />
        </InputLabel>
    );
}

Date.displayName = 'Controls-Input/dateConnected:Date';
export { Date };
