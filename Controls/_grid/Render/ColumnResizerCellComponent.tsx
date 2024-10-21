import * as React from 'react';
import { ResizingLine } from 'Controls/dragnDrop';

import ColumnResizerCell from 'Controls/_baseGrid/display/ColumnResizerCell';

interface IProps {
    column: ColumnResizerCell;
    onOffset: Function;
}

export default function ColumnResizerCellComponent(props: IProps) {
    const onOffset = React.useCallback(
        (offset: number) => {
            const callback = props.column.getResizerOffsetCallback();
            callback(offset);
        },
        [props.column]
    );

    return (
        <ResizingLine
            className={'controls-Grid__resizer-line'}
            direction={'direct'}
            minOffset={props.column.getMinOffset()}
            maxOffset={props.column.getMaxOffset()}
            onOffset={onOffset}
            customEvents={['onOffset']}
        />
    );
}
