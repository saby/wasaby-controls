/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import {
    AbstractListVirtualScrollController,
    IAbstractListVirtualScrollControllerOptions,
    IScrollControllerOptions,
    IVirtualCollection,
    IDirectionNew as IDirection,
} from 'Controls/baseList';
import {
    IObserversControllerOptions,
    ObserversController,
} from './ObserversController';
import {
    IItemsSizesControllerOptions,
    ItemsSizeController,
} from './ItemsSizeController';
import { VirtualCollection } from './displayUtils/VirtualCollection';
import ScrollBar from './scrollBar/ScrollBar';
import DragScrollController from './DragScrollController';
import DragScrollOverlay from './dragScrollOverlay/DragScrollOverlay';
import type { GridCollection } from 'Controls/grid';
import { SyntheticEvent } from 'Vdom/Vdom';
import { TItemKey } from 'Controls/display';

export interface IControllerOptions
    extends IAbstractListVirtualScrollControllerOptions {
    dragScrolling?: boolean;
    stickyColumnsCount?: number;
    columnScrollStartPosition?: 'end';
    startDragNDropCallback: () => void;
    columnKeyProperty?: string;
    resizeNotifyUtil?: () => void;
}

export type IItemsSizesControllerConstructor = new (
    options: IItemsSizesControllerOptions
) => ItemsSizeController;
export type IObserversControllerConstructor = new (
    options: IObserversControllerOptions
) => ObserversController;

export const HORIZONTAL_LOADING_TRIGGER_SELECTOR =
    '.controls-BaseControl__loadingTrigger_horizontal';

export class Controller extends AbstractListVirtualScrollController<IControllerOptions> {
    protected _collection: VirtualCollection;
    private _scrollBar: ScrollBar;
    private _dragScrollController: DragScrollController;
    private _dragScrollOverlay: DragScrollOverlay;
    private _resizeNotifyUtil: () => void;
    private _columnIndexesChanged: boolean = false;

    constructor(options: IControllerOptions & { collection: GridCollection }) {
        super({
            ...options,
            itemsQuerySelector:
                '.js-controls-Grid__virtualColumnScroll__fake-scrollable-cell-to-recalc-width',
            triggersQuerySelector: HORIZONTAL_LOADING_TRIGGER_SELECTOR,
            collection: new VirtualCollection(
                options.collection,
                options.columnKeyProperty
            ),
            scrollToElementUtil: (
                container: HTMLElement,
                position: string,
                force: boolean
            ): Promise<void> | void => {
                // Из абстрактного контроллера прилетает не универсальная позиция before/after, а top/bottom.
                // Утилита из библиотеки Controls/scroll для горизонтального скроллирования такого не понимает.
                // https://online.sbis.ru/opendoc.html?guid=446ff727-5c70-4a47-be83-c6eec6cf4593
                let convertedPosition = position;
                if (position === 'top') {
                    convertedPosition = 'left';
                } else if (position === 'bottom') {
                    convertedPosition = 'right';
                }
                if (options.scrollToElementUtil) {
                    options.scrollToElementUtil(
                        container,
                        convertedPosition,
                        force
                    );
                }
            },
        });

        this._resizeNotifyUtil = options.resizeNotifyUtil;
        this._scrollOnReset = 'keep';
        if (options.dragScrolling !== false) {
            this._createDragScrollController(options.startDragNDropCallback);
        }
    }

    protected _getObserversControllerConstructor(): IObserversControllerConstructor {
        return ObserversController;
    }

    protected _getItemsSizeControllerConstructor(): IItemsSizesControllerConstructor {
        return ItemsSizeController;
    }

    afterRenderListControl(): void {
        super.afterRenderListControl();
        if (this._columnIndexesChanged) {
            this._columnIndexesChanged = false;
            if (this._resizeNotifyUtil) {
                this._resizeNotifyUtil();
            }
        }
    }

    setCollection(collection: IVirtualCollection): void {
        const gridCollection = collection as GridCollection;
        super.setCollection(
            new VirtualCollection(
                gridCollection,
                gridCollection.getColumnKeyProperty()
            )
        );
    }

    protected _getScrollControllerOptions(
        options: IControllerOptions
    ): IScrollControllerOptions {
        return {
            ...super._getScrollControllerOptions(options),
            totalCount: options.columns.length,
        };
    }

