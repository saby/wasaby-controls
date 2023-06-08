import * as React from 'react';
import { GridView as BaseView } from 'Controls/gridReact';
import { IInnerDeviceViewProps } from './interface';

import {
    ColumnScrollContext,
    DragScrollContext,
    DragScrollOverlayComponent,
    ApplyCssTransformComponent,
    ShadowsComponent,
    ColumnScrollUtils,
} from 'Controls/columnScrollReact';

interface IDesktopViewColumnScrollProps extends IInnerDeviceViewProps {
    startDragScroll?: (e: React.MouseEvent | React.TouchEvent) => void;
    moveDragScroll?: (e: React.MouseEvent | React.TouchEvent) => void;
    stopDragScroll?: () => void;
    onWheelCallback?: (e: React.WheelEvent) => void;
}

export function DesktopViewColumnScroll(
    props: IDesktopViewColumnScrollProps
): React.FunctionComponentElement<IDesktopViewColumnScrollProps> {
    return (
        <div
            onMouseDown={(e) => {
                return props.startDragScroll?.(e);
            }}
            onTouchStart={(e) => {
                return props.startDragScroll?.(e);
            }}
            onMouseMove={(e) => {
                return props.moveDragScroll?.(e);
            }}
            onTouchMove={(e) => {
                return props.moveDragScroll?.(e);
            }}
            onMouseUp={(e) => {
                return props.stopDragScroll?.();
            }}
            onTouchEnd={(e) => {
                return props.stopDragScroll?.();
            }}
            onWheel={(e) => {
                return props.onWheelCallback?.(e);
            }}
            className={
                props.viewClassName +
                (props.shouldUseFakeRender
                    ? ` ${props.hydrationPreRenderClassName}`
                    : '')
            }
        >
            {props.columnScrollViewMode !== 'unaccented' && (
                <ShadowsComponent />
            )}

            <ApplyCssTransformComponent />
            <DragScrollOverlayComponent />

            <div className={props.transformedWrapperClassName}>
                <BaseView {...props} />
            </div>

            {props.shouldUseFakeRender && (
                <div className={props.fixedWrapperClassName}>
                    {/* @ts-ignore */}
                    <BaseView {...props} className={''} />
                </div>
            )}
        </div>
    );
}

const DesktopViewColumnScrollMemo = React.memo(DesktopViewColumnScroll);

export function DesktopViewColumnScrollWrapper(
    props: IInnerDeviceViewProps
): React.ReactElement<IInnerDeviceViewProps> {
    const columnScrollContextRef =
        React.useContext(ColumnScrollContext).contextRefForHandlersOnly;
    const dragScrollContextRef =
        React.useContext(DragScrollContext).contextRefForHandlersOnly;

    const startDragScroll = React.useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            dragScrollContextRef.current.startDragScroll(e);
        },
        []
    );
    const moveDragScroll = React.useCallback(
        (e: React.MouseEvent | React.TouchEvent) => {
            dragScrollContextRef.current.moveDragScroll(e);
        },
        []
    );
    const stopDragScroll = React.useCallback(() => {
        dragScrollContextRef.current.stopDragScroll();
    }, []);

    const onWheel = React.useCallback((e: React.WheelEvent) => {
        columnScrollContextRef.current.setPosition(
            ColumnScrollUtils.calcNewPositionByWheelEvent(
                e,
                columnScrollContextRef.current.position,
                columnScrollContextRef.current
            )
        );
    }, []);

    return (
        <DesktopViewColumnScrollMemo
            {...props}
            onWheelCallback={onWheel}
            startDragScroll={startDragScroll}
            moveDragScroll={moveDragScroll}
            stopDragScroll={stopDragScroll}
        />
    );
}

export default React.memo(React.forwardRef(DesktopViewColumnScrollWrapper));
