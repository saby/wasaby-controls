import * as React from 'react';

import { Money } from 'Controls/baseDecorator';

import { IDataTypeRenderProps } from './interface';

export default function MoneyRender(props: IDataTypeRenderProps<number>): React.ReactElement {
    return (
        <Money
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
