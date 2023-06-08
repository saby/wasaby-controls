/**
 * @kaizen_zone 2bbe81af-0d89-4db2-ba7f-f55c98df6852
 */
import { BeforeMountAsyncQueueHelper, IScrollParams } from 'Controls/baseList';
import { BaseTreeControl, IBaseTreeControlOptions } from 'Controls/baseTree';
import {
    GridControl,
    IGridControlOptions,
    updateCollectionIfReactView,
    TColumns,
    getCellIndexByEventTarget,
    GridCollection,
    GridRow
} from 'Controls/grid';
import {
    Controller as ListVirtualColumnScrollController,
    IControllerOptions as IListVirtualColumnScrollControllerOptions,
} from 'Controls/horizontalScroll';
import { SyntheticEvent } from 'UI/Vdom';
import { Object as EventObject } from 'Env/Event';
import { RecordSet } from 'Types/collection';
import { Model } from 'Types/entity';
import {
    enableHorizontalScrollOnTab,
    disableHorizontalScrollOnTab,
} from 'UI/Focus';

type ListVirtualColumnScrollControllerCtor = new (
    options: IListVirtualColumnScrollControllerOptions
) => ListVirtualColumnScrollController;

export interface ITreeGridControlOptions
    extends IBaseTreeControlOptions,
        IGridControlOptions {}

export class TreeGridControl<
    TOptions extends ITreeGridControlOptions = ITreeGridControlOptions
