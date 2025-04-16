import { cloneElement, CSSProperties, ReactElement } from 'react';
import { useAdaptiveMode } from 'UI/Adaptive';
import { InputContainer } from 'Controls/jumpingLabel';
import { IComponentProps } from 'Controls/interface';
import { Label } from 'Controls/input';
import { Icon } from 'Controls/icon';
import 'css!Controls/CommonClasses';
import 'css!Controls-Input/inputConnected';

interface IAttrs {
    className?: string;
    style?: CSSProperties;
}

/**
 * Интерфейс для компонента "Метка"
 * @public
 */
export interface IInputLabelProps extends IComponentProps {
    /**
     * Значение для поля ввода
     */
    value?: string;
    /**
     * Определяет вид метки
     */
    label?: {
        /**
         * Определяет текст для метки
         */
        label?: string;
        /**
         * Определяет иконку для метки
         */
        icon?: string;
        /**
         * Определяет будет ли метка прыгающей
         */
        jumping?: boolean;
        /**
         * Определяет расположение метки
         */
        labelPosition?: 'start' | 'top';
    };
    /**
     * Определяет подсказку для поля ввода
     */
    placeholder?: string;
    shouldNotShrink?: boolean;
    fontSize?: string;
    children: ReactElement;
    attrs?: IAttrs;
    style?: CSSProperties;
}

/**
 * HOC для работы с "Меткой"
 * @param {Controls-Input/inputConnected:IInputLabelProps} props Пропсы компонента
 * @public
 */
function InputLabel(props: IInputLabelProps): JSX.Element {
    const { attrs = {} } = props;
    const adaptiveMode = useAdaptiveMode();
    if (props.className) {
        attrs.className = props.className;
    }
    if (props.style) {
        attrs.style = props.style;
    }
    if (props.label?.jumping) {
        return (
            <InputContainer
                attrs={attrs}
                className={attrs.className}
                value={props.value}
                caption={props.label?.label || props.placeholder}
                content={props.children}
            />
        );
    }
    let labelPosition = props.label?.labelPosition || 'start';
    if (adaptiveMode?.device.isPhone() && labelPosition) {
        labelPosition = 'top';
    }
    if (labelPosition === 'start' && (props.label?.icon || props.label?.label)) {
        let className = 'tw-min-w-0 tw-flex-shrink';
        if (props.shouldNotShrink) {
            className += ' tw-flex-shrink-0';
        }
        return (
            <div
                className={`tw-flex controls-max-w-full tw-flex-row tw-items-baseline ${
                    attrs.className || ''
                }`}
                style={attrs.style}
            >
                {props.label?.icon && (
                    <Icon
                        className="controls-margin_right-s"
                        icon={props.label.icon}
                        iconSize="s"
                        iconStyle={'label'}
                    />
                )}
                {props.label?.label && (
                    <Label
                        className={className}
                        caption={props.label.label || '﻿'}
                        fontSize={props.fontSize}
                        fontColorStyle={'label'}
                    />
                )}
                {props.children &&
                    cloneElement(props.children, {
                        ...props.children?.props,
                        className:
                            'controls-input_label_min-input-content ' +
                            (props.children?.props?.className || ''),
                        props: {
                            ...(props.children?.props?.props || {}),
                            className:
                                'controls-input_label_min-input-content ' +
                                (props.children?.props?.props?.className || ''),
                        },
                    })}
            </div>
        );
    } else if (labelPosition === 'top' && (props.label?.icon || props.label?.label)) {
        return (
            <div
                className={`tw-flex controls-max-w-full tw-flex-col ${attrs.className || ''}`}
                style={attrs.style}
            >
                <Label
                    className="tw-min-w-0"
                    autoHeight={true}
                    caption={props.label.label || '﻿'}
                    fontColorStyle={props.label?.labelStyle || 'label'}
                />
                {props.children}
            </div>
        );
    }
    const controlProps = { ...(props.children?.props || {}) };
    if (props.className) {
        controlProps.className = props.children?.props?.className + ' ' + (attrs.className || '');
        controlProps.attrs = attrs;
        if (controlProps.props) {
            controlProps.props.className =
                (controlProps.props.className || '') + ' ' + attrs.className;
            controlProps.props.attrs = attrs;
        }
    }
    controlProps.className =
        (controlProps.className ? `${controlProps.className} ` : '') + 'tw-w-full';
    if (controlProps.props) {
        controlProps.props.className =
            (controlProps.props.className ? `${controlProps.props.className} ` : '') + 'tw-w-full';
    }

    return props.children ? cloneElement(props.children, controlProps) : null;
}

InputLabel.displayName = 'Controls-Input/inputConnected:InputLabel';
export { InputLabel };
