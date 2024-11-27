import * as React from 'react';

import { Highlight } from 'Controls/baseDecorator';

import type { IDataTypeRenderProps } from 'Controls/gridDisplay';

export default function StringSearchRender(
    props: IDataTypeRenderProps<number>
): React.ReactElement {
    let className = props.className;

    if (props.textOverflow) {
        className +=
            props.textOverflow === 'ellipsis' ? ' tw-truncate tw-max-w-full' : ' tw-break-words';
        if (props.column?.shouldDisplayEditArrow(null)) {
            className += ' tw-shrink-0 tw-max-w-full';
            className += ` controls-Grid__editArrow-overflow-${props.textOverflow}`;
        }
    }

    return (
        <Highlight
            value={props.value}
            highlightedValue={props.highlightedValue as string | string[]}
            tooltip={props.tooltip}
            onMouseMove={props.onMouseMove}
            onMouseDown={props.onMouseDown}
            onMouseLeave={props.onMouseLeave}
            onTouchStart={props.onTouchStart}
            onClick={props.onClick}
            attrs={{ class: className }}
            $wasabyRef={props.$wasabyRef}
        />
    );
}
