/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { default as ScrollbarComponent } from './PlatformScrollbar/ScrollBarBase';
import { getScrollableWidth } from '../common/helpers';
import { INavigationInnerComponentProps } from './interface';
import { IColumnScrollWidths } from '../common/interfaces';
import { QA_SELECTORS } from '../common/data-qa';
import { ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME } from '../common/selectors';

const SCROLLBAR_COMPONENT_STYLE = { top: 0 };

export interface IScrollbarNavigationComponentProps
    extends INavigationInnerComponentProps,
        IColumnScrollWidths {
    position: number;
    onPositionChangeCallback?: (newPosition: number) => void;
    onDraggingChangeCallback?: (isDragging: boolean) => void;
    scrollBarValign?: 'center' | 'bottom';
    readOnly?: boolean;
}

export function ScrollbarNavigationComponent(
    props: IScrollbarNavigationComponentProps
): React.FunctionComponentElement<IScrollbarNavigationComponentProps> {
    const scrollbarContentWidth = React.useMemo(() => {
        return getScrollableWidth(props);
    }, [props.contentWidth, props.startFixedWidth, props.endFixedWidth]);

    const className = [
        'tw-w-full',
        ENABLE_GRAPHIC_ACCELERATION_CSS_CLASS_NAME,
        props.className || '',
    ].join(' ');

    return (
        <div className={className} data-qa={QA_SELECTORS.NAVIGATION_SCROLLBAR}>
            <ScrollbarComponent
                style={SCROLLBAR_COMPONENT_STYLE}
                readOnly={props.readOnly}
                position={props.position}
                contentSize={scrollbarContentWidth}
                direction="horizontal"
                thumbSize="s"
                thumbStyle="unaccented"
                trackVisible={true}
                hasStartPadding={true}
                hasEndPadding={true}
                shouldSetMarginTop={props.scrollBarValign !== 'bottom'}
                onPositionChanged={props.onPositionChangeCallback}
                onDraggingChanged={props.onDraggingChangeCallback}
            />
        </div>
    );
}

export default React.memo(ScrollbarNavigationComponent);
