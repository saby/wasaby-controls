import * as React from 'react';

import { IDataTypeRenderProps } from './interface';

export default function StringRender(
    props: IDataTypeRenderProps<string>
): React.ReactElement {
    let className = props.className;
    if (props.fontColorStyle) {
        className += ` controls-text-${props.fontColorStyle}`;
    }
    if (props.fontSize) {
        className += ` controls-fontsize-${props.fontSize}`;
    }

    return (
        <div
            title={props.tooltip?.length ? props.tooltip : null}
            className={className}
            onMouseMove={props.onMouseMove}
            onMouseDown={props.onMouseDown}
            onMouseLeave={props.onMouseLeave}
            onTouchStart={props.onTouchStart}
            onClick={props.onClick}
            ref={props.$wasabyRef}
        >
            {props.value?.toString()}
        </div>
    );
}
