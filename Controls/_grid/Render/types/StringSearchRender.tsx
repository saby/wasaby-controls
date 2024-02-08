import * as React from 'react';

import { Highlight } from 'Controls/baseDecorator';

import { IDataTypeRenderProps } from './interface';

export default function StringSearchRender(
    props: IDataTypeRenderProps<number>
): React.ReactElement {
    let className = props.className;

    if (props.textOverflow) {
        className += ` controls-Grid__cell_${props.textOverflow}`;
        if (props.column?.shouldDisplayEditArrow(null)) {
            className += ' controls-Grid__editArrow-cellContent';
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
