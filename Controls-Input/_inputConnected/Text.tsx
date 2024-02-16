import { ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Area, Text as TextControl } from 'Controls/input';
import { useConnectedValue } from '../useConnectedValue';
import { getValidators, MinMaxLength, useValidation } from 'Controls-Input/validators';
import { IControlProps } from 'Controls/interface';
import { InputLabel } from './InputLabel';
import {
    IConstraintOptions,
    IInputDefaultValueOptions,
    ILabelOptions,
    ILengthOptions,
    IMultilineOptions,
    INameOptions,
    IPlaceholderOptions,
    IRequiredOptions,
    IValidateOptions,
} from 'Controls-Input/interface';
import { getSizeProps } from 'Controls-Input/utils';
import * as translate from 'i18n!Controls-Input';

export interface ITextProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IPlaceholderOptions,
        IMultilineOptions,
        IRequiredOptions,
        IConstraintOptions,
        ILengthOptions,
        IValidateOptions {
    leftFieldTemplate?: ReactElement;
    rightFieldTemplate?: ReactElement;
    readOnly?: boolean;
}

const MAX_LABEL_NO_SHRINK_LENGTH = 50;

/**
 * Редактор типа "Многострочный текст", работающий со слайсом формы
 * @param props
 */
function Text(props: ITextProps & IControlProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [textValue, setTextValue] = useState<string>(value);
    const defaultValidators = useMemo(() => {
        if (props.length?.minLength || props.length?.maxLength) {
            return [
                (res) => {
                    return MinMaxLength(props.length, res);
                },
            ];
        }
        return [];
    }, []);
    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props, defaultValidators),
        ref
    );

    const onValueChanged = useCallback((result) => {
        resetValidation();
        setTextValue(result);
    }, []);
    const onInputCompleted = useCallback((_, result) => {
        onChange(result);
        validate();
    }, []);

    useEffect(() => {
        setTextValue(value);
    }, [value]);
    const { label, className, multiline, placeholder = translate('Введите текст') } = props;
    const classes = `${className || ''}${!!value ? ' controls-Input-connected_filled' : ''}`;
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
            placeholder={placeholder}
            shouldNotShrink={shouldNotShrink}
            validationStatus={validationStatus}
            className={classes}
        >
            {maxLines || minLines ? (
                <div className="tw-flex tw-w-full">
                    <Area
                        ref={ref}
                        attrs={props.attrs}
                        data-qa={props.dataQa || props['data-qa']}
                        className="controls-max-w-full tw-flex-grow"
                        value={textValue}
                        valueChangedCallback={onValueChanged}
                        onInputCompleted={onInputCompleted}
                        placeholder={placeholder}
                        placeholderVisibility="empty"
                        constraint={props.constraint}
                        minLines={minLines}
                        maxLines={maxLines}
                        maxLength={props.length?.maxLength}
                        onFocus={onFocus}
                        leftFieldTemplate={props.leftFieldTemplate}
                        rightFieldTemplate={props.rightFieldTemplate}
                        validationStatus={validationStatus}
                        {...getSizeProps(props)}
                        readOnly={props.readOnly}
                    />
                </div>
            ) : (
                <TextControl
                    ref={ref}
                    attrs={props.attrs}
                    data-qa={props.dataQa || props['data-qa']}
                    className={className}
                    value={textValue}
                    valueChangedCallback={onValueChanged}
                    onInputCompleted={onInputCompleted}
                    placeholder={placeholder}
                    placeholderVisibility="empty"
                    constraint={props.constraint}
                    maxLength={props.length?.maxLength}
                    onFocus={onFocus}
                    leftFieldTemplate={props.leftFieldTemplate}
                    rightFieldTemplate={props.rightFieldTemplate}
                    validationStatus={validationStatus}
                    {...getSizeProps(props)}
                    readOnly={props.readOnly}
                />
            )}
        </InputLabel>
    );
}

Text.displayName = 'Controls-Input/inputConnected:Text';
export { Text };