> extends BaseTreeControl<TOptions> {
    private _listVirtualColumnScrollController?: ListVirtualColumnScrollController;
    private _fixedColumnsWidth: number = 0;

    // Нативный подскрол при фокусе, используется в новом горизонтальном скролле, только в 4100.
    private _useNativeScrollOnFocus: boolean = false;

    constructor(...args: unknown[]) {
        super(...args);
        this._doScrollUtil = this._doScrollUtil.bind(this);
        this._onModelColumnsConfigChanged =
            this._onModelColumnsConfigChanged.bind(this);
    }

    protected _prepareItemsOnMount(
        self: this,
        newOptions: ITreeGridControlOptions
    ): Promise<void> {
        super._prepareItemsOnMount(self, newOptions);
        if (this._hasHorizontalScroll(newOptions)) {
            this._useNativeScrollOnFocus = true;
            enableHorizontalScrollOnTab();
            newOptions.setHorizontalScrollMode('custom');
            // https://online.sbis.ru/opendoc.html?guid=455ee9d5-641d-4db2-a8cf-7f5b3b59577e
            // Асинхронность будет удалена при удалении старого скролла.
            if (newOptions.task1185938417) {
                this._createColumnScrollController(
                    newOptions.horizontalScrollControllerCtor,
                    newOptions
                );
            } else {
                return import('Controls/horizontalScroll').then((lib) => {
                    this._createColumnScrollController(
                        lib.Controller,
                        newOptions
                    );
                });
            }
        }
    }

    protected _prepareBeforeMountAsyncQueue(
        newOptions: IGridControlOptions
    ): BeforeMountAsyncQueueHelper {
        return super
            ._prepareBeforeMountAsyncQueue(newOptions)
            .addOperation(() => {
                this._listVirtualColumnScrollController?.endBeforeMountListControl();
            });
    }

    protected _afterMount(...args): void {
        super._afterMount(...args);
        if (this._listVirtualColumnScrollController) {
            this._updateFixedColumnsWidth();
            this._listVirtualColumnScrollController.setListContainer(
                this._container
            );
            this._listVirtualColumnScrollController.afterMountListControl();
        }
    }

    protected _beforeUpdate(
        newOptions: IGridControlOptions,
        contexts?: { workByKeyboard?: WorkByKeyboardContext }
    ) {
        super._beforeUpdate(newOptions, contexts);
        if (
            !newOptions.newColumnScroll &&
            this._listVirtualColumnScrollController
        ) {
            this._listVirtualColumnScrollController.destroy();
            this._listVirtualColumnScrollController = null;
            newOptions.setHorizontalScrollMode();
        } else if (
            newOptions.newColumnScroll &&
            !this._options.newColumnScroll
        ) {
            newOptions.setHorizontalScrollMode('custom');
        }

        // TODO после перезагрузки это надо делать
        updateCollectionIfReactView(this._listViewModel, this._options, newOptions);
    }

    protected _beforeUnmount(): void {
        super._beforeUnmount();
        if (this._useNativeScrollOnFocus) {
            disableHorizontalScrollOnTab();
        }
    }

    protected _itemsContainerReadyHandler(
        itemsContainerGetter: () => HTMLElement
    ): void {
        super._itemsContainerReadyHandler(itemsContainerGetter);
        if (this._listVirtualColumnScrollController) {
            if (this._isMounted) {
                this._listVirtualColumnScrollController.setListContainer(
                    this._container
                );
            }
            this._listVirtualColumnScrollController.setItemsContainer(
                this._getItemsContainer()
            );
        }
    }

    protected _reinitializeModel(
        options: IGridControlOptions,
        newItems: RecordSet
    ): void {
        super._reinitializeModel(options, newItems);
        if (this._listVirtualColumnScrollController) {
            this._listVirtualColumnScrollController.setCollection(
                this._listViewModel
            );
            this._listVirtualColumnScrollController.setItemsContainer(null);
        }
    }

    protected _onTagClickHandler(
        event: Event,
        item: GridRow<Model>,
        columnIndex: number
    ): void {
        let resolvedColumnIndex = columnIndex;
        if (columnIndex === undefined) {
            resolvedColumnIndex = getCellIndexByEventTarget(
                event,
                this._listViewModel
            );
        }
        super._onTagClickHandler(
            event,
            item,
            resolvedColumnIndex
        );
    }

    protected _onTagHoverHandler(
        event: Event,
        item: GridRow<Model>,
        columnIndex: number
    ): void {
        let resolvedColumnIndex = columnIndex;
        if (columnIndex === undefined) {
            resolvedColumnIndex = getCellIndexByEventTarget(
                event,
                this._listViewModel
            );
        }
        super._onTagHoverHandler(
            event,
            item,
            resolvedColumnIndex
        );
    }

    protected _onItemClick(
        event: SyntheticEvent,
        contents: Model,
        originalEvent: SyntheticEvent<MouseEvent>,
        _columnIndex: number = undefined
    ): boolean | void {
        const item = this._listViewModel.getItemBySourceKey(contents.getKey());
        const columnIndex = getCellIndexByEventTarget(
            originalEvent,
            this._listViewModel
        );

        // Проблема в том, что клик по action происходит раньше, чем itemClick.
        // Если мы нажмем на крестик, то состояние editing сбросится в false до itemClick.
        // Но запись перерисоваться не успеет, поэтому смотрим на класс.
        const targetItem = originalEvent.target.closest(
            '.controls-ListView__itemV'
        );
        const clickOnEditingItem =
            targetItem &&
            targetItem.matches('.js-controls-ListView__item_editing');
        if (clickOnEditingItem) {
            event.stopPropagation();
            if (this._listViewModel.getEditingConfig()?.mode === 'cell') {
                const multiSelectOffset =
                    +this._listViewModel.hasMultiSelectColumn();
                if (
                    item.getEditingColumnIndex() !==
                    columnIndex + multiSelectOffset
                ) {
                    super._onItemClick(
                        event,
                        contents,
                        originalEvent,
                        columnIndex
                    );
                }
            }
            return;
        }

        super._onItemClick(event, contents, originalEvent, columnIndex);
    }

    _beforeRender(...args): void {
        super._beforeRender(...args);
        if (this._listVirtualColumnScrollController) {
            const hasNotRenderedChanges =
                this._hasItemWithImageChanged ||
                this._indicatorsController.hasNotRenderedChanges();
            this._listVirtualColumnScrollController.beforeRenderListControl(
                hasNotRenderedChanges
            );
        }
    }

    _$react_componentDidUpdate(oldOptions: ITreeGridControlOptions): void {
        super._$react_componentDidUpdate(oldOptions);
        if (this._listVirtualColumnScrollController) {
            if (
                this._storedColumnsWidthsChanged ||
                this._options.stickyColumnsCount !==
                    oldOptions.stickyColumnsCount
            ) {
                this._updateFixedColumnsWidth();
            }
            this._listVirtualColumnScrollController.afterRenderListControl();
        }
        this._storedColumnsWidthsChanged = false;
    }

    private _hasHorizontalScroll(options: IGridControlOptions): boolean {
        return (
            options.newColumnScroll &&
            options.scrollOrientation &&
            options.scrollOrientation.toLowerCase().indexOf('horizontal') !== -1
        );
    }

    _observeScrollHandler(
        ...args: [SyntheticEvent<Event>, string, IScrollParams]
    ): void {
        super._observeScrollHandler.apply(this, args);
        const [, eventName, params] = args;
        switch (eventName) {
            case 'horizontalScrollMoveSync':
                this._listVirtualColumnScrollController?.scrollPositionChange(
                    params.scrollLeft
                );
                break;
            case 'horizontalViewportResize':
                this._viewportResizeHandler(
                    params.clientHeight,
                    params.rect,
                    params.scrollTop
                );
                break;
        }
    }

    protected _viewportResizeHandler(
        viewportHeight: number,
        viewportRect: DOMRect,
        scrollTop: number
    ): void {
        super._viewportResizeHandler(viewportHeight, viewportRect, scrollTop);
        if (this._listVirtualColumnScrollController) {
            this._viewportWidth = viewportRect.width;
            this._listVirtualColumnScrollController.viewportResized(
                viewportRect.width
            );
        }
    }

    scrollToLeft(): void {
        if (!this._options.newColumnScroll) {
            if (this._children.listView.scrollToLeft) {
                this._children.listView.scrollToLeft();
            }
        } else {
            this._listVirtualColumnScrollController?.scrollToEdge('backward');
        }
    }

    scrollToRight(): void {
        if (!this._options.newColumnScroll) {
            if (this._children.listView.scrollToRight) {
                this._children.listView.scrollToRight();
            }
        } else {
            this._listVirtualColumnScrollController?.scrollToEdge('forward');
        }
    }

    scrollToColumn(columnIndexOrKey: number | string): void {
        if (!this._options.newColumnScroll) {
            if (this._children.listView.scrollToColumn) {
                this._children.listView.scrollToColumn(
                    columnIndexOrKey as number
                );
            }
        } else {
            this._listVirtualColumnScrollController?.scrollToItem(
                columnIndexOrKey
            );
        }
    }

    protected _onDoHorizontalScroll(
        e: SyntheticEvent,
        target: HTMLElement,
        nativeEvent: SyntheticEvent
    ): void {
        this._listVirtualColumnScrollController?.scrollToElement(
            target,
            'center',
            false
        );
    }

    protected _onViewMouseDown(e: SyntheticEvent<MouseEvent>): void {
        this._listVirtualColumnScrollController?.startDragScrolling(e);
    }

    protected _onViewMouseMove(e: SyntheticEvent<MouseEvent>): void {
        this._listVirtualColumnScrollController?.moveDragScroll(e);
    }

    protected _onViewMouseUp(e: SyntheticEvent<MouseEvent>): void {
        this._listVirtualColumnScrollController?.stopDragScrolling(e);
    }

    protected _onDragScrollOverlayReady(e: SyntheticEvent, inst): void {
        this._listVirtualColumnScrollController?.registerDragScrollOverlay(
            inst
        );
    }

    protected _onDragScrollOverlayMoveDrag(
        e: SyntheticEvent,
        nativeEvent: SyntheticEvent<MouseEvent>
    ): void {
        this._listVirtualColumnScrollController?.moveDragScroll(nativeEvent);
    }

    protected _onDragScrollOverlayStopDrag(
        e: SyntheticEvent,
        nativeEvent: SyntheticEvent<MouseEvent>
    ): void {
        this._listVirtualColumnScrollController?.stopDragScrolling(nativeEvent);
    }

    protected _keyDownLeft(event: SyntheticEvent): void {
        if (this._options.newColumnScroll && event.nativeEvent.shiftKey) {
            this._listVirtualColumnScrollController.keyDownLeft().then(() => {
                return super._keyDownLeft(event);
            });
        } else {
            super._keyDownLeft(event);
        }
    }

    protected _keyDownRight(event): void {
        if (this._options.newColumnScroll && event.nativeEvent.shiftKey) {
            this._listVirtualColumnScrollController.keyDownRight().then(() => {
                return super._keyDownLeft(event);
            });
        } else {
            super._keyDownRight(event);
        }
    }

    private _doScrollUtil(position: number): void {
        this._options.notifyCallback('doHorizontalScroll', [position, true], {
            bubbling: true,
        });
    }

    private _createColumnScrollController(
        controllerCtor: ListVirtualColumnScrollControllerCtor,
        options: ITreeGridControlOptions
    ): void {
        this._listVirtualColumnScrollController = new controllerCtor({
            ...options,
            listControl: this,
            collection: this._listViewModel,
            virtualScrollConfig: options.virtualColumnScrollConfig || {},
            disableVirtualScroll:
                !options.isFullGridSupport ||
                !options.virtualColumnScrollConfig,
            initialScrollPosition: options.initialScrollPosition?.horizontal,
            triggersOffsetCoefficients: {
                backward: options.leftTriggerOffsetCoefficient,
                forward: options.rightTriggerOffsetCoefficient,
            },
            triggersPositions: {
                backward: 'offset',
                forward: 'offset',
            },
            triggersVisibility: {
                backward: true,
                forward: true,
            },
            startDragNDropCallback: options.itemsDragNDrop
                ? this._startDragNDropCallback
                : null,
            doScrollUtil: this._doScrollUtil,
            resizeNotifyUtil: () => {
                this._options.notifyCallback('controlResize', [], {
                    bubbling: true,
                });
            },
            scrollToElementUtil: (
                container,
                position,
                force
            ): Promise<void> => {
                return this._options.notifyCallback(
                    'horizontalScrollToElement',
                    [{ itemContainer: container, position, force }],
                    { bubbling: true }
                ) as Promise<void>;
            },
            updatePlaceholdersUtil: (placeholders) => {
                if (!this._isMounted) {
                    return;
                }
                const convertedPlaceholders = {
                    left: placeholders.backward,
                    right: placeholders.forward,
                };
                this._options.notifyCallback(
                    'updatePlaceholdersSize',
                    [convertedPlaceholders],
                    { bubbling: true }
                );
            },
            itemsEndedCallback: (direction): void => {
                this._options.notifyCallback('columnsEnded', [direction]);
            },
        });
    }

    protected _onContentResized(width: number, height: number): void {
        super._onContentResized(width, height);
        if (this._contentWidth !== width) {
            this._contentWidth = width;
            if (this._listVirtualColumnScrollController) {
                this._updateFixedColumnsWidth();
                this._listVirtualColumnScrollController.contentResized(width);
            }
        }
    }

    protected _onResizerOffsetChanged(
        event: SyntheticEvent,
        offset: number
    ): void {
        super._onResizerOffsetChanged(event, offset);
        this._storedColumnsWidthsChanged = true;
    }

    private _updateFixedColumnsWidth(
        options: ITreeGridControlOptions = this._options
    ): void {
        if (options.stickyColumnsCount === 0) {
            if (this._fixedColumnsWidth !== 0) {
                this._fixedColumnsWidth = 0;
            }
            return;
        }
        if (!this.__needShowEmptyTemplate(options)) {
            const cellSelector =
                '.js-controls-Grid__virtualColumnScroll__fake-scrollable-cell-to-recalc-width_fixed';
            const fixedCells = Array.from(
                this._container.querySelectorAll<HTMLDivElement>(cellSelector)
            );
            const lastFixedCell = fixedCells[fixedCells.length - 1];
            this._fixedColumnsWidth =
                lastFixedCell.offsetLeft + lastFixedCell.offsetWidth;
        }
    }

    protected _getViewClasses(): string {
        return `${super._getViewClasses()} controls-GridControl__viewContainer`;
    }

    protected _getSystemFooterClasses(): string {
        return (
            super._getSystemFooterClasses() +
            (this._listVirtualColumnScrollController
                ? ' controls__GridControl__footer_withColumnScroll'
                : '')
        );
    }

    protected _shouldHandleItemMouseUp(item): boolean {
        return !item['[Controls/treeGrid:TreeGridGroupDataRow]'];
    }

    protected _shouldHandleItemMouseDown(item): boolean {
        return !item['[Controls/treeGrid:TreeGridGroupDataRow]'];
    }

    protected _getSystemFooterStyles(): string {
        if (!this._listVirtualColumnScrollController) {
            return '';
        }
        return `max-width: ${this._viewportWidth}px;`;
    }

    protected _initListViewModelHandler(model: GridCollection): void {
        super._initListViewModelHandler(model);
        if (model) {
            model.subscribe(
                'onColumnsConfigChanged',
                this._onModelColumnsConfigChanged
            );
        }
    }

    protected _deleteListViewModelHandler(model: GridCollection): void {
        super._deleteListViewModelHandler(model);
        if (model) {
            model.unsubscribe(
                'onColumnsConfigChanged',
                this._onModelColumnsConfigChanged
            );
        }
    }

    private _onModelColumnsConfigChanged(
        e: EventObject,
        oldColumns: TColumns,
        newColumns: TColumns
    ): void {
        this._listVirtualColumnScrollController?.resetItems();
    }

    static '[Controls/treeGrid:TreeGridControl]': true = true;

    static getDefaultOptions(): Partial<ITreeGridControlOptions> {
        return {
            ...BaseTreeControl.getDefaultOptions(),
            ...GridControl.getDefaultOptions(),
        };
    }
}
