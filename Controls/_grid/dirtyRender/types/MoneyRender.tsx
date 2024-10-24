import * as React from 'react';

import { Money } from 'Controls/baseDecorator';

import type { IDataTypeRenderProps } from 'Controls/gridDisplay';

export default function MoneyRender(props: IDataTypeRenderProps<number>): React.ReactElement {
    let className = props.className;

    // TODO Реализовать поддерку textOverflow в компоненте Money
    if (props.textOverflow) {
        className +=
            props.textOverflow === 'ellipsis' ? ' tw-truncate tw-max-w-full' : ' tw-break-words';
        if (props.column?.shouldDisplayEditArrow(null)) {
            className += ' tw-shrink-0 tw-max-w-full';
            className += ` controls-Grid__editArrow-overflow-${props.textOverflow}`;
        }
    }
    return (
        <Money
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
