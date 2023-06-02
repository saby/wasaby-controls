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
    ViewportObserverComponent,
    DebugLogger,
} from 'Controls/columnScrollReact';

interface IDesktopViewColumnScrollProps extends IInnerDeviceViewProps {
    startDragScroll?: (e: React.MouseEvent | React.TouchEvent) => void;
    moveDragScroll?: (e: React.MouseEvent | React.TouchEvent) => void;
    stopDragScroll?: () => void;
    onWheelCallback?: (e: React.WheelEvent) => void;
}

const DesktopViewColumnScroll = React.memo(
    React.forwardRef(function DesktopViewColumnScroll(
        props: IDesktopViewColumnScrollProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.FunctionComponentElement<IDesktopViewColumnScrollProps> {
        return (
            <div
                ref={ref}
                onMouseDown={(e) => {
                    props.startDragScroll?.(e);
                }}
                onTouchStart={(e) => {
                    props.startDragScroll?.(e);
                }}
                onMouseMove={(e) => {
                    props.moveDragScroll?.(e);
                }}
                onTouchMove={(e) => {
                    props.moveDragScroll?.(e);
                }}
                onMouseUp={(e) => {
                    props.stopDragScroll?.();
                }}
                onTouchEnd={(e) => {
                    props.stopDragScroll?.();
                }}
                onWheel={(e) => {
                    props.onWheelCallback?.(e);
                }}
                className={
                    props.viewClassName +
                    (props.shouldUseFakeRender ? ` ${props.hydrationPreRenderClassName}` : '')
                }
            >
                {props.columnScrollViewMode !== 'unaccented' && (
                    <ShadowsComponent leftShadowClassName={props.leftShadowClassName} />
                )}

                <ApplyCssTransformComponent />
                <DragScrollOverlayComponent />
                <ViewportObserverComponent />

                <div className={props.transformedWrapperClassName}>
                    <BaseView
                        {...props}
                        beforeItemsContent={
                            <props.beforeItemsContentComponent {...props} part="scrollable" />
                        }
                    />
                </div>

                {props.shouldUseFakeRender && (
                    <div className={props.fixedWrapperClassName}>
                        {/* @ts-ignore */}
                        <BaseView
                            {...props}
                            className={''}
                            beforeItemsContent={
                                <props.beforeItemsContentComponent {...props} part="scrollable" />
                            }
                        />
                    </div>
                )}
            </div>
        );
    })
);

export default React.memo(
    React.forwardRef(function DesktopViewColumnScrollWrapper(
        props: IInnerDeviceViewProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.ReactElement<IInnerDeviceViewProps> {
        const columnScrollContext = React.useContext(ColumnScrollContext);
        const dragScrollContext = React.useContext(DragScrollContext);

        const [wheelHelper] = React.useState(new ColumnScrollUtils.WheelHelper());

        const startDragScroll = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
            const ctx = dragScrollContext.contextRefForHandlersOnly.current;
            ctx.startDragScroll(e);
        }, []);
        const moveDragScroll = React.useCallback((e: React.MouseEvent | React.TouchEvent) => {
            const ctx = dragScrollContext.contextRefForHandlersOnly.current;
            ctx.moveDragScroll(e);
        }, []);
        const stopDragScroll = React.useCallback(() => {
            const ctx = dragScrollContext.contextRefForHandlersOnly.current;
            ctx.stopDragScroll();
        }, []);

        const onWheel = React.useCallback((e: React.WheelEvent) => {
            const ctx = columnScrollContext.contextRefForHandlersOnly.current;
            const currentPosition = ctx.position;
            const newPosition = wheelHelper.calcNewPositionByWheelEvent(e, currentPosition, ctx);

            DebugLogger.contextSetPositionByGridView(newPosition);
            ctx.setPosition(newPosition);
        }, []);

        return (
            <DesktopViewColumnScroll
                ref={ref}
                {...props}
                onWheelCallback={onWheel}
                startDragScroll={startDragScroll}
                moveDragScroll={moveDragScroll}
                stopDragScroll={stopDragScroll}
            />
        );
    })
);
