import * as React from 'react';
import { Highlight } from 'Controls/baseDecorator';
import { ITextOverflowProps } from 'Controls/interface';
import { useItemData } from 'Controls/_grid/gridReact/hooks/useItemData';

interface IHighlightedContentRenderProps extends ITextOverflowProps {
    showEditArrow?: boolean;
    highlightedValue?: string;
    displayProperty: string;
    $wasabyRef?: any;
}

export function HighlightedContentRender(
    props: IHighlightedContentRenderProps
): React.ReactElement {
    const { textOverflow, showEditArrow, highlightedValue, displayProperty, $wasabyRef } = props;

    const { renderValues } = useItemData([displayProperty]);
    const value = renderValues[displayProperty];
    let highlightClassName = '';

    if (textOverflow) {
        highlightClassName += ` controls-Grid__cell_${textOverflow}`;
        if (showEditArrow) {
            highlightClassName += ' controls-Grid__editArrow-cellContent';
            highlightClassName += ` controls-Grid__editArrow-overflow-${textOverflow}`;
        }
    }

    return (
        <Highlight
            value={value}
            highlightedValue={highlightedValue as string | string[]}
            tooltip={value}
            className={highlightClassName}
            $wasabyRef={$wasabyRef}
        />
    );
}
