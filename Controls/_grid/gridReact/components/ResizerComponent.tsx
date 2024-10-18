/*
 * Файл содержит компонент ресайзера
 */

import * as React from 'react';
import { ResizingLine } from 'Controls/dragnDrop';

export interface IResizerComponentComponentProps {
    minOffset: number;
    maxOffset: number;
    onOffset: (offset: number) => void;
}

/*
 * Компонент ресайзера
 */
export default React.memo(function ResizerComponentComponent(
    props: IResizerComponentComponentProps
): JSX.Element {
    return (
        <ResizingLine
            className="controls-Grid__resizer-line"
            direction="direct"
            minOffset={props.minOffset}
            maxOffset={props.maxOffset}
            onOffset={props.onOffset}
            customEvents={['onOffset']}
        />
    );
});
