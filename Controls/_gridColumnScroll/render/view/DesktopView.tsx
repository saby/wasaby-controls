/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { default as BaseView } from 'Controls/_grid/gridReact/view/View';
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
    ViewComponent?: React.FunctionComponent;
}

const DesktopViewColumnScroll = React.memo(
    React.forwardRef(function DesktopViewColumnScroll(
        props: IDesktopViewColumnScrollProps,
        ref: React.ForwardedRef<HTMLDivElement>
    ): React.FunctionComponentElement<IDesktopViewColumnScrollProps> {
        const ResolvedViewComponent = props.ViewComponent ?? BaseView;
        return (
            <div
                ref={ref}
                onMouseDown={props.startDragScroll}
                onTouchStart={props.startDragScroll}
                onMouseMove={props.moveDragScroll}
                onTouchMove={props.moveDragScroll}
                onMouseUp={props.stopDragScroll}
                onTouchEnd={props.stopDragScroll}
                onWheel={props.onWheelCallback}
                className={props.viewClassName}
            >
                {props.columnScrollViewMode !== 'unaccented' && (
                    <ShadowsComponent
                        leftShadowClassName={props.leftShadowClassName}
                        rightShadowClassName={props.rightShadowClassName}
                    />
                )}

                <ApplyCssTransformComponent />
                <DragScrollOverlayComponent />
                <ViewportObserverComponent />

                <div className={props.realScrollableWrapperClassName} onFocus={props.onFocus}>
                    <ResolvedViewComponent
                        {...props}
                        beforeItemsContent={
                            <props.beforeItemsContentComponent {...props} part="scrollable" />
                        }
                    />
                </div>

                {props.fakeRequired === 'startFixed' || props.fakeRequired === 'both' ? (
                    <div className={props.fakeFixedStartWrapperClassName}>
                        <ResolvedViewComponent
                            {...props}
                            className={''}
                            beforeItemsContent={
                                <props.beforeItemsContentComponent {...props} part="fixed" />
                            }
                        />
                    </div>
                ) : null}

                {props.fakeRequired === 'endFixed' || props.fakeRequired === 'both' ? (
                    <div className={props.fakeFixedEndWrapperClassName}>
                        <ResolvedViewComponent
                            {...props}
                            className={''}
                            beforeItemsContent={
                                <props.beforeItemsContentComponent {...props} part="fixed" />
                            }
                        />
                    </div>
                ) : null}
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
            if (e.shiftKey || e.deltaX) {
                const ctx = columnScrollContext.contextRefForHandlersOnly.current;
                const currentPosition = ctx.position;
                const newPosition = wheelHelper.calcNewPositionByWheelEvent(
                    e,
                    currentPosition,
                    ctx
                );

                DebugLogger.contextSetPositionByGridView(newPosition);
                if (ctx.autoScrollAnimation !== 'none') {
                    ctx.scrollIntoView(newPosition);
                } else {
                    ctx.setPosition(newPosition);
                }
            }
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
