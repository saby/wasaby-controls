import { ReactElement, cloneElement } from 'react';
import { InputContainer } from 'Controls/jumpingLabel';
import { IControlProps } from 'Controls/interface';
import { Label } from 'Controls/input';
import { Icon } from 'Controls/icon';

interface IInputLabelProps extends IControlProps {
    value?: string;
    label?: {
        label?: string
        icon?: string;
        jumping?: boolean;
        labelPosition?: 'start' | 'top';
    };
    children: ReactElement;
}

/**
 * HOC для работы с "Меткой"
 * @param props
 */
function InputLabel(props: IInputLabelProps) {
    if (props.label?.jumping) {
        return <InputContainer
            className={props.className}
            value={props.value}
            caption={props.label.label}
            content={props.children}/>;
    }
    if (props.label?.icon) {
        return <div className={`tw-flex tw-w-full tw-flex-row tw-items-baseline ${props.className || ''}`}>
            <Icon className="controls-margin_right-s"
                  icon={props.label.icon}
                  iconSize="s"
                  iconStyle="secondary"/>
            {props.children}
        </div>;
    }
    if (props.label?.labelPosition === 'start') {
        return <div className={`tw-flex tw-w-full tw-flex-row tw-items-baseline ${props.className || ''}`}>
            <Label className="controls-margin_right-s"
                   caption={props.label.label}/>
            {props.children}
        </div>;
    } else if (props.label?.labelPosition === 'top') {
        return <div className={`tw-flex tw-w-full tw-flex-col ${props.className || ''}`}>
            <Label caption={props.label.label}/>
            {props.children}
        </div>;
    }
    const controlProps = {...(props.children.props || {})};
    if (props.className) {
        controlProps.className = (props.children.props?.className + ' ' + (props.className || ''));
        if (controlProps.props) {
            controlProps.props.className = (controlProps.props.className || '') + ' ' + props.className;
        }
    }
    return cloneElement(props.children, controlProps);
}

InputLabel.displayName = 'Controls-Input/inputConnected:InputLabel';
export { InputLabel };
