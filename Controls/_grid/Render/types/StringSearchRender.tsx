import * as React from 'react';

import { Highlight } from 'Controls/baseDecorator';

import { IDataTypeRenderProps } from './interface';

export default function StringSearchRender(
    props: IDataTypeRenderProps<number>
): React.ReactElement {
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
            attrs={{ class: props.className }}
            $wasabyRef={props.$wasabyRef}
        />
    );
}
