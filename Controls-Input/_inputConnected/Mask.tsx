import { InputLabel } from './InputLabel';
import { IControlProps } from 'Controls/interface';
import { Mask as MaskInput } from 'Controls/input';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import {
    INameOptions,
    IInputDefaultValueOptions,
    ILabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IMaskOptions
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

export interface IMaskProps extends INameOptions,
    IInputDefaultValueOptions, ILabelOptions, IMaskOptions, IPlaceholderOptions, IRequiredOptions {
}

/**
 * Редактор типа "Маска", работающий со слайсом формы
 * @param props
 */
function Mask(props: IMaskProps & IControlProps) {
    const {placeholder = translate('Введите текст'), mask = ''} = props;
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    return <InputLabel
        attrs={props.attrs}
        style={props.style}
        value={value}
        label={props.label}
        className={props.className}>
        <MaskInput
            mask={mask}
            placeholder={placeholder}
            placeholderVisibility='empty'
            value={value}
            valueChangedCallback={onChange}
            {...clearProps(props)}/>
    </InputLabel>;
}

Mask.displayName = 'Controls-Input/inputConnected:Mask';
export { Mask };
