import { Area, Text as TextControl } from 'Controls/input';
import { useConnectedValue, clearProps } from '../useConnectedValue';
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
import * as translate from 'i18n!Controls-Input';

export interface ITextProps extends INameOptions, IInputDefaultValueOptions, ILabelOptions, IPlaceholderOptions,
    IMultilineOptions, IRichTextOptions, IRequiredOptions, IConstraintOptions, ILengthOptions {
}

const MAX_LABEL_NO_SHRINK_LENGTH = 50;

/**
 * Редактор типа "Многострочный текст", работающий со слайсом формы
 * @param props
 */
function Text(props: ITextProps & IControlProps) {
    let constraint;
    if (props.constraint === 'notSpecial') {
        constraint = '[a-zA-Zа-яА-Я0-9еЁ \\n\\t\\r]';
    } else if (props.constraint === 'onlyLetters') {
        constraint = '[a-zA-Zа-яА-ЯёЁ \\n\\t\\r]';
    }
    const {value, onChange} = useConnectedValue(props.name, props.defaultValue);
    const {label, className, multiline, placeholder = translate('Введите текст')} = props;
    let minLines = multiline?.minLines;
    let maxLines;
    if (multiline?.maxLines) {
        maxLines = multiline.maxLines;
    }
    if (maxLines && maxLines < minLines) {
        const tmp = minLines;
        minLines = maxLines;
        maxLines = tmp;
    }
    let shouldNotShrink = false;
    if (label?.labelPosition === 'start') {
        if (!!(maxLines || minLines) && label.label?.length < MAX_LABEL_NO_SHRINK_LENGTH) {
            shouldNotShrink = true;
        }
    }
    return <InputLabel
        attrs={props.attrs}
        style={props.style}
        value={value}
        label={label}
        shouldNotShrink={shouldNotShrink}
        className={className}>
        {
            (maxLines || minLines) ? (
                <Area
                    {...clearProps(props)}
                    className="controls-max-w-full tw-min-w-0"
                    value={value}
                    valueChangedCallback={onChange}
                    placeholder={placeholder}
                    placeholderVisibility='empty'
                    constraint={constraint}
                    minLines={minLines}
                    maxLines={maxLines}
                    maxLength={props.length?.maxLength}/>
            ) : (
                <TextControl
                    {...clearProps(props)}
                    value={value}
                    valueChangedCallback={onChange}
                    placeholder={placeholder}
                    placeholderVisibility='empty'
                    constraint={constraint}
                    maxLength={props.length?.maxLength}
                />
            )
        }

    </InputLabel>;
}

Text.displayName = 'Controls-Input/inputConnected:Text';
export { Text };
