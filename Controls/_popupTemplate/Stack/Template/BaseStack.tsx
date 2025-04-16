/**
 * @kaizen_zone 05aea820-650e-420c-b050-dd641a32b2d5
 */
import { ReactElement, cloneElement, useMemo, forwardRef } from 'react';
import { useTheme } from 'UI/Contexts';
import { Controller } from 'Controls/popup';
import { IComponentPropsWithReadonly } from 'Controls/interface';
import { TInternalProps } from 'UICore/executor';

export interface IBaseStackTemplateOptions extends IComponentPropsWithReadonly, TInternalProps {
    stackPosition?: 'right' | 'left';
}

function BaseStack(props: IBaseStackTemplateOptions, ref): ReactElement {
    const theme = useTheme(props);

    const popupDirection = useMemo(() => {
        return props.stackPosition || Controller.getStackPosition();
    }, []);

    const content = useMemo(() => {
        return cloneElement(props.children, {});
    }, [props.children]);
    return (
        <div
            ref={ref}
            className={`controls_popupTemplate_theme-${theme} controls-StackTemplate ${props.className}`}
            ws-tab-cycling="true"
            data-qa={props.dataQa || props['data-qa']}
            style={props.style}
        >
            {!props.isWorkspacePopup ? (
                <div
                    className={`controls-StackTemplate-shadow__container ${
                        props.leftContentTemplate ? 'controls-StackTemplate-shadow_zIndex' : ''
                    } controls-StackTemplate-shadow_direction-${popupDirection}__container`}
                >
                    <div
                        className={`controls-StackTemplate-shadow controls-StackTemplate-shadow_direction-${popupDirection}`}
                    >
                        <div className="controls-StackTemplate-shadow__content"></div>
                    </div>
                </div>
            ) : null}
            {content}
        </div>
    );
}

export default forwardRef(BaseStack);
