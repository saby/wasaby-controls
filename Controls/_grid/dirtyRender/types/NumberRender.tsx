import * as React from 'react';

import { Number } from 'Controls/baseDecorator';

import type { IDataTypeRenderProps } from 'Controls/gridDisplay';

export default function NumberRender(props: IDataTypeRenderProps<number>): React.ReactElement {
    let className = props.className;
    const textOverflowClass =
        props.textOverflow === 'ellipsis' ? ' tw-truncate tw-max-w-full' : ' tw-break-words';

    if (props.textOverflow && props.column?.shouldDisplayEditArrow(null)) {
        className += ' tw-shrink-0 tw-max-w-full';
        className += ` controls-Grid__editArrow-overflow-${props.textOverflow}`;
    }
    return (
        <div
            ref={props.$wasabyRef}
            onMouseDown={(e) => {
                return props.onMouseDown?.(e);
            }}
            onMouseMove={(e) => {
                return props.onMouseMove?.(e);
            }}
            onMouseLeave={(e) => {
                return props.onMouseLeave?.(e);
            }}
            onClick={(e) => {
                return props.onClick?.(e);
            }}
            onTouchStart={(e) => {
                return props.onTouchStart?.(e);
            }}
            className={textOverflowClass}
        >
            <Number
                value={props.value}
                highlightedValue={props.highlightedValue}
                fontSize={props.fontSize}
                fontWeight={props.fontWeight}
                fontColorStyle={props.fontColorStyle}
                attrs={{ class: className }}
                {...props.displayTypeOptions}
            />
        </div>
    );
}
