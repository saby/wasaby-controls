import { useConnectedValue } from '../useConnectedValue';
import { Phone as PhoneInput } from 'Controls/input';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from './InputLabel';
import {
    INameOptions,
    IInputDefaultValueOptions,
    ILabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IFlagVisibleOptions,
    IOnlyMobileOptions
} from 'Controls-Input/interface';

export interface IPhoneProps extends INameOptions, IInputDefaultValueOptions, ILabelOptions, IPlaceholderOptions,
    IRequiredOptions, IFlagVisibleOptions, IOnlyMobileOptions {
}

/**
 * Редактор типа "Телефон", работающий со слайсом формы
 * @param props
 */
function Phone(props: IPhoneProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    return <InputLabel value={value} label={props.label} className={props.className}>
        <PhoneInput
            placeholder={props.placeholder}
            flagVisible={props.flagVisible}
            flagPosition={props.flagPosition}
            onlyMobile={props.onlyMobile}
            value={value}
            valueChangedCallback={onChange}/>
    </InputLabel>;
}

Phone.displayName = 'Controls-Input/inputConnected:Phone';
export { Phone };
