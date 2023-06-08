import { IOnlyPositiveOptions } from 'Controls/baseDecorator';
import { useConnectedValue } from '../useConnectedValue';
import { Number as NumberInput } from 'Controls/input';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from './InputLabel';
import {
    INameOptions,
    IInputDefaultValueOptions,
    ILabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    ILimitOptions,
    IIntegersLengthOptions,
    IUseGroupingOptions,
    IPrecisionOptions
} from 'Controls-Input/interface';

export interface INumberProps extends INameOptions, IInputDefaultValueOptions, ILabelOptions, IUseGroupingOptions,
    IPlaceholderOptions, IRequiredOptions, IOnlyPositiveOptions, IIntegersLengthOptions,
    IPrecisionOptions, ILimitOptions {
}

/**
 * Редактор типа "Число", работающий со слайсом формы
 * @param props
 */
function Number(props: INumberProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    const {
        className, label, placeholder, onlyPositive,
        integersLength, precision, useGrouping = false
    } = props;
    return <InputLabel value={value} label={label} className={className}>
        <NumberInput
            useGrouping={useGrouping}
            placeholder={placeholder}
            onlyPositive={onlyPositive}
            integersLength={integersLength}
            precision={precision}
            value={value}
            valueChangedCallback={onChange}
        />
    </InputLabel>;
}

Number.displayName = 'Controls-Input/inputConnected:Number';
export { Number };
