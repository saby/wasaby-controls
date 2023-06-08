import { InputLabel } from './InputLabel';
import { IControlProps } from 'Controls/interface';
import { Mask as MaskInput } from 'Controls/input';
import { useConnectedValue } from '../useConnectedValue';
import {
    INameOptions,
    IInputDefaultValueOptions,
    ILabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IMaskOptions
} from 'Controls-Input/interface';

export interface IMaskProps extends INameOptions,
    IInputDefaultValueOptions, ILabelOptions, IMaskOptions, IPlaceholderOptions, IRequiredOptions {
}

/**
 * Редактор типа "Маска", работающий со слайсом формы
 * @param props
 */
function Mask(props: IMaskProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    return <InputLabel value={value} label={props.label} className={props.className}>
        <MaskInput
            mask={props.mask}
            placeholder={props.placeholder}
            value={value}
            valueChangedCallback={onChange}/>
    </InputLabel>;
}

Mask.displayName = 'Controls-Input/inputConnected:Mask';
export { Mask };
