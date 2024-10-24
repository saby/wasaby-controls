/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { ScrollControllerLib } from 'Controls/listsCommonLogic';
import { _ListScrollContext, IListScrollContextState } from 'Controls/scroll';

import type { IAbstractRenderProps } from './interface/IAbstractRender';
import { getDimensions } from 'Controls/sizeUtils';
import { IViewTriggerProps } from 'Controls/_grid/gridReact/view/interface';

interface IScrollControllerWrapperProps {
    children: React.ReactElement;
    listScrollContextState: IListScrollContextState;
    collection: IAbstractRenderProps['collection'];
}

const ITEMS_SELECTOR = '.controls-ListView__itemV';
const ITEMS_CONTAINER_SELECTOR = '.controls-Grid__itemsContainer';

function getItemsSizes(): ScrollControllerLib.IItemsSizes {
    const itemsContainer = document.querySelector(ITEMS_CONTAINER_SELECTOR) as HTMLElement;
    const itemsSizes: ScrollControllerLib.IItemsSizes = [];

    if (itemsContainer) {
        itemsContainer.querySelectorAll(ITEMS_SELECTOR).forEach((element, index) => {
            const itemSizes: ScrollControllerLib.IItemSize = {
                key: element.getAttribute('item-key') as string,
                offset: index === 0 ? 0 : itemsSizes[index - 1].offset + itemsSizes[index - 1].size,
                size: getDimensions(element as HTMLElement).height,
            };

            itemsSizes.push(itemSizes);
        });
    }

    return itemsSizes;
}

function getEdgeItem(
    listScrollContextState: IListScrollContextState,
    collection: IAbstractRenderProps['collection']
) {
    const edge: ScrollControllerLib.IDirectionNew = 'backward';
    const viewportSize = listScrollContextState.getViewportRect().height;
    const scrollPosition = listScrollContextState.getVerticalScrollPosition();
    const range = { startIndex: 0, endIndex: collection.getCount() };
    const placeholders = { backward: 0, forward: 0 };
    const itemsSizes = getItemsSizes();
    const validateItem: ScrollControllerLib.IValidateItemFunction = (itemKey) => {
        return ScrollControllerLib.isValidEdgeItem(itemKey, collection);
    };
    const offset = 0;

    return ScrollControllerLib.CalculatorUtil.getEdgeVisibleItem({
        viewportSize,
        scrollPosition,
        direction: edge,
        range,
        placeholders,
        itemsSizes,
        validateItem,
        offset,
    });
}

function isNeedRestoreScroll(
    edgeItem: ScrollControllerLib.IEdgeItem,
    newEdgeItem: ScrollControllerLib.IEdgeItem
): boolean {
    if (edgeItem === newEdgeItem || (!edgeItem && !newEdgeItem)) {
        return false;
    }

    if ((!edgeItem && newEdgeItem) || (edgeItem && !newEdgeItem)) {
        return false;
    }

    return !(
        edgeItem.key === newEdgeItem.key &&
        edgeItem.border === newEdgeItem.border &&
        edgeItem.borderDistance === newEdgeItem.borderDistance
    );
}

function restoreScroll(
    listScrollContextState: IListScrollContextState,
    edgeItem: ScrollControllerLib.IEdgeItem
) {
    const viewportSize = listScrollContextState.getViewportRect().height;
    const scrollPosition = listScrollContextState.getVerticalScrollPosition();
    const itemsSizes = getItemsSizes();

    const restoredScrollPosition = ScrollControllerLib.CalculatorUtil.getScrollPositionToEdgeItem({
        edgeItem,
        scrollPosition,
        viewportSize,
        itemsSizes,
        placeholders: { backward: 0, forward: 0 },
    });

    listScrollContextState.scrollTo(restoredScrollPosition);
}

interface IScrollControllerInnerWrapperSnapshot {
    edgeItem?: ScrollControllerLib.IEdgeItem;
    edge?: ScrollControllerLib.IDirectionNew;
}

interface IScrollControllerWrapperState {
    collectionVersion?: number;
    rootItemsCount?: number;
    allItemsCount?: number;
    viewTriggerProps: IViewTriggerProps;
}

/**
 * Компонент, управляющий положением скролла.
 * @private
 */
class ScrollControllerInnerWrapper extends React.Component<
    IScrollControllerWrapperProps,
    IScrollControllerWrapperState
> {
    constructor(props: IScrollControllerWrapperProps) {
        super(props);

        this.state = {
            collectionVersion: props.collection.getVersion(),
            // @ts-ignore
            rootItemsCount: this.props.collection.getRoot
                ? // @ts-ignore
                  this.props.collection.getRoot().getChildren().getCount()
                : this.props.collection.getCount(),
            allItemsCount: this.props.collection.getCount(),
            // todo Сюда необходимо внести код, рассчитывающий отступ для триггера. Сейчас этот код расположен в
            // "Controls\_baseList\Controllers\ScrollController\ObserverController\ObserversController.ts"
            viewTriggerProps: {
                offset: 1,
            },
        };
    }

    getSnapshotBeforeUpdate(
        prevProps: IScrollControllerWrapperProps,
        prevState: IScrollControllerWrapperState
    ): IScrollControllerInnerWrapperSnapshot {
        const snapshot: IScrollControllerInnerWrapperSnapshot = {};

        if (prevState.collectionVersion !== this.state.collectionVersion) {
            snapshot.edgeItem = getEdgeItem(prevProps.listScrollContextState, prevProps.collection);
        }
        return snapshot;
    }

    static getDerivedStateFromProps(
        nextProps: IScrollControllerWrapperProps,
        prevState: IScrollControllerWrapperState
    ) {
        const derivedState: Partial<IScrollControllerWrapperState> = {};
        const nextCollectionVersion = nextProps.collection.getVersion();

        if (prevState.collectionVersion !== nextCollectionVersion) {
            derivedState.collectionVersion = nextCollectionVersion;
            // @ts-ignore
            derivedState.rootItemsCount = nextProps.collection.getRoot
                ? // @ts-ignore
                  nextProps.collection.getRoot().getChildren().getCount()
                : nextProps.collection.getCount();
            derivedState.allItemsCount = nextProps.collection.getCount();
        }

        return derivedState;
    }

    componentDidUpdate(
        prevProps: IScrollControllerWrapperProps,
        _: unknown,
        snapshot: IScrollControllerInnerWrapperSnapshot
    ) {
        if (snapshot && snapshot.edgeItem) {
            const newEdgeItem = getEdgeItem(prevProps.listScrollContextState, prevProps.collection);
            if (isNeedRestoreScroll(snapshot.edgeItem, newEdgeItem)) {
                restoreScroll(prevProps.listScrollContextState, snapshot.edgeItem);
            }
        }
    }

    render() {
        return React.cloneElement(this.props.children, {
            viewTriggerProps: this.state.viewTriggerProps,
        });
    }
}

export function ScrollControllerWrapper(
    props: Omit<IScrollControllerWrapperProps, 'listScrollContextState'>
) {
    const listScrollContextState = React.useContext(
        _ListScrollContext
    ) as unknown as IListScrollContextState;
    return (
        <ScrollControllerInnerWrapper {...props} listScrollContextState={listScrollContextState} />
    );
}
