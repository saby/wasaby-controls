import * as React from 'react';

import { Number } from 'Controls/baseDecorator';

import { IDataTypeRenderProps } from './interface';

export default function NumberRender(props: IDataTypeRenderProps<number>): React.ReactElement {
    return (
        <Number
            value={props.value}
            highlightedValue={props.highlightedValue}
            tooltip={props.tooltip}
            fontSize={props.fontSize}
            fontWeight={props.fontWeight}
            fontColorStyle={props.fontColorStyle}
            onMouseMove={props.onMouseMove}
            onMouseDown={props.onMouseDown}
            onMouseLeave={props.onMouseLeave}
            onTouchStart={props.onTouchStart}
            onClick={props.onClick}
            attrs={{ class: props.className }}
            $wasabyRef={props.$wasabyRef}
            {...props.displayTypeOptions}
        />
    );
}
