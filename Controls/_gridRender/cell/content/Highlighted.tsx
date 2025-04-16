/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { Highlight } from 'Controls/baseDecorator';
import { ITextOverflowProps } from 'Controls/interface';
import { useItemData } from 'Controls/_gridRender/hooks/useItemData';

interface IHighlightedContentRenderProps extends ITextOverflowProps {
    showEditArrow?: boolean;
    highlightedValue?: string;
    displayProperty: string;
    $wasabyRef?: any;
    value?: string;
    tooltip?: string;
    tooltipProperty?: string;
}

/**
 * Приватный платформенный компонент рендера данных в ячейке в режиме поиска.
 * Поволяет подсветить искомую строку в результатах.
 * @private
 */
export function Highlighted(props: IHighlightedContentRenderProps): React.ReactElement {
    const {
        textOverflow,
        showEditArrow,
        highlightedValue,
        displayProperty,
        tooltipProperty,
        $wasabyRef,
    } = props;
    const { renderValues } = useItemData([displayProperty, tooltipProperty]);
    const value = props.value || renderValues[displayProperty];
    const tooltip = props.tooltip || renderValues[tooltipProperty] || value;
    let highlightClassName = '';

    if (textOverflow) {
        highlightClassName +=
            textOverflow === 'ellipsis' ? ' tw-truncate tw-max-w-full' : ' tw-break-words';
        if (showEditArrow) {
            highlightClassName += ` tw-shrink-0 tw-max-w-full controls-Grid__editArrow-overflow-${textOverflow}`;
        }
    }

    return (
        <Highlight
            value={value}
            highlightedValue={highlightedValue as string | string[]}
            tooltip={tooltip}
            className={highlightClassName}
            $wasabyRef={$wasabyRef}
        />
    );
}
