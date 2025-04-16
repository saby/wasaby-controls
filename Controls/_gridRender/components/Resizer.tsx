/*
 * Файл содержит компонент ресайзера
 */

import { ResizingLine } from 'Controls/dragnDrop';
import { GridColumnResizer } from 'Controls/gridDisplay';
import { IGridSelectors } from 'Controls/_gridColumnScroll/Selectors';

/*
 * Компонент ресайзера
 */
export default function ResizerComponent({
    resizerCollection,
    selectors,
    startColumn,
}: {
    startColumn: number;
    selectors: IGridSelectors;
    resizerCollection: GridColumnResizer;
}): JSX.Element {
    const className = `${selectors.FIXED_ELEMENT} ${selectors.FIXED_CELL} ${selectors.FIXED_START_CELL} controls-Grid__resizer-lineWrapper`;

    return (
        <div
            className={className}
            style={{
                gridColumn: `${startColumn} / ${startColumn + 1}`,
            }}
        >
            <ResizingLine
                className="controls-Grid__resizer-line"
                direction="direct"
                minOffset={Math.max(resizerCollection.getMinOffset(), 0)}
                maxOffset={Math.max(resizerCollection.getMaxOffset(), 0)}
                onOffset={resizerCollection.getResizerOffsetCallback()}
                customEvents={['onOffset']}
            />
        </div>
    );
}
