/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import {
    FIXED_VIEW_WRAPPER_CLASS_NAME,
    HEADER_CELL,
    ITEM,
    NAVIGATION_CELL,
    RESULTS_CELL,
    SCROLLABLE_VIEW_WRAPPER_CLASS_NAME,
} from '../../../../Selectors';
import { QA_SELECTORS } from '../../../../common/data-qa';

import ShadowsStyleRender from './ShadowsStyleRender';
import SizesSynchronizerComponent, { TSelectorMask } from './SizesStyleRender';
import { getBeforeContainerContentSize, getSizesBySelector } from './utils';
import { ISize } from './types';

const SCROLL_CONTAINER_SELECTOR = 'controls-Scroll-ContainerBase';

const getHeaderCellsSelectorMask = (fixedElementSelector: string): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${HEADER_CELL}.${fixedElementSelector}:nth-child($key$)`;
};

const getResultsCellsSelectorMask = (fixedElementSelector: string): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${RESULTS_CELL}.${fixedElementSelector}:nth-child($key$)`;
};

const getNavigationSelectorMask = (): TSelectorMask => {
    return `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL}:nth-child($key$)`;
};

const getFakeNavigationSelectorMask = (): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL}:nth-child($key$)`;
};

const getItemSelectorMask = (fixedElementSelector: string): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${ITEM}[item-key='$key$'] .${fixedElementSelector}`;
};

export type TSynchronizerComponentProps = {
    itemsSizes: ISize[];

    fixedElementSelector: string;
    synchronizeShadow?: boolean;
    hasStickyHeader?: boolean;
    hasStickyTopResults?: boolean;
};

export type TSynchronizerComponentAPI = {
    updateSizes: (container: HTMLDivElement) => void;
};

function SynchronizerComponent(
    props: TSynchronizerComponentProps,
    ref: React.ForwardedRef<TSynchronizerComponentAPI>
): JSX.Element {
    const [beforeHeaderCellsSize, setBeforeHeaderCellsSize] = React.useState<number>(undefined);
    const [headerCellsSize, setHeaderCellsSize] = React.useState<ISize[]>();

    const [beforeResultsCellsSize, setBeforeResultsCellsSize] = React.useState<number>(undefined);
    const [resultsCellsSize, setResultsCellsSize] = React.useState<ISize[]>();

    const [beforeRealNavigationCellsSize, setBeforeRealNavigationCellsSize] =
        React.useState<number>(undefined);
    const [realNavigationCellsSize, setRealNavigationCellsSize] = React.useState<ISize[]>();

    const [beforeFakeNavigationCellsSize, setBeforeFakeNavigationCellsSize] =
        React.useState<number>(undefined);
    const [fakeNavigationCellsSize, setFakeNavigationCellsSize] = React.useState<ISize[]>();

    const updateSizes = React.useCallback(
        (container: HTMLDivElement) => {
            if (container) {
                unstable_batchedUpdates(() => {
                    const newBeforeContainerContentSize = getBeforeContainerContentSize(
                        container,
                        container.closest(`.${SCROLL_CONTAINER_SELECTOR}`)
                    );
                    const header = getSizesBySelector(
                        container,
                        `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${HEADER_CELL}.${props.fixedElementSelector}`
                    );
                    const results = getSizesBySelector(
                        container,
                        `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${RESULTS_CELL}.${props.fixedElementSelector}`
                    );
                    const navigation = getSizesBySelector(
                        container,
                        `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL}`
                    );

                    setHeaderCellsSize(header.sizes);
                    setBeforeHeaderCellsSize(
                        props.hasStickyHeader ? newBeforeContainerContentSize : undefined
                    );

                    setResultsCellsSize(results.sizes);
                    setBeforeResultsCellsSize(
                        props.hasStickyTopResults
                            ? newBeforeContainerContentSize +
                                  (props.hasStickyHeader ? header.fullSize : 0)
                            : undefined
                    );

                    const beforeRealNavigationSize =
                        (props.hasStickyTopResults ? results.fullSize : 0) +
                        (props.hasStickyHeader
                            ? newBeforeContainerContentSize + header.fullSize
                            : 0);
                    setRealNavigationCellsSize(navigation.sizes);
                    setBeforeRealNavigationCellsSize(beforeRealNavigationSize);

                    setFakeNavigationCellsSize(
                        navigation?.sizes?.length ? [navigation.sizes[0]] : []
                    );
                    setBeforeFakeNavigationCellsSize(beforeRealNavigationSize);
                });
            }
        },
        [props.fixedElementSelector, props.hasStickyHeader, props.hasStickyTopResults]
    );

    React.useImperativeHandle(ref, () => ({ updateSizes }), [updateSizes]);

    return (
        <>
            {/* HEADER */}
            {!!headerCellsSize?.length && (
                <SizesSynchronizerComponent
                    dataQa={QA_SELECTORS.HEADER_SIZE_STYLE}
                    keyMask={getHeaderCellsSelectorMask(props.fixedElementSelector)}
                    sizes={headerCellsSize}
                    beforeContentSize={beforeHeaderCellsSize}
                />
            )}

            {/* RESULTS */}
            {!!resultsCellsSize?.length && (
                <SizesSynchronizerComponent
                    dataQa={QA_SELECTORS.RESULTS_SIZE_STYLE}
                    keyMask={getResultsCellsSelectorMask(props.fixedElementSelector)}
                    sizes={resultsCellsSize}
                    beforeContentSize={beforeResultsCellsSize}
                />
            )}

            {/* REAL NAVIGATION */}
            {!!realNavigationCellsSize?.length && (
                <SizesSynchronizerComponent
                    dataQa={QA_SELECTORS.NAVIGATION_SIZE_STYLE}
                    keyMask={getNavigationSelectorMask()}
                    sizes={realNavigationCellsSize}
                    beforeContentSize={beforeRealNavigationCellsSize}
                />
            )}

            {/* FAKE NAVIGATION */}
            {!!fakeNavigationCellsSize?.length && (
                <SizesSynchronizerComponent
                    dataQa={QA_SELECTORS.FAKE_NAVIGATION_SIZE_STYLE}
                    keyMask={getFakeNavigationSelectorMask()}
                    sizes={fakeNavigationCellsSize}
                    beforeContentSize={beforeFakeNavigationCellsSize}
                />
            )}

            {/* ITEMS */}
            {!!props?.itemsSizes?.length && (
                <SizesSynchronizerComponent
                    dataQa={QA_SELECTORS.ITEMS_SIZE_STYLE}
                    keyMask={getItemSelectorMask(props.fixedElementSelector)}
                    sizes={props.itemsSizes}
                />
            )}

            {props.synchronizeShadow && <ShadowsStyleRender />}
        </>
    );
}

const SynchronizerComponentMemoForwarded = React.memo(React.forwardRef(SynchronizerComponent));
export default SynchronizerComponentMemoForwarded;
