import { Area, Text as TextControl } from 'Controls/input';
import { useConnectedValue } from '../useConnectedValue';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from './InputLabel';
import {
    INameOptions,
    IInputDefaultValueOptions,
    ILabelOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IMultilineOptions,
    IRichTextOptions,
    ILengthOptions,
    IConstraintOptions
} from 'Controls-Input/interface';

export interface ITextProps extends INameOptions, IInputDefaultValueOptions, ILabelOptions, IPlaceholderOptions,
    IMultilineOptions, IRichTextOptions, IRequiredOptions, IConstraintOptions, ILengthOptions {
}

/**
 * Редактор типа "Многострочный текст", работающий со слайсом формы
 * @param props
 */
function Text(props: ITextProps & IControlProps) {
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    return <InputLabel value={value} label={props.label} className={props.className}>
        {
            (props.multiline?.maxLines && props.multiline?.minLines) ? (
                <Area
                    value={value}
                    valueChangedCallback={onChange}
                    placeholde={props.placeholder}
                    constraint={props.constraint}
                    minLines={props.multiline.minLines}
                    maxLines={props.multiline.maxLines}/>
            ) : (
                <TextControl
                    value={value}
                    valueChangedCallback={onChange}
                    placeholde={props.placeholder}
                    constraint={props.constraint}
                    maxLength={props.length?.maxLength}/>
            )
        }

    </InputLabel>;
}

Text.displayName = 'Controls-Input/inputConnected:Text';
export { Text };
