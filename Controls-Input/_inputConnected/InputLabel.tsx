import { ReactElement, cloneElement, CSSProperties } from 'react';
import { InputContainer } from 'Controls/jumpingLabel';
import { IControlProps } from 'Controls/interface';
import { Label } from 'Controls/input';
import { Icon } from 'Controls/icon';
import 'css!Controls/CommonClasses';

interface IAttrs {
    className?: string;
    style?: CSSProperties;
}

interface IInputLabelProps extends IControlProps {
    value?: string;
    label?: {
        label?: string
        icon?: string;
        jumping?: boolean;
        labelPosition?: 'start' | 'top';
    };
    children: ReactElement;
    attrs?: IAttrs;
    style?: CSSProperties;
}

/**
 * HOC для работы с "Меткой"
 * @param props
 */
function InputLabel(props: IInputLabelProps) {
    const attrs = props.attrs || {};
    if (props.className) {
        attrs.className = props.className;
    }
    if (props.style) {
        attrs.style = props.style;
    }
    if (props.label?.jumping) {
        return <InputContainer
            attrs={attrs}
            className={attrs.className}
            value={props.value}
            caption={props.label.label}
            content={props.children}/>;
    }
    if (props.label?.icon) {
        return <div className={`tw-flex controls-max-w-full tw-flex-row tw-items-baseline ${attrs.className || ''}`}
                    style={attrs.style}>
            <Icon className="controls-margin_right-s"
                  icon={props.label.icon}
                  iconSize="s"
                  iconStyle="secondary"/>
            {props.children}
        </div>;
    }
    if (props.label?.labelPosition === 'start') {
        return <div className={`tw-flex controls-max-w-full tw-flex-row tw-items-baseline ${attrs.className || ''}`}
                    style={attrs.style}>
            <Label className="tw-min-w-0"
                   caption={props.label.label || '﻿'}/>
            {props.children}
        </div>;
    } else if (props.label?.labelPosition === 'top') {
        return <div className={`tw-flex controls-max-w-full tw-flex-col ${attrs.className || ''}`}
                    style={attrs.style}>
            <Label className="tw-min-w-0" caption={props.label.label || '﻿'}/>
            {props.children}
        </div>;
    }
    const controlProps = {...(props.children.props || {})};
    if (props.className) {
        controlProps.className = (props.children.props?.className + ' ' + (attrs.className || ''));
        controlProps.attrs = attrs;
        if (controlProps.props) {
            controlProps.props.className = (controlProps.props.className || '') + ' ' + attrs.className;
            controlProps.props.attrs = attrs;
        }
    }
    return cloneElement(props.children, controlProps);
}

InputLabel.displayName = 'Controls-Input/inputConnected:InputLabel';
export { InputLabel };
