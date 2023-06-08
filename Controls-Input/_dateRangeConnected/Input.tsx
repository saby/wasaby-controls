import { InputLabel } from '../_inputConnected/InputLabel';
import { useConnectedValue } from '../useConnectedValue';
import { Input as DateInput } from 'Controls/dateRange';
import { IDateMaskOptions } from 'Controls/interface';
import { IControlProps } from 'Controls/interface';
import {
    INameOptions,
    IDateRangeDefaultValueOptions,
    INoJumpingLabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IDateRangeLimitOptions,
} from 'Controls-Input/interface';

export interface IDateRangeProps extends INameOptions, IDateRangeDefaultValueOptions, IDateMaskOptions,
    INoJumpingLabelOptions, IPlaceholderOptions, IRequiredOptions, IDateRangeLimitOptions {
}

/**
 * Редактор типа "Период", работающий со слайсом формы
 * @param props
 */
function Input(props: IDateRangeProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    return (
        <InputLabel value={value} label={props.label} className={props.className}>
            <DateInput
                mask={props.mask}
                placeholder={props.placeholder}
                startValue={value.startValue}
                endValue={value.endValue}
                onStartValueChanged={(event, startValue) => onChange({...value, startValue})}
                onEndValueChanged={(event, endValue) => onChange({...value, endValue})}
                customEvents={['onStartValueChanged', 'onEndValueChanged']}
            />
        </InputLabel>
    );
}

Input.displayName = 'Controls-Input/dateRangeConnected:Input';
export { Input };
