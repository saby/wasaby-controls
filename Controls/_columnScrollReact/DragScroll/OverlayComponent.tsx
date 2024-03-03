/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { DragScrollContext, IDragScrollContext } from './DragScrollContext';
import { QA_SELECTORS } from '../common/data-qa';
import { ColumnScrollContext } from '../context/ColumnScrollContext';

type IDragScrollOverlayComponentProps = Pick<
    IDragScrollContext,
    'moveDragScroll' | 'stopDragScroll' | 'isOverlayShown'
> & {
    cursor?: 'grabbing' | 'default';
};

export function DragScrollOverlayComponent(
    props: IDragScrollOverlayComponentProps
): React.FunctionComponentElement<IDragScrollOverlayComponentProps> {
    const className =
        'controls-ColumnScrollReact__DragScrollOverlay ' +
        (props.cursor === 'grabbing'
            ? 'controls-ColumnScrollReact__DragScrollOverlay_grabbing '
            : '') +
        (props.isOverlayShown ? 'tw-block' : 'tw-hidden');

    return (
        <div
            data-qa={QA_SELECTORS.DRAG_SCROLL_OVERLAY}
            className={className}
            onMouseMove={(e) => {
                props.moveDragScroll(e);
            }}
            onMouseUp={() => {
                props.stopDragScroll();
            }}
            onMouseLeave={() => {
                props.stopDragScroll();
            }}
        />
    );
}

function DragScrollOverlayComponentConsumer(): React.FunctionComponentElement<IDragScrollOverlayComponentProps> {
    const context = React.useContext(DragScrollContext);
    const scrollContext = React.useContext(ColumnScrollContext);
    return (
        <DragScrollOverlayComponent
            {...context}
            cursor={scrollContext.isScrollbarDragging ? 'default' : 'grabbing'}
        />
    );
}

export default React.memo(DragScrollOverlayComponentConsumer);
