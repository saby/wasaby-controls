import * as React from 'react';

import { Number } from 'Controls/baseDecorator';

import { IDataTypeRenderProps } from './interface';

export default function NumberRender(props: IDataTypeRenderProps<number>): React.ReactElement {
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
        >
            <Number
                value={props.value}
                highlightedValue={props.highlightedValue}
                fontSize={props.fontSize}
                fontWeight={props.fontWeight}
                fontColorStyle={props.fontColorStyle}
                attrs={{ class: props.className }}
                {...props.displayTypeOptions}
            />
        </div>
    );
}
