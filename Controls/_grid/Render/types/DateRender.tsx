import * as React from 'react';

import { Date } from 'Controls/baseDecorator';

import { IDataTypeRenderProps } from './interface';

export default function DateRender(props: IDataTypeRenderProps<Date>): React.ReactElement {
    // TODO не хватает опции format
    let className = props.className;

    // TODO Реализовать поддерку textOverflow в компоненте Date
    if (props.textOverflow) {
        className += ` controls-Grid__cell_${props.textOverflow}`;
        if (props.column?.shouldDisplayEditArrow(null)) {
            className += ' controls-Grid__editArrow-cellContent';
            className += ` controls-Grid__editArrow-overflow-${props.textOverflow}`;
        }
    }

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
            attrs={{ class: className }}
            $wasabyRef={props.$wasabyRef}
            {...props.displayTypeOptions}
        />
    );
}
