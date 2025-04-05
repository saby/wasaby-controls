/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';

import { Money as DMoney } from 'Controls/baseDecorator';
import { IGridColumnDataDecoratorProps } from 'Controls/_gridRender/cell/interface/IColumnDataDecoratorProps';

/**
 * Приватный платформенный компонент рендера содержимого при displayType=money.
 * @private
 */
export default function Money(props: IGridColumnDataDecoratorProps<number>): React.ReactElement {
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

    const tooltip = props.column?.contents.get(props.column.getTooltipProperty()) ?? null;

    return (
        <DMoney
            value={props.value}
            tooltip={tooltip}
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
