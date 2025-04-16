/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';

import { Number as DNumber } from 'Controls/baseDecorator';
import { IGridColumnDataDecoratorProps } from 'Controls/_gridRender/cell/interface/IColumnDataDecoratorProps';
import { EDITOR_SELECTOR_CAPTION } from 'Controls/_gridRender/constants';

/**
 * Приватный платформенный компонент рендера содержимого при displayType=number.
 * @private
 */
export default function Number(props: IGridColumnDataDecoratorProps<number>): React.ReactElement {
    let className = `${EDITOR_SELECTOR_CAPTION}`;
    if (props.className) {
        className += props.className;
    }
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
            <DNumber
                value={props.value}
                highlightedValue={props.highlightedValue}
                fontSize={props.fontSize}
                fontWeight={props.fontWeight}
                fontColorStyle={props.fontColorStyle}
                attrs={{ class: className }}
                tooltip={props.tooltip}
                {...props.displayTypeOptions}
            />
        </div>
    );
}
