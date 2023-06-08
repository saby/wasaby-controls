import { IControlProps } from 'Controls/interface';
import { BaseInput as TimeInput } from 'Controls/date';
import { useConnectedValue } from '../useConnectedValue';
import { InputLabel } from '../_inputConnected/InputLabel';
import {
    INameOptions,
    IDateDefaultValueOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IPeriodLimitOptions,
    ITimeMaskOptions
} from 'Controls-Input/interface';

export interface ITimeProps extends INameOptions, IDateDefaultValueOptions, ITimeMaskOptions, INoJumpingLabelOptions,
    IPlaceholderOptions, IRequiredOptions, IPeriodLimitOptions {
}

/**
 * Редактор типа "Время", работающий со слайсом формы
 * @param props
 */
function Time(props: ITimeProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    return <InputLabel value={value} label={props.label} className={props.className}>
        <TimeInput
            mask={props.mask}
            placeholder={props.placeholder}
            value={value}
            onValueChanged={onChange}
            customEvents={['onValueChanged']}/>
    </InputLabel>;
}

Time.displayName = 'Controls-Input/dateConnected:Time';
export { Time };
