import * as React from 'react';
import { DragScrollContext, IDragScrollContext } from './DragScrollContext';
import { QA_SELECTORS } from '../common/data-qa';

type IDragScrollOverlayComponentProps = Pick<
    IDragScrollContext,
    'moveDragScroll' | 'stopDragScroll' | 'isOverlayShown'
>;

export function DragScrollOverlayComponent(
    props: IDragScrollOverlayComponentProps
): React.FunctionComponentElement<IDragScrollOverlayComponentProps> {
    const className =
        'controls-ColumnScrollReact__DragScrollOverlay ' +
        (props.isOverlayShown ? 'tw-block' : 'tw-hidden');

    return (
        <div
            data-qa={QA_SELECTORS.DRAG_SCROLL_OVERLAY}
            className={className}
            onMouseMove={(e) => {
                return props.moveDragScroll(e);
            }}
            onMouseUp={() => {
                return props.stopDragScroll();
            }}
            onMouseLeave={() => {
                return props.stopDragScroll();
            }}
        />
    );
}

function DragScrollOverlayComponentConsumer(): React.FunctionComponentElement<IDragScrollOverlayComponentProps> {
    const context = React.useContext(DragScrollContext);
    return <DragScrollOverlayComponent {...context} />;
}

export default React.memo(DragScrollOverlayComponentConsumer);
