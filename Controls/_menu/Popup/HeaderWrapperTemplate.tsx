import * as React from 'react';
import { Icon } from 'Controls/icon';
import { IIconOptions, IIconSizeOptions } from 'Controls/interface';

export interface IHeaderWrapperTemplateProps extends IIconOptions, IIconSizeOptions {
    theme?: string;
    isAdaptive?: boolean;
    className?: string;
    children?: JSX.Element;
    onMouseenter?: React.MouseEventHandler;
    onClick: React.MouseEventHandler;
}

export default React.forwardRef(function HeaderTemplate(props: IHeaderWrapperTemplateProps, ref) {
    return (
        <div
            ref={ref}
            style={props.style || props.attrs?.style}
            className={`controls_dropdownPopup_theme-${props.theme}
            controls_list_theme-${props.theme}
            controls-Menu__popup-header
            ${
                props.isAdaptive
                    ? 'controls-Menu__popup-header_adaptive controls-Menu__popup-header_offset'
                    : ''
            } ${props.className || props.attrs?.className || ''}`}
            onMouseEnter={props.onMouseenter}
            onClick={props.onClick}
        >
            <IconTemplate {...props} />
            <ContentTemplate {...props} />
        </div>
    );
});

function ContentTemplate(props: IHeaderWrapperTemplateProps) {
    if (props.children) {
        return props.children;
    }
    return null;
}

function IconTemplate(props: IHeaderWrapperTemplateProps) {
    if (props.icon) {
        const contentClassPadding =
            props.children || props.content
                ? 'controls-Menu__popup_headerIcon_' + (props.iconSize || 'm') + '_padding'
                : '';
        return (
            <div
                className={`controls-Menu__popup-headerIcon_wrapper
                    ${contentClassPadding}`}
            >
                <Icon iconSize={props.iconSize || 'm'} icon={props.icon} iconStyle="secondary" />
            </div>
        );
    }
    return null;
}
