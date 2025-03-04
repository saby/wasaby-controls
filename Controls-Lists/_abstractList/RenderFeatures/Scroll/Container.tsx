/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import * as React from 'react';
import { ScrollControllerLib } from 'Controls/listsCommonLogic';
import { _ListScrollContext, IListScrollContextState } from 'Controls/scroll';
import type { IAbstractRenderProps } from '../../interface/IAbstractRender';
import type { IAbstractListScrollAPI } from '../../interface/IAbstractComponentAPI';
import { getDimensions } from 'Controls/sizeUtils';
import { IViewTriggerProps } from 'Controls/gridRender';
import { IAbstractListAPI, IAbstractListState } from 'Controls-DataEnv/abstractList';
import { TItemKey } from 'Controls/display';
import ScrollPaging from './ScrollPaging';
import { TemplateFunction } from 'UICommon/Base';

type TContainerRef = React.MutableRefObject<HTMLElement | null>;

export interface IScrollControllerWrapperProps {
    children: React.ReactElement;
    listScrollContextState: IListScrollContextState;
    collection: IAbstractRenderProps['collection'];
    virtualScrollConfig?: ScrollControllerLib.IVirtualScrollConfig;
    viewModelAPI: IAbstractListAPI;
    collectionVersion: number;
    navigation?: IAbstractListState['navigation'];
    pagingLeftTemplate?: TemplateFunction | string;
    pagingRightTemplate?: TemplateFunction | string;
    pagingContentTemplate?: TemplateFunction | string;
    listContainerRef: TContainerRef;
    apiRef: React.MutableRefObject<IAbstractListScrollAPI | undefined>;
    resetScroll?: boolean;
}

const ITEMS_SELECTOR = '.controls-ListView__itemV';
const MIN_SCROLL_PAGING_SHOW_PROPORTION = 2;
const MAX_SCROLL_PAGING_HIDE_PROPORTION = 1;

function getItemsSizes(
    itemsContainer: HTMLElement,
    state: IScrollControllerWrapperState
): ScrollControllerLib.IItemsSizes {
    const itemsSizes: ScrollControllerLib.IItemsSizes = state.itemsSizes || [];

    const position = state.range.startIndex;

    let sizeOfHiddenItems = 0;
    const firstDisplayedItem = itemsSizes[position];
    const lastHiddenItem = itemsSizes[position - 1];
    if (firstDisplayedItem && lastHiddenItem) {
        const offsetBetweenItems =
            firstDisplayedItem.offset - (lastHiddenItem.offset + lastHiddenItem.size);
        // При скрытии записи мы скрываем марджин только у одной записи,
        // а оффсет между записями складывается из марджинов обеих записей
        sizeOfHiddenItems = firstDisplayedItem.offset - offsetBetweenItems / 2;
    }

    if (itemsContainer) {
        const itemsContainerTop = getDimensions(itemsContainer).top;
        const itemsElements = itemsContainer.querySelectorAll(ITEMS_SELECTOR);
        itemsElements.forEach((element: Element, index: number) => {
            const itemTop = getDimensions(element as HTMLElement, true).top;
            const itemOffsetToItemsContainer = itemTop - itemsContainerTop;
            const offset = itemOffsetToItemsContainer + sizeOfHiddenItems;

            const itemSize: ScrollControllerLib.IItemSize = {
                key: element.getAttribute('item-key') as string,
                offset,
                size: getDimensions(element as HTMLElement).height,
            };

            itemsSizes[index + position] = itemSize;
        });
        const lastItem = itemsSizes[itemsSizes.length - 1];
        for (let i = position + itemsSizes.length; i < state.range.endIndex; i++) {
            itemsSizes[i] = itemsSizes[i] || {
                key: '',
                offset: lastItem.offset,
                size: 0,
            };
        }
    }

    return itemsSizes;
}

