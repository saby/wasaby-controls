import * as React from 'react';
import {
    ISize,
    TSelectorMask,
    SizesSynchronizerComponent,
    IMobileViewSizesSynchronizerComponentProps,
} from './SizesSynchronizerComponent';
import {
    FIXED_VIEW_WRAPPER_CLASS_NAME,
    SCROLLABLE_VIEW_WRAPPER_CLASS_NAME,
    HEADER_CELL,
    NAVIGATION_CELL,
    RESULTS_CELL,
    ITEM
} from '../../../Selectors';
import { ColumnScrollContext, IColumnScrollContext } from 'Controls/columnScrollReact';
import { _StickyGroupContext } from 'Controls/stickyBlock';

interface IUseSizesSynchronizerComponentPropsBase
    extends Pick<
        IMobileViewSizesSynchronizerComponentProps,
        'hasStickyHeader' | 'hasStickyTopResults'
    > {
    itemsSize?: ISize[];
}

interface IUseSizesSynchronizerComponentInnerProps
    extends IUseSizesSynchronizerComponentPropsBase,
        Pick<IMobileViewSizesSynchronizerComponentProps, 'hasShadow'> {}

export interface IUseSizesSynchronizerComponentProps
    extends IUseSizesSynchronizerComponentPropsBase {
    canShowShadow?: boolean;
}

const SCROLL_CONTAINER_SELECTOR = 'controls-Scroll-ContainerBase';

const NAVIGATION_SIZE: ISize[] = [
    {
        key: '1',
        size: 'auto',
    },
    {
        key: '2',
        size: 'auto',
    },
];

const FAKE_NAVIGATION_SIZE = [NAVIGATION_SIZE[0]];

const getHeaderCellsSelectorMask = (fixedElementSelector: string): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${HEADER_CELL}.${fixedElementSelector}:nth-child($key$)`;
};

const getResultsCellsSelectorMask = (fixedElementSelector: string): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${RESULTS_CELL}.${fixedElementSelector}:nth-child($key$)`;
};

const getItemSelectorMask = (fixedElementSelector: string): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${ITEM}[item-key='$key$'] .${fixedElementSelector}`;
};

const getNavigationSelectorMask = (): TSelectorMask => {
    return `.${SCROLLABLE_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL}:nth-child($key$)`;
};

const getFakeNavigationSelectorMask = (): TSelectorMask => {
    return `.${FIXED_VIEW_WRAPPER_CLASS_NAME} .${NAVIGATION_CELL}:nth-child($key$)`;
};

function getBeforeGridContentSize(container: HTMLDivElement): number {
    const scrollContainer = container.closest(`.${SCROLL_CONTAINER_SELECTOR}`);

    if (scrollContainer) {
        const top =
            container.getBoundingClientRect().top +
            scrollContainer.scrollTop -
            scrollContainer.getBoundingClientRect().top;
        return top === 0 ? undefined : top;
    }
}

function useSizesSynchronizerComponentInner(
    props: IUseSizesSynchronizerComponentInnerProps,
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
    const [beforeGridContentSize, setBeforeGridContentSize] = React.useState<number>(0);


    const onViewResized = React.useCallback((container: HTMLDivElement) => {
        if (container) {
            setBeforeGridContentSize(getBeforeGridContentSize(container));
            setHeaderCellsSize(getSizesBySelector(container, HEADER_CELL));
            setResultsCellsSize(getSizesBySelector(container, RESULTS_CELL));
        }
    }, []);

    return {
        onResizeCallback: onViewResized,
        SynchronizerComponent: (
            <SizesSynchronizerComponent
                beforeContentSize={beforeGridContentSize}
                headerCellSelectorMask={getHeaderCellsSelectorMask(selectors.FIXED_ELEMENT)}
                headerCellsSize={headerCellsSize}
                resultsCellSelectorMask={getResultsCellsSelectorMask(selectors.FIXED_ELEMENT)}
                resultsCellsSize={resultsCellsSize}
                itemSelectorMask={getItemSelectorMask(selectors.FIXED_ELEMENT)}
                itemsSize={props.itemsSize}
                fakeNavigationSelectorMask={getFakeNavigationSelectorMask()}
                fakeNavigationSize={FAKE_NAVIGATION_SIZE}
                navigationSelectorMask={getNavigationSelectorMask()}
                navigationSize={NAVIGATION_SIZE}
                hasStickyHeader={props.hasStickyHeader}
                hasStickyTopResults={props.hasStickyTopResults}
                hasShadow={props.hasShadow}
            />
        ),
    };
}

export function useSizesSynchronizerComponent(props: IUseSizesSynchronizerComponentProps) {
    const ctx = React.useContext(ColumnScrollContext);
    const scrollTop = React.useContext(_StickyGroupContext)?.scrollState?.scrollTop;
    const hasShadow = typeof scrollTop === 'number' ? scrollTop !== 0 : false;

    return useSizesSynchronizerComponentInner(
        {
            ...props,
            hasShadow: props.canShowShadow && hasShadow,
        },
        ctx.SELECTORS
    );
}
