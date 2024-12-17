import * as React from 'react';
import type { IDataTypeRenderProps } from 'Controls/_baseGrid/display/interface/IDataTypeRenderProps';

const StringRender = React.forwardRef(function (
    props: IDataTypeRenderProps<string>,
    ref
): React.ReactElement {
    let className = props.className;
    const refs = React.useCallback(
        (el) => {
            props.$wasabyRef?.(el);
            ref?.(el);
        },
        [ref, props.$wasabyRef]
    );

    if (props.textOverflow) {
        className += ` controls-Grid__cell_${props.textOverflow}`;
        if (props.column?.shouldDisplayEditArrow(null)) {
            className += ' controls-Grid__editArrow-cellContent';
            className += ` controls-Grid__editArrow-overflow-${props.textOverflow}`;
        }
    }
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
            ref={refs}
        >
            {props.value?.toString()}
        </div>
    );
});

export default StringRender;