function getEdgeItem(
    listScrollContextState: IListScrollContextState,
    collection: IAbstractRenderProps['collection'],
    state: IScrollControllerWrapperState,
    direction: ScrollControllerLib.IDirectionNew = 'backward'
) {
    const edge: ScrollControllerLib.IDirectionNew = direction;
    const viewportSize = listScrollContextState.getViewportRect().height;
    const scrollPosition = listScrollContextState.getVerticalScrollPosition();
    const range = state.range;
    const placeholders = state.placeholders;
    const itemsSizes = getItemsSizes(state.itemsContainer as HTMLElement, state);
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

function getSegmentSize(virtualScrollConfig?: ScrollControllerLib.IVirtualScrollConfig) {
    const pageSize = virtualScrollConfig?.pageSize || 0;
    return virtualScrollConfig?.segmentSize ?? Math.ceil(pageSize / 4);
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
    edgeItem: ScrollControllerLib.IEdgeItem,
    state: IScrollControllerWrapperState
) {
    const viewportSize = listScrollContextState.getViewportRect().height;
    const scrollPosition = listScrollContextState.getVerticalScrollPosition();
    const itemsSizes = getItemsSizes(state.itemsContainer as HTMLElement, state);

    const restoredScrollPosition = ScrollControllerLib.CalculatorUtil.getScrollPositionToEdgeItem({
        edgeItem,
        scrollPosition,
        viewportSize,
        itemsSizes,
        placeholders: state.placeholders,
    });
    state.scrollState.position = restoredScrollPosition;
    listScrollContextState.scrollTo(restoredScrollPosition);
}

function shiftRangeToVirtualScrollPosition(
    scrollPosition: number,
    state: IScrollControllerWrapperState,
    props: IScrollControllerWrapperProps
) {
    const range = ScrollControllerLib.CalculatorUtil.getRangeByScrollPosition({
        itemsSizes: state.itemsSizes,
        pageSize: props.virtualScrollConfig?.pageSize || state.allItemsCount,
        scrollPosition,
        totalCount: state.allItemsCount,
        triggerOffset: state.viewTriggerProps.offset,
    });

    const placeholders = ScrollControllerLib.CalculatorUtil.getPlaceholdersByRange({
        range,
        totalCount: state.allItemsCount,
        itemsSizes: fillItemSizesByRange(state.itemsSizes, range, state.allItemsCount),
        itemsRenderedOutsideRange: [],
        calcByOffset: true,
        contentSizeBeforeList: 0,
    });

    // При скролле к виртуальной позиции нельзя сказать куда сместился диапазон, т.к. по сути это поведение схожее
    // с resetItems. Мы просто создаем новый диапазон, а не смещаем старый. Поэтому shiftDirection = null;
    // Это нужно чтобы мы не востанавливали скролл.
    return { range, placeholders };
}

function fillItemSizesByRange(
    itemsSizes: ScrollControllerLib.IItemSize[],
    range: ScrollControllerLib.IItemsRange,
    count: number
) {
    const lastItem = itemsSizes[itemsSizes.length - 1];
    for (let i = range.endIndex; i < count; i++) {
        itemsSizes[i] = itemsSizes[i] || {
            key: '',
            offset: lastItem.offset,
            size: 0,
        };
    }
    return itemsSizes;
}

interface IScrollControllerInnerWrapperSnapshot {
    edgeItem?: ScrollControllerLib.IEdgeItem;
    edge?: ScrollControllerLib.IDirectionNew;
}
interface ITriggerState {
    top: boolean;
    bottom: boolean;
}

interface IScrollControllerWrapperState {
    collectionVersion?: number;
    rootItemsCount?: number;
    allItemsCount: number;
    viewTriggerProps: IViewTriggerProps;
    range: ScrollControllerLib.IItemsRange;
    itemsContainer?: HTMLElement;
    itemsSizes: ScrollControllerLib.IItemSize[];
    placeholders: ScrollControllerLib.IPlaceholders;
    pagingVisible: boolean;
    triggersState: ITriggerState;
    contextEvent?: IListScrollContextState['contextEvent'] | null;
    scrollCallback?: Function | null;
    scrollState: { position: number };
    disableVirtualScroll: boolean;
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

        this.onViewTriggerVisibilityChanged = this.onViewTriggerVisibilityChanged.bind(this);
        this.itemsContainerReadyCallback = this.itemsContainerReadyCallback.bind(this);
        const disableVirtualScroll =
            !!props.collection['[Controls/_tile/Tile]' as keyof typeof props.collection];
        const totalCount = props.collection.getCount();
        const pageSize = props.virtualScrollConfig?.pageSize ?? totalCount;
        const range = disableVirtualScroll
            ? { startIndex: 0, endIndex: totalCount }
            : ScrollControllerLib.CalculatorUtil.getRangeByIndex({
                  pageSize,
                  start: 0,
                  end: null,
                  totalCount,
              });
        this.state = {
            disableVirtualScroll,
            collectionVersion: props.collectionVersion,
            // @ts-ignore
            rootItemsCount: this.props.collection.getRoot
                ? // @ts-ignore
                  this.props.collection.getRoot().getChildren().getCount()
                : this.props.collection.getCount(),
            allItemsCount: totalCount,
            // todo Сюда необходимо внести код, рассчитывающий отступ для триггера. Сейчас этот код расположен в
            // "Controls\_baseList\Controllers\ScrollController\ObserverController\ObserversController.ts"
            viewTriggerProps: {
                offset: 1,
            },
            range,
            placeholders: { backward: 0, forward: 0 },
            itemsSizes: [],
            pagingVisible: false,
            triggersState: { top: false, bottom: false },
            scrollState: { position: 0 },
        };
        if (props.apiRef.current) {
            props.apiRef.current.scrollToItem = (key: TItemKey, position?: string) =>
                this._scrollToItem(key, position);
        } else {
            props.apiRef.current = {
                scrollToItem: (key: TItemKey, position?: string) =>
                    this._scrollToItem(key, position),
            };
        }
    }

    private _scrollToItem(key: TItemKey, position?: string): Promise<void> {
        const index = this.props.collection.getIndexByKey(key);
        if (index === -1) {
            return Promise.resolve();
        }
        const pageSize = this.props.virtualScrollConfig?.pageSize || this.state.allItemsCount;
        const startIndex = position === 'bottom' ? Math.max(index - pageSize + 1, 0) : index;
        const range = this.state.disableVirtualScroll
            ? { startIndex: 0, endIndex: this.state.allItemsCount }
            : ScrollControllerLib.CalculatorUtil.getRangeByIndex({
                  pageSize,
                  start: startIndex,
                  end: null,
                  totalCount: this.state.allItemsCount,
              });

        const placeholders = ScrollControllerLib.CalculatorUtil.getPlaceholdersByRange({
            range,
            totalCount: this.state.allItemsCount,
            itemsSizes: fillItemSizesByRange(
                this.state.itemsSizes,
                range,
                this.state.allItemsCount
            ),
            itemsRenderedOutsideRange: [],
            calcByOffset: true,
            contentSizeBeforeList: 0,
        });

        const scroll = () => {
            const scrollPosition =
                this.state.itemsSizes[index].offset -
                this.state.placeholders.backward -
                (position === 'bottom'
                    ? this.props.listScrollContextState.getViewportRect().height
                    : 0);
            this.props.listScrollContextState.scrollTo(scrollPosition);
            return Math.max(scrollPosition, 0);
        };
        if (
            range.startIndex === this.state.range.startIndex &&
            range.endIndex === this.state.range.endIndex
        ) {
            scroll();
            return Promise.resolve();
        }
        let scrollCallback;
        const promise = new Promise<void>((resolver) => {
            scrollCallback = () => {
                const position = scroll();
                resolver();
                return position;
            };
            return resolver;
        });

        this.setState({ range, placeholders, scrollCallback });
        return promise;
    }

    scrollToPage(direction: ScrollControllerLib.IDirectionNew) {
        const edgeItem = getEdgeItem(
            this.props.listScrollContextState,
            this.props.collection,
            this.state,
            direction
        );
        const scrollPosition = direction === 'forward' ? 'top' : 'bottom';
        return this._scrollToItem(edgeItem.key, scrollPosition).then(() => {
            /* marker */
        });
    }

    scrollToEdge(direction: ScrollControllerLib.IDirectionNew) {
        const scrollPosition = direction === 'forward' ? 'top' : 'bottom';
        const index = direction === 'forward' ? this.state.allItemsCount - 1 : 0;
        return this._scrollToItem(
            this.props.collection.at(index).key as TItemKey,
            scrollPosition
        ).then(() => {
            /* marker */
        });
    }

    private onDirectionChange = (
        direction: ScrollControllerLib.IDirectionNew,
        isScrollToEdge: boolean
    ) => {
        if (isScrollToEdge) {
            this.scrollToEdge(direction);
        } else {
            this.scrollToPage(direction);
        }
    };

    componentDidMount() {
        this.setState((prevState) => ({
            pagingVisible: this._needShowPagingByScrollSize(prevState.pagingVisible),
        }));
    }

    getSnapshotBeforeUpdate(
        prevProps: IScrollControllerWrapperProps,
        prevState: IScrollControllerWrapperState
    ): IScrollControllerInnerWrapperSnapshot {
        const snapshot: IScrollControllerInnerWrapperSnapshot = {};

        if (
            (prevState.collectionVersion !== this.state.collectionVersion ||
                prevState.range !== this.state.range) &&
            !this.props.resetScroll
        ) {
            snapshot.edgeItem = getEdgeItem(
                prevProps.listScrollContextState,
                prevProps.collection,
                prevState
            );
        }
        return snapshot;
    }

    private _needShowPagingByScrollSize(currentPagingVisibilityState: boolean): boolean {
        if (
            !this.props.listContainerRef.current ||
            !this.props.navigation?.viewConfig?.pagingMode ||
            this.props.navigation.viewConfig.pagingMode === 'hidden'
        ) {
            return false;
        }
        const viewportSize = this.props.listScrollContextState.getViewportRect().height;
        const viewSize = this.props.listContainerRef.current?.getBoundingClientRect().height ?? 0;
        let result = viewSize > viewportSize || currentPagingVisibilityState;

        /*
         * Правильнее будет проверять что размер viewport не равен 0.
         * Это нужно для того, чтобы пэйджинг в таком случае не отобразился.
         * viewport может быть равен 0 в том случае, когда блок скрыт через display:none, а после становится видим.
         */
        if (viewportSize !== 0) {
            const proportion = viewSize / viewportSize;

            if (proportion > 0) {
                // наличие пэйджинга зависит от того превышают данные два вьюпорта или нет
                if (!result) {
                    result = proportion >= MIN_SCROLL_PAGING_SHOW_PROPORTION;
                }

                // если все данные поместились на один экран, то скрываем пэйджинг
                if (result) {
                    result = proportion > MAX_SCROLL_PAGING_HIDE_PROPORTION;
                }
            } else {
                result = false;
            }
        } else {
            result = false;
        }

        return result;
    }

    static getDerivedStateFromProps(
        nextProps: IScrollControllerWrapperProps,
        prevState: IScrollControllerWrapperState
    ) {
        let derivedState: IScrollControllerWrapperState = { ...prevState };
        if (nextProps.listScrollContextState.getViewportRect().height) {
            derivedState.viewTriggerProps = {
                offset: nextProps.listScrollContextState.getViewportRect().height / 3,
            };
        }
        const nextCollectionVersion = nextProps.collectionVersion;

        const resetScroll = nextProps.resetScroll;

        const contextEvent = nextProps.listScrollContextState.contextEvent;

        if (contextEvent && contextEvent !== prevState.contextEvent) {
            switch (contextEvent.type) {
                case 'virtualScrollMove':
                    const newState = shiftRangeToVirtualScrollPosition(
                        contextEvent.params.scrollTop,
                        derivedState,
                        nextProps
                    );
                    derivedState = { ...derivedState, ...newState, contextEvent };
            }
        } else {
            derivedState.contextEvent = null;
        }

        if (prevState.collectionVersion !== nextCollectionVersion) {
            derivedState.collectionVersion = nextCollectionVersion;
            // @ts-ignore
            derivedState.rootItemsCount = nextProps.collection.getRoot
                ? // @ts-ignore
                  nextProps.collection.getRoot().getChildren().getCount()
                : nextProps.collection.getCount();
            derivedState.allItemsCount = nextProps.collection.getCount();
            if (resetScroll) {
                const range = prevState.disableVirtualScroll
                    ? { startIndex: 0, endIndex: derivedState.allItemsCount }
                    : ScrollControllerLib.CalculatorUtil.getRangeByIndex({
                          pageSize:
                              nextProps.virtualScrollConfig?.pageSize || derivedState.allItemsCount,
                          start: 0,
                          end: null,
                          totalCount: derivedState.allItemsCount,
                      });
                derivedState.range = range;
            }
            if (derivedState.allItemsCount !== prevState.allItemsCount) {
                if (ScrollControllerInnerWrapper.checkTrigger(nextProps, derivedState, 'forward')) {
                    const newState = ScrollControllerInnerWrapper.shiftToDirection(
                        nextProps,
                        derivedState,
                        'forward'
                    );
                    derivedState = { ...derivedState, ...newState };
                } else if (
                    ScrollControllerInnerWrapper.checkTrigger(nextProps, derivedState, 'backward')
                ) {
                    const newState = ScrollControllerInnerWrapper.shiftToDirection(
                        nextProps,
                        derivedState,
                        'backward'
                    );
                    derivedState = { ...derivedState, ...newState };
                }
            }
        }

        return derivedState;
    }

    componentDidUpdate(
        prevProps: IScrollControllerWrapperProps,
        prevState: IScrollControllerWrapperState,
        snapshot: IScrollControllerInnerWrapperSnapshot
    ) {
        this.state.scrollState.position =
            this.props.listScrollContextState.getVerticalScrollPosition();

        if (this.props.resetScroll) {
            this.props.listScrollContextState.scrollTo(0);
        }

        if (snapshot && snapshot.edgeItem && !this.state.scrollCallback) {
            const newEdgeItem = getEdgeItem(
                prevProps.listScrollContextState,
                prevProps.collection,
                this.state
            );
            if (isNeedRestoreScroll(snapshot.edgeItem, newEdgeItem)) {
                restoreScroll(prevProps.listScrollContextState, snapshot.edgeItem, this.state);
            }
        }

        const pagingVisible = this._needShowPagingByScrollSize(prevState.pagingVisible);

        if (this.state.placeholders !== prevState.placeholders) {
            const convertedPlaceholders = {
                top: this.state.placeholders.backward,
                bottom: this.state.placeholders.forward,
            };
            this.props.listScrollContextState?.updatePlaceholdersSize?.(
                null,
                convertedPlaceholders
            );
            this.props.listScrollContextState.updateShadowVisibility?.(null, {
                top: this.state.placeholders.backward ? 'visible' : 'auto',
                bottom: this.state.placeholders.forward ? 'visible' : 'auto',
            });
        }

        if (this.state.contextEvent) {
            this.state.contextEvent.params?.callback?.();
        }

        if (this.state.scrollCallback) {
            this.state.scrollState.position = this.state.scrollCallback();
            let newState: Partial<IScrollControllerWrapperState> = {};
            if (ScrollControllerInnerWrapper.checkTrigger(this.props, this.state, 'forward')) {
                newState =
                    ScrollControllerInnerWrapper.shiftToDirection(
                        this.props,
                        this.state,
                        'forward'
                    ) || {};
            } else if (
                ScrollControllerInnerWrapper.checkTrigger(this.props, this.state, 'backward')
            ) {
                newState =
                    ScrollControllerInnerWrapper.shiftToDirection(
                        this.props,
                        this.state,
                        'backward'
                    ) || {};
            }
            this.setState({ ...newState, scrollCallback: null } as IScrollControllerWrapperState);
        }

        if (pagingVisible !== prevState.pagingVisible) {
            this.setState({ pagingVisible });
        }
    }

    static checkTrigger(
        props: IScrollControllerWrapperProps,
        state: IScrollControllerWrapperState,
        direction: 'forward' | 'backward'
    ) {
        const triggerOffset = state.viewTriggerProps.offset;
        const position = state.scrollState.position;
        const viewport = props.listScrollContextState.getViewportRect().height;
        if (viewport === undefined) return false;
        const content = state.itemsContainer?.parentElement?.clientHeight || 0;
        if (direction === 'forward') {
            return content - triggerOffset < position + viewport;
        } else {
            return triggerOffset > position;
        }
    }

    onViewTriggerVisibilityChanged(position: 'top' | 'bottom', state: boolean) {
        this.state.triggersState[position] = state;
        if (state) {
            if (position === 'bottom') {
                if (!this.shiftRangeToDirection('forward')) {
                    this.props.viewModelAPI.next();
                }
            }
            if (position === 'top') {
                if (!this.shiftRangeToDirection('backward')) {
                    this.props.viewModelAPI.prev();
                }
            }
        }
    }

    static shiftToDirection(
        props: IScrollControllerWrapperProps,
        state: IScrollControllerWrapperState,
        direction: 'backward' | 'forward'
    ): IScrollControllerWrapperState | null {
        const viewportSize = props.listScrollContextState.getViewportRect().height;
        const scrollPosition = props.listScrollContextState.getVerticalScrollPosition();
        const range = state.disableVirtualScroll
            ? { startIndex: 0, endIndex: state.allItemsCount }
            : ScrollControllerLib.CalculatorUtil.shiftRangeBySegment({
                  currentRange: state.range,
                  direction,
                  pageSize: props.virtualScrollConfig?.pageSize || state.allItemsCount,
                  segmentSize: getSegmentSize(props.virtualScrollConfig),
                  totalCount: state.allItemsCount,
                  viewportSize,
                  scrollPosition,
                  triggersOffsets: { forward: viewportSize / 3, backward: viewportSize / 3 }, // TODO
                  itemsSizes: state.itemsSizes,
                  placeholders: state.placeholders,
                  contentSizeBeforeList: 0, // TODO
                  calcMode: 'shift',
              });

        const placeholders = ScrollControllerLib.CalculatorUtil.getPlaceholdersByRange({
            range,
            totalCount: state.allItemsCount,
            itemsSizes: fillItemSizesByRange(state.itemsSizes, range, state.allItemsCount),
            itemsRenderedOutsideRange: [], // TODO
            calcByOffset: true,
            contentSizeBeforeList: 0, // TODO
        });
        if (
            range.startIndex !== state.range.startIndex ||
            range.endIndex !== state.range.endIndex
        ) {
            return {
                range,
                placeholders,
                viewTriggerProps: {
                    offset: viewportSize / 3,
                },
            } as IScrollControllerWrapperState;
        }
        return null;
    }
    shiftRangeToDirection(direction: 'backward' | 'forward'): boolean {
        const newState = ScrollControllerInnerWrapper.shiftToDirection(
            this.props,
            this.state,
            direction
        );
        if (newState) {
            this.setState(newState);
            // this.props.collection.setIndexes(
            //     newState.range.startIndex,
            //     newState.range.endIndex,
            //     'down'
            // );
            return true;
        }
        return false;
    }

    itemsContainerReadyCallback(itemsContainerGetter: () => HTMLElement) {
        const itemsContainer = itemsContainerGetter();
        this.setState({
            itemsContainer,
            itemsSizes: getItemsSizes(itemsContainer, this.state),
        });
    }

    render() {
        return (
            <>
                {React.cloneElement(this.props.children, {
                    viewTriggerProps: this.state.viewTriggerProps,
                    onViewTriggerVisibilityChanged: this.onViewTriggerVisibilityChanged,
                    itemsContainerReadyCallback: this.itemsContainerReadyCallback,
                    virtualScrollRange: this.state.range,
                    collectionVersion: this.state.collectionVersion,
                })}
                {this.state.pagingVisible && this.props.navigation?.viewConfig && (
                    <ScrollPaging
                        pagingLeftTemplate={this.props.pagingLeftTemplate}
                        pagingContentTemplate={this.props.pagingContentTemplate}
                        pagingRightTemplate={this.props.pagingRightTemplate}
                        viewConfig={this.props.navigation.viewConfig}
                        onDirectionChange={this.onDirectionChange}
                    />
                )}
            </>
        );
    }
}

export default function ScrollContainer(
    props: Omit<IScrollControllerWrapperProps, 'listScrollContextState'>
) {
    const listScrollContextState = React.useContext(
        _ListScrollContext
    ) as unknown as IListScrollContextState;
    return (
        <ScrollControllerInnerWrapper
            {...props}
            children={props.children}
            listScrollContextState={listScrollContextState}
        />
    );
}
