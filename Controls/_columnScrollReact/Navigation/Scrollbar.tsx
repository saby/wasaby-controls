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

    // onPositionChanged у Controls/scrollbar:Scrollbar имеет другую сигнатуру.
    const onPositionChanged = React.useCallback(
        (newPosition) => {
            props.onPositionChangeCallback?.(newPosition);
        },
        [props.onPositionChangeCallback]
    );

    // onDraggingChanged у Controls/scrollbar:Scrollbar имеет другую сигнатуру.
    const onDraggingChanged = React.useCallback(
        (isDragging: boolean) => {
            props.onDraggingChangeCallback?.(isDragging);
        },
        [props.onDraggingChangeCallback]
    );

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
                onPositionChanged={onPositionChanged}
                onDraggingChanged={onDraggingChanged}
            />
        </div>
    );
}

export default React.memo(ScrollbarNavigationComponent);
