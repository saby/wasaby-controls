import * as React from 'react';
import { QA_SELECTORS } from '../../../common/data-qa';

type TKeyMask = '$key$';
const KEY_MASK: TKeyMask = '$key$';

export type TSelectorMask = `${string}${TKeyMask}${string}`;

export type ISize = {
    key: string;
    size: number;
};

export interface IMobileViewSizesSynchronizerComponentProps {
    headerCellSelectorMask: TSelectorMask;
    headerCellsSize: ISize[];

    resultsCellSelectorMask: TSelectorMask;
    resultsCellsSize: ISize[];

    itemSelectorMask: TSelectorMask;
    itemsSize: ISize[];
}

function getSize(mask: TSelectorMask, sizes: ISize[]): string {
    if (!mask || !sizes || !sizes.length) {
        return '';
    }

    return sizes
        .map((size) => {
            const selector = mask.replace(KEY_MASK, size.key);
            return `${selector} { height: ${size.size}px; }`;
        })
        .join('\n');
}

// TODO: #Test на весь этот механизм
export function SizesSynchronizerComponent(
    props: IMobileViewSizesSynchronizerComponentProps
): JSX.Element {
    const headerStyle = React.useMemo(
        () => getSize(props.headerCellSelectorMask, props.headerCellsSize),
        [props.headerCellSelectorMask, props.headerCellsSize]
    );
    const resultsStyle = React.useMemo(
        () => getSize(props.resultsCellSelectorMask, props.resultsCellsSize),
        [props.resultsCellSelectorMask, props.resultsCellsSize]
    );
    const itemsStyle = React.useMemo(
        () => getSize(props.itemSelectorMask, props.itemsSize),
        [props.itemSelectorMask, props.itemsSize]
    );

    return (
        <>
            <style data-qa={QA_SELECTORS.HEADER_SIZE_STYLE}>{headerStyle}</style>
            <style data-qa={QA_SELECTORS.RESULTS_SIZE_STYLE}>{resultsStyle}</style>
            <style data-qa={QA_SELECTORS.ITEMS_SIZE_STYLE}>{itemsStyle}</style>
        </>
    );
}

export default React.memo(SizesSynchronizerComponent);
