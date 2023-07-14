import * as React from 'react';

import { Date } from 'Controls/baseDecorator';

import { IDataTypeRenderProps } from './interface';

export default function DateRender(props: IDataTypeRenderProps<Date>): React.ReactElement {
    // TODO не хватает опции format
    return (
        <Date
            value={props.value}
            highlightedValue={props.highlightedValue}
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
