import * as React from 'react';
import { ISize, TSelectorMask, SizesSynchronizerComponent } from './SizesSynchronizerComponent';
import {
    FIXED_VIEW_WRAPPER_CLASS_NAME,
    SCROLLABLE_VIEW_WRAPPER_CLASS_NAME,
} from '../../../Selectors';
import { ColumnScrollContext, IColumnScrollContext } from 'Controls/columnScrollReact';

export interface IUseSizesSynchronizerComponentProps {
    itemsSize?: ISize[];
}

const JS_SELECTORS = {
    HEADER_CELL: 'controls-GridReact__header-cell',
    RESULTS_CELL: 'controls-GridReact__results-cell',
    ITEM: 'controls-GridReact__row',
};
const getHeaderCellsSelectorMask = (fixedElementSelector: string): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${JS_SELECTORS.HEADER_CELL}.${fixedElementSelector}:nth-child($key$)`;
};

const getResultsCellsSelectorMask = (fixedElementSelector: string): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${JS_SELECTORS.RESULTS_CELL}.${fixedElementSelector}:nth-child($key$)`;
};

const getItemSelectorMask = (fixedElementSelector: string): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${JS_SELECTORS.ITEM}[item-key='$key$'] .${fixedElementSelector}`;
};

function useSizesSynchronizerComponentInner(
    props: IUseSizesSynchronizerComponentProps,
    selectors: IColumnScrollContext['SELECTORS']
): {
    onResizeCallback: (container: HTMLDivElement) => void;
    SynchronizerComponent: JSX.Element;
} {
    const getSizesBySelector = React.useCallback(
        (container: HTMLDivElement, selector: string) =>
            Array.from(
                container.querySelectorAll<HTMLDivElement>(
                    `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${selector}.${selectors.FIXED_ELEMENT}`
                )
            ).map((cellContainer, index) => ({
                key: `${index + 1}`,
                size: cellContainer.offsetHeight,
            })),
        []
    );

    const [resultsCellsSize, setResultsCellsSize] = React.useState<ISize[]>();
    const [headerCellsSize, setHeaderCellsSize] = React.useState<ISize[]>();

    const onViewResized = React.useCallback((container: HTMLDivElement) => {
        if (container) {
            setHeaderCellsSize(getSizesBySelector(container, JS_SELECTORS.HEADER_CELL));

            setResultsCellsSize(getSizesBySelector(container, JS_SELECTORS.RESULTS_CELL));
        }
    }, []);

    return {
        onResizeCallback: onViewResized,
        SynchronizerComponent: (
            <SizesSynchronizerComponent
                headerCellSelectorMask={getHeaderCellsSelectorMask(selectors.FIXED_ELEMENT)}
                headerCellsSize={headerCellsSize}
                resultsCellSelectorMask={getResultsCellsSelectorMask(selectors.FIXED_ELEMENT)}
                resultsCellsSize={resultsCellsSize}
                itemSelectorMask={getItemSelectorMask(selectors.FIXED_ELEMENT)}
                itemsSize={props.itemsSize}
            />
        ),
    };
}

export function useSizesSynchronizerComponent(props: IUseSizesSynchronizerComponentProps) {
    const ctx = React.useContext(ColumnScrollContext);
    return useSizesSynchronizerComponentInner(props, ctx.SELECTORS);
}
