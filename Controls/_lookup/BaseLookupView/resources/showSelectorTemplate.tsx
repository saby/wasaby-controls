import { TInternalProps } from 'UICore/Executor';
import { Icon } from 'Controls/icon';
import * as React from 'react';

export interface IShowSelectorTemplateOptions extends TInternalProps {
    theme?: string;
    horizontalPadding?: string;
    onMouseDown: React.MouseEventHandler<HTMLDivElement>;
    onMouseLeave: React.MouseEventHandler<HTMLDivElement>;
    onMouseEnter: React.MouseEventHandler<HTMLDivElement>;
}

function ShowSelectorTemplate(props: IShowSelectorTemplateOptions, ref): JSX.Element {
    return (
        <Icon
            iconSize="s"
            icon="Controls-icons/common:icon-Burger"
            dataQa="Lookup__showSelector"
            ref={ref}
            className={`controls-Lookup__showSelector
                         ${props.attrs?.className}
                         controls_lookup_theme-${props.theme}
                         controls-Lookup__icon controls-icon
                         controls-Lookup__showSelector_horizontalPadding-${
                             props.horizontalPadding ? props.horizontalPadding : 'xs'
                         }`}
            onMouseDown={props.onMouseDown}
            onMouseLeave={props.onMouseLeave}
            onMouseEnter={props.onMouseEnter}
        />
    );
}

export default React.forwardRef(ShowSelectorTemplate);