    scrollToPage(direction: IDirection): Promise<TItemKey> {
        // TODO: Поправить в базовом классе и удалить это.
        //  Если мы вконце скроллируемой области, то промис метода scrollToPage никогда не отстрелит.
        if (
            this._scrollPosition ===
            (direction === 'backward'
                ? 0
                : this._scrollController.getListContainerSize() -
                  this._scrollController.getViewportSize())
        ) {
            return Promise.resolve(null);
        } else {
            return super.scrollToPage(direction);
        }
    }

    // TODO: Удалить.
    protected _setCollectionIterator(): void {
        this._collection.setViewIterator();
    }

    // TODO: Удалить.
    protected _applyIndexes(startIndex: number, endIndex: number): void {
        this._collection.setIndexes(startIndex, endIndex);
        this._columnIndexesChanged = true;
    }

    // TODO: Удалить.
    protected _getCollectionItemsCount(): number {
        return this._collection.getCount();
    }

    // TODO: Удалить.
    protected _getIndexByKey<T extends TItemKey = TItemKey>(key: T): number {
        return this._collection.getIndexByKey(key);
    }

    protected _contentResized(contentSize: number): boolean {
        const isChanged = super._contentResized(contentSize);
        if (isChanged && this._dragScrollController) {
            this._updateSizesInDragScrollController();
        }
        return isChanged;
    }

    protected _viewportResized(viewportSize: number): boolean {
        const isChanged = super._viewportResized(viewportSize);
        if (isChanged && this._dragScrollController) {
            this._updateSizesInDragScrollController();
        }
        return isChanged;
    }

    protected _validateEdgeItem(itemKey: string): boolean {
        return (
            super._validateEdgeItem(itemKey) &&
            this._collection.validateEdgeItem(itemKey)
        );
    }

    scrollPositionChange(position: number): void {
        super.scrollPositionChange(position);
        this._scrollBar?.setScrollPosition(position);
        this._dragScrollController?.setScrollPosition(position);
    }

    setScrollBar(scrollBar: ScrollBar): void {
        this._scrollBar = scrollBar;
        this._scrollBar.setScrollPosition(this._scrollPosition);
    }

    keyDownLeft(): Promise<void> {
        return this.scrollToPage('backward');
    }

    keyDownRight(): Promise<void> {
        return this.scrollToPage('forward');
    }

    scrollToElement(
        container: HTMLElement,
        position: string,
        force: boolean = false
    ): void {
        this._scrollToElementUtil(container, position, force);
    }

    //# region DRAG SCROLLING

    private _createDragScrollController(
        startDragNDropCallback: IControllerOptions['startDragNDropCallback']
    ): void {
        this._dragScrollController = new DragScrollController({
            canStartDragScrollCallback: (target: HTMLElement) => {
                return !target.closest('.js-controls-DragScroll__notDraggable');
            },
            startDragNDropCallback,
            canStartDragNDropCallback: (target: HTMLElement): boolean => {
                return (
                    !target.closest('.controls-DragNDrop__notDraggable') &&
                    !!target.closest('.controls-Grid__row')
                );
            },
            onOverlayHide: () => {
                this._dragScrollOverlay.hide();
            },
            onOverlayShown: () => {
                this._dragScrollOverlay.show();
            },
        });
    }

    private _updateSizesInDragScrollController(): void {
        this._dragScrollController.setScrollPosition(this._scrollPosition || 0);
        this._dragScrollController.setScrollLength(
            this._scrollController.getListContainerSize() -
                this._scrollController.getViewportSize()
        );
    }

    registerDragScrollOverlay(inst: DragScrollOverlay): void {
        this._dragScrollOverlay = inst;
    }

    startDragScrolling(e: SyntheticEvent<MouseEvent>): void {
        this._dragScrollController?.startDragScroll(e.nativeEvent);
    }

    moveDragScroll(e: SyntheticEvent<MouseEvent>): void {
        if (this._dragScrollController) {
            const newPosition = this._dragScrollController.moveDragScroll(
                e.nativeEvent
            );
            if (
                typeof newPosition === 'number' &&
                this._scrollPosition !== newPosition
            ) {
                this._doScrollUtil(newPosition);
            }
        }
    }

    stopDragScrolling(e: SyntheticEvent<MouseEvent>): void {
        this._dragScrollController?.stopDragScroll(e.nativeEvent);
    }

    //# endregion
}

export default Controller;
