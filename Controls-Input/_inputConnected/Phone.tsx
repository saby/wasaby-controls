import { useConnectedValue, clearProps } from '../useConnectedValue';
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
import * as translate from 'i18n!Controls-Input';

export interface IPhoneProps extends INameOptions, IInputDefaultValueOptions, ILabelOptions, IPlaceholderOptions,
    IRequiredOptions, IFlagVisibleOptions, IOnlyMobileOptions {
}

/**
 * Редактор типа "Телефон", работающий со слайсом формы
 * @param props
 */
function Phone(props: IPhoneProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    const {label, className, flagVisible, flagPosition, onlyMobile, placeholder = translate('Введите номер')} = props;
    return <InputLabel
        attrs={props.attrs}
        style={props.style}
        value={value}
        label={label}
        className={className}>
        <PhoneInput
            placeholder={placeholder}
            placeholderVisibility='empty'
            flagVisible={flagVisible}
            flagPosition={flagPosition}
            onlyMobile={onlyMobile}
            value={value}
            valueChangedCallback={onChange}
            {...clearProps(props)}/>
    </InputLabel>;
}

Phone.displayName = 'Controls-Input/inputConnected:Phone';
export { Phone };
