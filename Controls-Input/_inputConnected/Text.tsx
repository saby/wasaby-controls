import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Area, Text as TextControl } from 'Controls/input';
import { useConnectedValue, useFormReadonly } from 'Controls-DataEnv/context';
import { getValidators, useValidation } from 'Controls-Input/validators';
import { IComponentProps } from 'Controls/interface';
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

/**
 * Интерфейс, описывающий опции редактора типа "Многострочный текст"
 * @public
 * @implements Controls-Input/interface:INameOptions
 * @implements Controls-Input/interface:IInputDefaultValueOptions
 * @implements Controls-Input/interface:ILabelOptions
 * @implements Controls-Input/interface:IPlaceholderOptions
 * @implements Controls-Input/interface:IMultilineOptions
 * @implements Controls-Input/interface:IRequiredOptions
 * @implements Controls-Input/interface:IConstraintOptions
 * @implements Controls-Input/interface:ILengthOptions
 * @implements Controls-Input/interface:IValidateOptions
 */
export interface ITextProps
    extends INameOptions,
        IInputDefaultValueOptions,
        ILabelOptions,
        IPlaceholderOptions,
        IMultilineOptions,
        IRequiredOptions,
        IConstraintOptions,
        ILengthOptions,
        IValidateOptions,
        IComponentProps {
    leftFieldTemplate?: ReactElement;
    rightFieldTemplate?: ReactElement;
    readOnly?: boolean;
}

const MAX_LABEL_NO_SHRINK_LENGTH = 50;

/**
 * Редактор типа "Многострочный текст", работающий со слайсом формы
 * @param {Controls-Input/inputConnected:ITextProps} props Пропсы компонента
 * @public
 */
function Text(props: ITextProps) {
    const { value, onChange } = useConnectedValue(props.name, props.defaultValue);
    const [textValue, setTextValue] = useState<string>(value);
    const ref = useRef();
    const { onFocus, resetValidation, validate, validationStatus } = useValidation(
        props.name,
        getValidators(props),
        ref
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
    const classes = `${className || ''}${!!value ? ' controls-Input-connected_filled' : ''}`;
    let minLines = multiline?.minLines;
    let maxLines;
    if (minLines === 0) {
        minLines = 1;
    } else if (minLines > 10) {
        minLines = 10;
    }

    if (multiline?.maxLines) {
        maxLines = multiline.maxLines;
        if (maxLines === 0) {
            maxLines = 1;
        } else if (maxLines > 10) {
            maxLines = 10;
        }
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
    const sizeProps = getSizeProps(props);
    const readOnly = useFormReadonly(props.name);
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
            fontSize={sizeProps.fontSize}
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
                        maxLength={props.maxLength}
                        onFocus={onFocus}
                        leftFieldTemplate={props.leftFieldTemplate}
                        rightFieldTemplate={props.rightFieldTemplate}
                        validationStatus={validationStatus}
                        {...sizeProps}
                        readOnly={readOnly}
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
                    maxLength={props.maxLength}
                    onFocus={onFocus}
                    leftFieldTemplate={props.leftFieldTemplate}
                    rightFieldTemplate={props.rightFieldTemplate}
                    validationStatus={validationStatus}
                    {...sizeProps}
                    readOnly={props.readOnly}
                />
            )}
        </InputLabel>
    );
}

Text.displayName = 'Controls-Input/inputConnected:Text';
export { Text };
