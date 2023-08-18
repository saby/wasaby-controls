import { useState, useEffect, useCallback } from 'react';
import { Area, Text as TextControl } from 'Controls/input';
import { useConnectedValue, clearProps } from '../useConnectedValue';
import { useValidation, getValidators } from 'Controls-Input/validators';
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
    IConstraintOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import * as translate from 'i18n!Controls-Input';

export interface ITextProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IPlaceholderOptions,
        IMultilineOptions,
        IRichTextOptions,
        IRequiredOptions,
        IConstraintOptions,
        ILengthOptions,
        IValidateOptions {}

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
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [textValue, setTextValue] = useState<string>(value);
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props)
    );

    const onValueChanged = useCallback((result) => {
        resetValidation();
        setTextValue(result);
    }, []);
    const onInputCompleted = useCallback((result) => {
        onChange(result);
        validate();
    }, []);

    useEffect(() => {
        setTextValue(value);
    }, [value]);
    const { label, className, multiline, placeholder = translate('Введите текст') } = props;
    const classes = `${className} ${!!value ? 'controls-Input-connected_filled' : ''}`;
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
    return (
        <InputLabel
            attrs={props.attrs}
            style={props.style}
            value={textValue}
            label={label}
            shouldNotShrink={shouldNotShrink}
            validationStatus={validationStatus}
            className={classes}
        >
            {maxLines || minLines ? (
                <Area
                    {...clearProps(props)}
                    className="controls-max-w-full tw-flex-grow"
                    value={textValue}
                    valueChangedCallback={onValueChanged}
                    onInputCompleted={onInputCompleted}
                    placeholder={placeholder}
                    placeholderVisibility="empty"
                    constraint={constraint}
                    minLines={minLines}
                    maxLines={maxLines}
                    maxLength={props.length?.maxLength}
                    onFocus={onFocus}
                    customEvents={['onInputCompleted']}
                    validationStatus={validationStatus}
                />
            ) : (
                <TextControl
                    {...clearProps(props)}
                    value={textValue}
                    valueChangedCallback={onValueChanged}
                    onInputCompleted={onInputCompleted}
                    placeholder={placeholder}
                    placeholderVisibility="empty"
                    constraint={constraint}
                    maxLength={props.length?.maxLength}
                    onFocus={onFocus}
                    customEvents={['onInputCompleted']}
                    validationStatus={validationStatus}
                />
            )}
        </InputLabel>
    );
}

Text.displayName = 'Controls-Input/inputConnected:Text';
export { Text };
