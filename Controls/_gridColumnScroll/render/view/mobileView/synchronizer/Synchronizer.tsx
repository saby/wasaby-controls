/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { unstable_batchedUpdates } from 'react-dom';

import {
    FIXED_START_VIEW_WRAPPER_CLASS_NAME,
    FIXED_END_VIEW_WRAPPER_CLASS_NAME,
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

// TODO: Свести классы фиксации.
const getHeaderCellsSelectorMask = (
    fixedStartElementSelector: string,
    fixedEndElementSelector: string
): TSelectorMask => {
    return `.${FIXED_START_VIEW_WRAPPER_CLASS_NAME} .${HEADER_CELL}.${fixedStartElementSelector}:nth-child($key$),
    .${FIXED_END_VIEW_WRAPPER_CLASS_NAME} .${HEADER_CELL}.${fixedEndElementSelector}:nth-child($key$)`;
};

const getResultsCellsSelectorMask = (
    fixedStartElementSelector: string,
    fixedEndElementSelector: string
): TSelectorMask => {
    return `.${FIXED_START_VIEW_WRAPPER_CLASS_NAME} .${RESULTS_CELL}.${fixedStartElementSelector}:nth-child($key$), 
    .${FIXED_END_VIEW_WRAPPER_CLASS_NAME} .${RESULTS_CELL}.${fixedEndElementSelector}:nth-child($key$)`;
};

const getNavigationSelectorMask = (): TSelectorMask => {
    return `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL}:nth-child($key$)`;
};

const getFakeNavigationSelectorMask = (): TSelectorMask => {
    return `.${FIXED_START_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL}:nth-child($key$), 
    .${FIXED_END_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL}:nth-child($key$)`;
};

const getItemSelectorMask = (
    fixedStartElementSelector: string,
    fixedEndElementSelector: string
): TSelectorMask => {
    return `.${FIXED_START_VIEW_WRAPPER_CLASS_NAME} .${ITEM}[item-key='$key$'] .${fixedStartElementSelector}, 
    .${FIXED_END_VIEW_WRAPPER_CLASS_NAME} .${ITEM}[item-key='$key$'] .${fixedEndElementSelector}`;
};

export type TSynchronizerComponentProps = {
    itemsSizes?: ISize[];

    fixedStartElementSelector: string;
    fixedEndElementSelector: string;
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
    const [beforeHeaderCellsSize, setBeforeHeaderCellsSize] = React.useState<number | undefined>(
        undefined
    );
    const [headerCellsSize, setHeaderCellsSize] = React.useState<ISize[]>();

    const [beforeResultsCellsSize, setBeforeResultsCellsSize] = React.useState<number | undefined>(
        undefined
    );
    const [resultsCellsSize, setResultsCellsSize] = React.useState<ISize[]>();

    const [beforeRealNavigationCellsSize, setBeforeRealNavigationCellsSize] = React.useState<
        number | undefined
    >(undefined);
    const [realNavigationCellsSize, setRealNavigationCellsSize] = React.useState<ISize[]>();

    const [beforeFakeNavigationCellsSize, setBeforeFakeNavigationCellsSize] = React.useState<
        number | undefined
    >(undefined);
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
                        `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${HEADER_CELL}.${props.fixedStartElementSelector}`
                    );
                    const results = getSizesBySelector(
                        container,
                        `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${RESULTS_CELL}.${props.fixedStartElementSelector}`
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
                    // TODO: тут возможно ошибка и надо установить иногда undefined.
                    setBeforeResultsCellsSize(
                        props.hasStickyTopResults
                            ? (newBeforeContainerContentSize || 0) +
                                  (props.hasStickyHeader ? header.fullSize : 0)
                            : undefined
                    );

                    // TODO: тут возможно ошибка и надо установить иногда undefined.
                    const beforeRealNavigationSize =
                        (props.hasStickyTopResults ? results.fullSize : 0) +
                        (props.hasStickyHeader
                            ? (newBeforeContainerContentSize || 0) + header.fullSize
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
        [
            props.fixedStartElementSelector,
            props.fixedEndElementSelector,
            props.hasStickyHeader,
            props.hasStickyTopResults,
        ]
    );

    React.useImperativeHandle(ref, () => ({ updateSizes }), [updateSizes]);

    return (
        <>
            {/* HEADER */}
            {!!headerCellsSize?.length && (
                <SizesSynchronizerComponent
                    dataQa={QA_SELECTORS.HEADER_SIZE_STYLE}
                    keyMask={getHeaderCellsSelectorMask(
                        props.fixedStartElementSelector,
                        props.fixedEndElementSelector
                    )}
                    sizes={headerCellsSize}
                    beforeContentSize={beforeHeaderCellsSize}
                />
            )}

            {/* RESULTS */}
            {!!resultsCellsSize?.length && (
                <SizesSynchronizerComponent
                    dataQa={QA_SELECTORS.RESULTS_SIZE_STYLE}
                    keyMask={getResultsCellsSelectorMask(
                        props.fixedStartElementSelector,
                        props.fixedEndElementSelector
                    )}
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
                    keyMask={getItemSelectorMask(
                        props.fixedStartElementSelector,
                        props.fixedEndElementSelector
                    )}
                    sizes={props.itemsSizes}
                />
            )}

            {props.synchronizeShadow && <ShadowsStyleRender />}
        </>
    );
}

const SynchronizerComponentMemoForwarded = React.memo(React.forwardRef(SynchronizerComponent));
export default SynchronizerComponentMemoForwarded;
