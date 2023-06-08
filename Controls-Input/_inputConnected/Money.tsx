import { IOnlyPositiveOptions } from 'Controls/baseDecorator';
import { useConnectedValue } from '../useConnectedValue';
import { Money as MoneyInput } from 'Controls/input';
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
    IUseGroupingOptions
} from 'Controls-Input/interface';

export interface IMoneyProps extends INameOptions, IInputDefaultValueOptions,
    ILabelOptions, IPlaceholderOptions, IRequiredOptions, IOnlyPositiveOptions, ILimitOptions,
    IIntegersLengthOptions, IUseGroupingOptions {
}

/**
 * Редактор типа "Число", работающий со слайсом формы
 * @param props
 */
function Money(props: IMoneyProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    const {className, label, placeholder, onlyPositive, integersLength, useGrouping = false} = props;
    return <InputLabel value={value} label={label} className={className}>
        <MoneyInput
            useGrouping={useGrouping}
            placeholder={placeholder}
            onlyPositive={onlyPositive}
            integersLength={integersLength}
            value={value}
            valueChangedCallback={onChange}
        />
    </InputLabel>;
}

Money.displayName = 'Controls-Input/inputConnected:Money';
export { Money };
