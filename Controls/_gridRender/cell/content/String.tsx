/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { IGridColumnDataDecoratorProps } from 'Controls/_gridRender/cell/interface/IColumnDataDecoratorProps';
import { EDITOR_SELECTOR_CAPTION } from 'Controls/_gridRender/constants';

/**
 * Приватный платформенный компонент рендера содержимого при displayType=string.
 * @private
 */
const String = React.forwardRef(function (
    props: IGridColumnDataDecoratorProps<string>,
    ref
): React.ReactElement {
    let className = `${EDITOR_SELECTOR_CAPTION}`;
    if (props.className) {
        className += props.className;
    }
    const refs = React.useCallback(
        (el) => {
            props.$wasabyRef?.(el);
            ref?.(el);
        },
        [ref, props.$wasabyRef]
    );

    if (props.textOverflow) {
        className +=
            props.textOverflow === 'ellipsis' ? ' tw-truncate tw-max-w-full' : ' tw-break-words';
        if (props.column?.shouldDisplayEditArrow(null)) {
            className += ' tw-shrink-0 tw-max-w-full';
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

export default String;
