import * as React from 'react';
import { getArgs } from 'UICore/Events';
import { ResizingLine } from 'Controls/dragnDrop';

import ColumnResizerCell from '../display/ColumnResizerCell';

interface IProps {
    column: ColumnResizerCell;
    onOffset: Function;
}

export default function ColumnResizerCellComponent(props: IProps) {
    const onOffset = React.useCallback(
        (event: CustomEvent) => {
            const args = getArgs<[]>(event);
            const callback = props.column.getResizerOffsetCallback();
            callback(...args);
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
