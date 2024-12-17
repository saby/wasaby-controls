/**
 * @kaizen_zone e0faa54f-0242-4b8d-a3c5-10c9d5cf59b8
 */
import * as React from 'react';
import { ScrollControllerLib } from 'Controls/listsCommonLogic';
import { _ListScrollContext, IListScrollContextState } from 'Controls/scroll';
import { GridCollection } from 'Controls/baseGrid';
import type { IGridViewProps } from 'Controls/gridReact';
import type { Collection } from 'Controls/display';
import type { IContainerNewProps as IListContainerConnectedProps } from 'Controls/baseList';
import { getDimensions } from 'Controls/sizeUtils';

interface IScrollControllerWrapperProps
    extends IGridViewProps,
        Pick<IListContainerConnectedProps, 'storeId'> {
    children: React.ReactElement;
    listScrollContextState: IListScrollContextState;
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

function getEdgeItem(listScrollContextState: IListScrollContextState, collection: GridCollection) {
    const edge: ScrollControllerLib.IDirectionNew = 'backward';
    const viewportSize = listScrollContextState.getViewportRect().height;
    const scrollPosition = listScrollContextState.getVerticalScrollPosition();
    const range = { startIndex: 0, endIndex: collection.getCount() };
    const placeholders = { backward: 0, forward: 0 };
    const itemsSizes = getItemsSizes();
    const validateItem: ScrollControllerLib.IValidateItemFunction = (itemKey) => {
        return ScrollControllerLib.isValidEdgeItem(itemKey, collection as unknown as Collection);
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

    if (
        edgeItem.key === newEdgeItem.key &&
        edgeItem.border === newEdgeItem.border &&
        edgeItem.borderDistance === newEdgeItem.borderDistance
    ) {
        return false;
    }

    return true;
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
            rootItemsCount: this.props.collection.getRoot().getChildren().getCount(),
            allItemsCount: this.props.collection.getCount(),
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
        const derivedState: IScrollControllerWrapperState = {};
        const nextCollectionVersion = nextProps.collection.getVersion();

        if (prevState.collectionVersion !== nextCollectionVersion) {
            derivedState.collectionVersion = nextCollectionVersion;
            derivedState.rootItemsCount = nextProps.collection.getRoot().getChildren().getCount();
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
        return this.props.children;
    }
}

export default function ScrollControllerWrapper(props: IScrollControllerWrapperProps) {
    const listScrollContextState = React.useContext(
        _ListScrollContext
    ) as unknown as IListScrollContextState;
    return (
        <ScrollControllerInnerWrapper {...props} listScrollContextState={listScrollContextState} />
    );
}
