/**
 * @kaizen_zone 4f556a12-3d12-4c5d-bfd8-53e193344358
 */
import * as React from 'react';
import { SyntheticEvent } from 'UI/Vdom';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { IControlProps } from 'Controls/interface';
import { useReadonly, useTheme } from 'UI/Contexts';
import ShowMoreButton from 'Controls/ShowMoreButton';
import 'css!Controls/cut';

type TIconSize = 's' | 'm' | 'l';
type TButtonPosition = 'start' | 'center';

export interface ICutButton extends IControlProps {
    iconSize: TIconSize;
    contrastBackground: boolean;
    backgroundStyle: string;
    lineHeight: string;
    readOnly: boolean;
    expanded: boolean;
    buttonPosition: TButtonPosition;
    onExpandedChanged?: Function;
    onExpandedchanged?: Function;
}

export default React.forwardRef(function CutButton(props: ICutButton, ref) {
    const { iconSize = 'm', buttonPosition = 'center', contrastBackground = true } = props;
    const theme = useTheme(props);
    const readOnly = useReadonly(props);
    const clickHandler = (event: SyntheticEvent) => {
        event.stopPropagation();
    };
    const onValueHandler = (event: SyntheticEvent, value: boolean): void => {
        if (!readOnly) {
            props.onExpandedChanged?.(event, value);
            props.onExpandedchanged?.(event, value);
        }
    };
    const className =
        `controls_spoiler_theme-${theme} controls_toggle_theme-${theme}` +
        ` controls-background-${props.backgroundStyle}` +
        ` controls-CutButton__container_background-${props.backgroundStyle}` +
        ` controls-CutButton__container controls-CutButton__container_size-${iconSize}` +
        ` controls-CutButton__container_${props.expanded ? 'extended' : 'notExtended'}` +
        ` controls-CutButton__container_lineHeight-${props.lineHeight}` +
        ` controls-CutButton__container_position-${buttonPosition} ${props.className}`;
    const attrs = wasabyAttrsToReactDom(props.attrs) || {};
    return (
        <div {...attrs} className={className} tabIndex={props.tabIndex}>
            <div
                className={`controls-CutButton controls-CutButton_background-${props.backgroundStyle} controls-CutButton_size-${iconSize}`}
            >
                <ShowMoreButton
                    ref={ref}
                    className="controls-CutButton__separator"
                    iconSize={props.iconSize}
                    value={props.expanded}
                    readOnly={readOnly}
                    contrastBackground={contrastBackground}
                    onClick={clickHandler}
                    tabIndex={props.tabIndex}
                    onValueChanged={onValueHandler}
                />
            </div>
        </div>
    );
});
