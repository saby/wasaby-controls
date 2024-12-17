/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import {
    AbstractItemsSizesController,
    IAbstractItemsSizesControllerOptions,
    IItemsSizes,
    IRenderedOutsideItem,
} from './ItemsSizeController/AbstractItemsSizeController';
import {
    AbstractObserversController,
    IAbstractObserversControllerBaseOptions,
    IAbstractObserversControllerOptions,
    IAdditionalTriggersOffsets,
    ITriggerPosition,
} from './ObserverController/AbstractObserversController';
import {
    Calculator,
    ICalculatorState,
    ICalculatorResult,
    ICalculatorBaseOptions,
    TInvertedIndexes,
} from './Calculator/Calculator';
import CalculatorWithoutVirtualization from './Calculator/CalculatorWithoutVirtualization';
import { CrudEntityKey } from 'Types/source';
import type { IEdgeItemCalculatingParams } from './AbstractListVirtualScrollController';
import {
    IAbstractCalculatorState,
    IActiveElementIndexChanged,
} from 'Controls/_listsCommonLogic/scrollController/Calculator/AbstractCalculator';
import InertialScrolling from 'Controls/_listsCommonLogic/scrollController/InertialScrolling';

const PLACEHOLDER_AFTER_CONTENT_SELECTOR = '.controls-ListViewV__placeholderAfterContent';

export interface IItemsRange {
    startIndex: number;
    endIndex: number;
}

/**
 * Интерфейс, описывающий параметры колбэка об изменении индексов(диапазона отображаемых элементов)
 * @remark
 * oldRange, oldPlaceholders - нужны чтобы правильно посчитать крайний видимый элемент
 * на _beforeRender для восстановления скролла
 * @private
 */
export interface IIndexesChangedParams<TState extends IAbstractCalculatorState> {
    /**
     * Направление, в котором был смещен диапазон.
     * @remark Возможно значение null. Это значит, что не возможно определить направление. Например, reset.
     */
    shiftDirection: IDirection | null;
    restoreDirection: IDirection | null;
    range: IItemsRange;
    oldState: TState;
    scrollMode: IScrollMode;
}

/**
 * Варианты значений режима работы скролла
 * @typedef {String} Controls/_listsCommonLogic/scrollController/ScrollController/IScrollMode
 * @variant fixed DOM-элемент первой видимой записи должен сохранять свою позицию
 * относительно viewPort после смещения диапазона.
 * @variant unfixed DOM-элемент первой видимой записи не сохраняет свою позицию
 * относительно viewPort после смещения диапазона, а сдвигается по нативным правилам.
 */
export type IScrollMode = 'fixed' | 'unfixed';

/**
 * Варианты значений режима пересчета диапазона
 * @typedef {String} Controls/_listsCommonLogic/scrollController/ScrollController/ICalcMode
 * @variant shift Диапазон смещается (пересчитывается и startIndex и stopIndex)
 * @variant extend Диапазон расширяется (пересчитывается или startIndex или stopIndex, зависит от направления)
 * @variant nothing Диапазон не пересчитывается
 * @variant shift-on-segment Диапазон смещает только на segmentSize, не заполняем весь virtualPageSize
 */
export type ICalcMode = 'shift' | 'extend' | 'nothing' | 'shift-on-segment';

export interface IActiveElementIndex {
    activeElementIndex: number;
}

export interface IEdgeItem {
    key: string;
    direction: IDirection;
    border: IDirection;
    borderDistance: number;
}

export interface IPlaceholders {
    backward: number;
    forward: number;
}

export interface IHasItemsOutsideOfRange {
    backward: boolean;
    forward: boolean;
}

export type IDirection = 'backward' | 'forward';

export type IScrollToPageMode = 'edgeItem' | 'viewport';

export type IIndexesChangedCallback = (params: IIndexesChangedParams<ICalculatorState>) => void;

export type IActiveElementChangedChangedCallback = (activeElementIndex: number) => void;

export type IItemsEndedCallback = (direction: IDirection) => void;

export type TItemsSizesUpdatedCallback = (sizes: IItemsSizes) => void;

export type IIndexesInitializedCallback = (range: IIndexesChangedParams<ICalculatorState>) => void;

export type IHasItemsOutRangeChangedCallback = (hasItems: IHasItemsOutsideOfRange) => void;

export type IPlaceholdersChangedCallback = (placeholders: IPlaceholders) => void;

export type IValidateItemFunction = (key: CrudEntityKey) => boolean;

export interface IScrollControllerOptions
    extends IAbstractItemsSizesControllerOptions,
        IAbstractObserversControllerBaseOptions,
        ICalculatorBaseOptions {
    disableVirtualScroll: boolean;
    observerControllerConstructor: new (
        options: IAbstractObserversControllerOptions
    ) => AbstractObserversController;
    itemsSizeControllerConstructor: new (
        options: IAbstractItemsSizesControllerOptions
    ) => AbstractItemsSizesController;
    indexesInitializedCallback: IIndexesInitializedCallback;
    indexesChangedCallback: IIndexesChangedCallback;
    activeElementChangedCallback?: IActiveElementChangedChangedCallback;
    hasItemsOutRangeChangedCallback?: IHasItemsOutRangeChangedCallback;
    placeholdersChangedCallback: IPlaceholdersChangedCallback;
    itemsEndedCallback?: IItemsEndedCallback;
    itemsSizesUpdatedCallback?: TItemsSizesUpdatedCallback;
    feature1184208466?: boolean;
    placeholderAfterContent?: boolean;

    inertialScrolling: InertialScrolling;
}

/**
 * Класс предназначен для управления scroll и обеспечивает:
 *   - генерацию событий о достижении границ контента (работа с триггерами);
 *   - scroll к записи / к границе (при необходимости - пересчёт range);
 *   - сохранение / восстановление позиции scroll.
 * @private
 */
export class ScrollController {
    private readonly _inertialScrolling: InertialScrolling;

    private readonly _itemsSizesController: AbstractItemsSizesController;
    private readonly _observersController: AbstractObserversController;
    private readonly _calculator: Calculator | CalculatorWithoutVirtualization;
    private readonly _indexesChangedCallback: IIndexesChangedCallback;
    private readonly _activeElementChangedCallback: IActiveElementChangedChangedCallback;
    private readonly _hasItemsOutRangeChangedCallback: IHasItemsOutRangeChangedCallback;
    private readonly _placeholdersChangedCallback: IPlaceholdersChangedCallback;
    private readonly _itemsEndedCallback: IItemsEndedCallback;
    private readonly _indexesInitializedCallback: IIndexesInitializedCallback;
    private readonly _itemsSizesUpdatedCallback: TItemsSizesUpdatedCallback;

    private _viewportSize: number = 0;
    private _listContainerSize: number = 0;

    private _handleTriggers: boolean = true;
    private _placeholderAfterContent: boolean = false;
    private readonly _disableVirtualScroll: boolean;

    constructor(options: IScrollControllerOptions) {
        this._indexesChangedCallback = options.indexesChangedCallback;
        this._hasItemsOutRangeChangedCallback = options.hasItemsOutRangeChangedCallback;
        this._placeholdersChangedCallback = options.placeholdersChangedCallback;
        this._activeElementChangedCallback = options.activeElementChangedCallback;
        this._itemsEndedCallback = options.itemsEndedCallback;
        this._itemsSizesUpdatedCallback = options.itemsSizesUpdatedCallback;
        this._indexesInitializedCallback = options.indexesInitializedCallback;

        this._viewportSize = options.viewportSize;
        this._listContainerSize = options.contentSize;

        this._disableVirtualScroll = options.disableVirtualScroll;
        this._placeholderAfterContent = options.placeholderAfterContent;

        this._itemsSizesController = new options.itemsSizeControllerConstructor({
            itemsContainer: options.itemsContainer,
            listContainer: options.listContainer,
            itemsQuerySelector: options.itemsQuerySelector,
            totalCount: options.totalCount,
            feature1184208466: options.feature1184208466,
        });

        this._observersController = new options.observerControllerConstructor({
            listControl: options.listControl,
            listContainer: options.listContainer,
            triggersQuerySelector: options.triggersQuerySelector,
            viewportSize: options.viewportSize,
            contentSize: options.contentSize,
            scrollPosition: options.scrollPosition,
            triggersVisibility: options.triggersVisibility,
            triggersOffsetCoefficients: options.triggersOffsetCoefficients,
            triggersPositions: options.triggersPositions,
            additionalTriggersOffsets: options.additionalTriggersOffsets,
            triggersOffsetMode: options.triggersOffsetMode,
            observersCallback: this._observersCallback.bind(this),
        });

        const calculatorConstructor = this._disableVirtualScroll
            ? CalculatorWithoutVirtualization
            : Calculator;
        this._calculator = new calculatorConstructor({
            triggersOffsets: this._observersController.getTriggersOffsets(),
            itemsSizes: this._itemsSizesController.getItemsSizes(),
            scrollPosition: options.scrollPosition,
            totalCount: options.totalCount,
            virtualScrollConfig: options.virtualScrollConfig,
            minVirtualScrollIndex: options.minVirtualScrollIndex,
            maxVirtualScrollIndex: options.maxVirtualScrollIndex,
            viewportSize: options.viewportSize,
            contentSize: options.contentSize,
            givenItemsSizes: options.givenItemsSizes,
            feature1183225611: options.feature1183225611,
            validateItemCallback: options.validateItemCallback,
        });

        this._inertialScrolling = options.inertialScrolling;
    }

    getListContainerSize(): number {
        return this._listContainerSize;
    }

    getListContainerOffset(): number {
        return this._itemsSizesController?.getListContainerOffset();
    }

    getViewportSize(): number {
        return this._viewportSize;
    }

    getItemsSizes(): IItemsSizes {
        return this._itemsSizesController.getItemsSizes();
    }

    getPlaceholders(): IPlaceholders {
        return this._calculator.getPlaceholders();
    }

    shouldDoScroll(): boolean {
        // Если размер списка меньше вьюпорта, то он не должен управлять скроллом.
        // Это бессмыслено, так как либо скролла нет, либо маленький список - не основной контент в этом скролле
        return (
            this._viewportSize - this._itemsSizesController.getViewportOverlaySize() <
            this._listContainerSize
        );
    }

    destroy(): void {
        this._observersController.destroy();
    }

    viewportResized(viewportSize: number): boolean {
        const changed = this._viewportSize !== viewportSize;
        if (changed) {
            this._viewportSize = viewportSize;

            const triggerOffsets = this._observersController.setViewportSize(viewportSize);
            if (!this._disableVirtualScroll) {
                (this._calculator as Calculator).setTriggerOffsets(triggerOffsets);
            }
            this._calculator.setViewportSize(viewportSize);
            this.updatePlaceholderAfterContent();
        }
        return changed;
    }

    listContainerResized(listContainerSize: number): boolean {
        const changed = this._listContainerSize !== listContainerSize;
        if (changed) {
            this._listContainerSize = listContainerSize;

            const triggerOffsets =
                this._observersController.setListContainerSize(listContainerSize);
            if (!this._disableVirtualScroll) {
                (this._calculator as Calculator).setTriggerOffsets(triggerOffsets);
            }
            this._calculator.setListContainerSize(listContainerSize);
            this.updatePlaceholderAfterContent();
        }
        return changed;
    }

    updatePlaceholderAfterContent(): void {
        if (this._placeholderAfterContent) {
            const listContainer = this._itemsSizesController.getListContainer();
            if (listContainer) {
                const resizer = listContainer.querySelector(PLACEHOLDER_AFTER_CONTENT_SELECTOR);
                const lastItemSize =
                    this._itemsSizesController.getItemsSizes()[
                        this._calculator.getTotalItemsCount() - 1
                    ];

                // Нужно мерить DOM элемент, так как наличие элемента в itemsSizes не гарантирует наличие его в DOM'е.
                // Там могут лежать предварительные размеры записей, которые в точности не совпадают с реальными.
                const lastItem = this.getElement(lastItemSize?.key);
                if (lastItem) {
                    const viewport =
                        this._viewportSize - this._itemsSizesController.getViewportOverlaySize();
                    const newSize = viewport - lastItem.offsetHeight;
                    resizer.style.setProperty(
                        '--placeholder_padding-bottom_height',
                        newSize + 'px'
                    );
                } else {
                    resizer.style.setProperty('--placeholder_padding-bottom_height', 0);
                }
            }
        }
    }

    updateViewportOverlaySize(): void {
        this._itemsSizesController.updateViewportOverlaySize();
    }

    updateItemsContainerSize(): boolean {
        return this._itemsSizesController.updateItemsContainerSize();
    }

    setScrollContainerSize(size: number): void {
        this._calculator.setScrollContainerSize(size);
    }

    getElement(key: string): HTMLElement {
        return this._itemsSizesController.getElement(key);
    }

    isListContainerHidden(): boolean {
        return this._itemsSizesController.isListContainerHidden();
    }

    getFirstVisibleItemIndex(): number {
        const stickyContentSize = this._itemsSizesController.getStickyContentSizeBeforeItems();
        return this._calculator.getFirstVisibleItemIndex(stickyContentSize);
    }

    setItemsRenderedOutsideRange(items: IRenderedOutsideItem[]): void {
        if (this._disableVirtualScroll) {
            return;
        }

        this._itemsSizesController.setItemsRenderedOutsideRange(items);
        const result = (this._calculator as Calculator).setItemsRenderedOutsideRange(items);
        this._processCalculatorResult(result, null);
    }

    getContentSizeBeforeList(): number {
        return this._calculator.getContentSizeBeforeList();
    }

    // region Triggers

    setBackwardTriggerVisibility(visible: boolean): void {
        this._observersController.setBackwardTriggerVisibility(visible);
    }

    setForwardTriggerVisibility(visible: boolean): void {
        this._observersController.setForwardTriggerVisibility(visible);
    }

    setBackwardTriggerPosition(position: ITriggerPosition): void {
        const triggerOffsets = this._observersController.setBackwardTriggerPosition(position);
        if (!this._disableVirtualScroll) {
            (this._calculator as Calculator).setTriggerOffsets(triggerOffsets);
        }
    }

    setForwardTriggerPosition(position: ITriggerPosition): void {
        const triggerOffsets = this._observersController.setForwardTriggerPosition(position);
        if (!this._disableVirtualScroll) {
            (this._calculator as Calculator).setTriggerOffsets(triggerOffsets);
        }
    }

    setAdditionalTriggersOffsets(additionalTriggersOffsets: IAdditionalTriggersOffsets): void {
        const triggersOffsets =
            this._observersController.setAdditionalTriggersOffsets(additionalTriggersOffsets);
        if (!this._disableVirtualScroll) {
            (this._calculator as Calculator).setTriggerOffsets(triggersOffsets);
        }
    }

    checkTriggersVisibility(): void {
        this._observersController.checkTriggersVisibility();
    }

    updateTriggers(): void {
        this._observersController.updateTriggers();
    }

    // endregion Triggers

    // region Update DOM elements

    /**
     * Обновить контейнер с элементами. Также пересчитывает размеры отображаемых в данный момент элементов.
     * @param {HTMLElement} newItemsContainer
     * @param givenItemsSizes Заранее данные размеры записей
     */
    setItemsContainer(newItemsContainer: HTMLElement, givenItemsSizes?: IItemsSizes): void {
        const updated = this._itemsSizesController.setItemsContainer(newItemsContainer);
        if (updated) {
            this._itemsSizesController.resetItems(
                this._calculator.getTotalItemsCount(),
                givenItemsSizes
            );
        }
    }

    /**
     * Обновить селектор элементов. Также пересчитывает размеры отображаемых в данный момент элементов.
     * @param {string} newItemsQuerySelector
     * @param givenItemsSizes Заранее данные размеры записей
     */
    setItemsQuerySelector(newItemsQuerySelector: string, givenItemsSizes?: IItemsSizes): void {
        this._itemsSizesController.setItemsQuerySelector(newItemsQuerySelector);
        this._itemsSizesController.resetItems(
            this._calculator.getTotalItemsCount(),
            givenItemsSizes
        );

        const newItemsSizes = this._itemsSizesController.updateItemsSizes(
            this._calculator.getRange()
        );
        if (this._calculator.updateItemsSizes(newItemsSizes, false)) {
            this._itemsSizesUpdatedCallback?.(newItemsSizes);
        }
    }

    /**
     * Обновить контейнер списочного контрола. Также производит реинициализацию observers.
     * @param {HTMLElement} newListContainer
     */
    setListContainer(newListContainer: HTMLElement): void {
        this._observersController.setListContainer(newListContainer);
        this._itemsSizesController.setListContainer(newListContainer);
        const newItemsSizes = this._itemsSizesController.getItemsSizes();
        this._calculator.updateItemsSizes(newItemsSizes, false);
        this.updateContentSizeBeforeList();
        this.updatePlaceholderAfterContent();
    }

    // Более плотная работа по управлению обработкой триггеров по задаче
    // https://online.sbis.ru/doc/55c59e45-b3fa-451c-b2b8-8e7ecf02be3b
    setTriggersAllowed(isAllowed: boolean): void {
        this._handleTriggers = isAllowed;
    }

    updateContentSizeBeforeList(): boolean {
        const contentSizeBeforeList = this._itemsSizesController.getContentSizeBeforeList();
        this._calculator.setContentSizeBeforeList(contentSizeBeforeList);
        return this._observersController.setContentSizeBeforeList(contentSizeBeforeList);
    }

    // endregion Update DOM elements

    // region Update items sizes

    updateItemsSizes(itemsRange: IItemsRange = this._calculator.getRange()): void {
        const newItemsSizes = this._itemsSizesController.updateItemsSizes(itemsRange);
        if (this._calculator.updateItemsSizes(newItemsSizes, false)) {
            this._itemsSizesUpdatedCallback?.(newItemsSizes);
        }
    }

    updateGivenItemsSizes(itemsSizes: IItemsSizes): void {
        if (this._disableVirtualScroll) {
            return;
        }

        (this._calculator as Calculator).updateGivenItemsSizes(itemsSizes);
    }

    // endregion Update items sizes

    // region Collection changes

    /**
     * Обрабатывает добавление элементов в коллекцию.
     * @param position Индекс элемента, после которого добавили записи
     * @param count Кол-во добавленных записей
     * @param scrollMode Режим скролла
     * @param calcMode Режим пересчета записей
     */
    addItems(position: number, count: number, scrollMode: IScrollMode, calcMode: ICalcMode): void {
        this._inertialScrolling.callAfterScrollStopped(() => {
            const itemsSizes = this._itemsSizesController.addItems(position, count);

            if (this._calculator.updateItemsSizes(itemsSizes, true)) {
                this._itemsSizesUpdatedCallback?.(itemsSizes);
            }

            // Не нужно при добавлении элементов задавать offset для триггеров.
            // Это нужно делать только при подгрузке записей по триггеру.
            // Например, при развороте узла мы можем этим спровоцировать еще
            // и подгрузку записей, которая явно будет лишней.
            const result = this._calculator.addItems(position, count, calcMode);
            this._processCalculatorResult(result, scrollMode);
        });
    }

    /**
     * Обрабатывает перемещение элементов внутри коллекции.
     * @param addPosition Индекс элемента, после которого вставили записи
     * @param addCount Кол-во добавляемых элементов
     * @param removePosition Индекс элемента откуда переместили записи
     * @param removeCount Кол-во удаляемых элементов
     */
    moveItems(
        addPosition: number,
        addCount: number,
        removePosition: number,
        removeCount: number
    ): void {
        this._inertialScrolling.callAfterScrollStopped(() => {
            const itemsSizes = this._itemsSizesController.moveItems(
                addPosition,
                addCount,
                removePosition,
                removeCount
            );
            if (this._calculator.updateItemsSizes(itemsSizes, true)) {
                this._itemsSizesUpdatedCallback?.(itemsSizes);
            }
        });
    }

    /**
     * Обрабатывает удаление элементов из коллекции.
     * @param position Индекс первого удаленного элемента.
     * @param count Кол-во удаленных элементов.
     * @param scrollMode Режим скролла
     */
    removeItems(position: number, count: number, scrollMode: IScrollMode): void {
        this._inertialScrolling.callAfterScrollStopped(() => {
            const itemsSizes = this._itemsSizesController.removeItems(position, count);
            if (this._calculator.updateItemsSizes(itemsSizes, true)) {
                this._itemsSizesUpdatedCallback?.(itemsSizes);
            }

            const result = this._calculator.removeItems(position, count);
            this._processCalculatorResult(result, scrollMode);
        });
    }

    /**
     * Обрабатывает пересоздание всех элементов коллекции.
     * @param totalCount Общее кол-во элементов в коллекции
     * @param initRange Диапазон, который задает изначальные значения start и end индексов.
     * @param givenItemsSizes Заранее данные размеры записей
     */
    resetItems(totalCount: number, initRange: IItemsRange, givenItemsSizes?: IItemsSizes): void {
        // Перезагрузка во время инерционного скролла должна останавливать скролл,
        // т.к. у нас полностью меняется набор данных и пытаться сохранить плавность инерционного скролла нет смысла
        // Вообще перезагрузка во время инерционного скролла крайне странный кейс.
        // Данная ошибка выстрелила из-за вызова doScroll над списком.
        this._inertialScrolling.endInertialScroll();

        const triggerOffsets = this._observersController.resetItems();
        if (!this._disableVirtualScroll) {
            (this._calculator as Calculator).setTriggerOffsets(triggerOffsets);
        }

        const newItemsSizes = this._itemsSizesController.resetItems(totalCount, givenItemsSizes);
        if (this._calculator.updateItemsSizes(newItemsSizes, true)) {
            this._itemsSizesUpdatedCallback?.(newItemsSizes);
        }

        const result = this._calculator.resetItems(totalCount, initRange);

        // TODO SCROLL нужно будет удалить
        // Код нужен только для того, чтобы у триггера проставить оффсет после инициализации.
        // НО при иницализации оффсет у триггера не нужен в этом кейсе.(чтобы избежать лишних подгрузок)
        // Удалить, после внедрения. Нужно будет поправить тест. Внедряемся без каких-либо изменений тестов.
        if (!this._disableVirtualScroll) {
            const hasItemsOutsideOfRange = {
                backward: (this._calculator as Calculator).hasItemsOutsideOfRange('backward'),
                forward: (this._calculator as Calculator).hasItemsOutsideOfRange('forward'),
            };
            if (hasItemsOutsideOfRange.backward) {
                this.setBackwardTriggerPosition('offset');
            }
            if (hasItemsOutsideOfRange.forward) {
                this.setForwardTriggerPosition('offset');
            }
        }

        this._handleInitializingResult(result);
    }

    // endregion Collection changes

    // region Scroll

    /**
     * Возвращает крайний видимый элемент
     * @param params
     */
    getEdgeVisibleItem(params: IEdgeItemCalculatingParams): IEdgeItem {
        return this._calculator.getEdgeVisibleItem(params);
    }

    getScrollPositionToEdgeItem(edgeItem: IEdgeItem): number {
        return this._calculator.getScrollPositionToEdgeItem(edgeItem);
    }

    /**
     * Возвращает способ скролла к следующей/предыдущей страницы в зависимости от размера крайней записи
     */
    getScrollToPageMode(edgeItemKey: string): IScrollToPageMode {
        // Если запись меньше трети вьюпорта, то скроллим к ней на pageUp|pageDown, чтобы не разбивать мелкие записи.
        // Иначе, скроллим как обычно, на высоту вьюпорта
        const MAX_SCROLL_TO_EDGE_ITEM_RELATION = 3;
        const itemSize = this._itemsSizesController.getItemsSizes().find((item) => {
            return item.key === edgeItemKey;
        })?.size;
        if (
            itemSize * MAX_SCROLL_TO_EDGE_ITEM_RELATION > this._viewportSize ||
            this._disableVirtualScroll
        ) {
            return 'viewport';
        } else {
            return 'edgeItem';
        }
    }

    /**
     * Скроллит к элементу по переданному индексу.
     * При необходимости смещает диапазон.
     * @param itemIndex Индекс элемента, к которому нужно проскроллить.
     * @param force
     * @param position Положение, в котором должна оказаться запись после подскролла
     * @return {boolean} Изменился ли диапазон отображаемых записей.
     */
    scrollToItem(itemIndex: number, force?: boolean, position?: string): boolean {
        if (this._disableVirtualScroll) {
            return false;
        }

        const result = (this._calculator as Calculator).shiftRangeToIndex(
            itemIndex,
            force,
            position
        );
        this._processCalculatorResult(result, 'fixed');
        return result.indexesChanged;
    }

    /**
     * Сдвигает диапазон отображаемых элементов к позиции скролла.
     * Используется при нажатии в скролбар в позицию, где записи уже скрыты виртуальным скроллом.
     * @param position Позиция скролла.
     */
    scrollToVirtualPosition(position: number): boolean {
        if (this._disableVirtualScroll) {
            return false;
        }

        const result = (this._calculator as Calculator).shiftRangeToVirtualScrollPosition(position);
        this._processCalculatorResult(result, 'fixed');
        return result.indexesChanged;
    }

    /**
     * Обрабатывает изменение позиции при скролле.
     * Используется при обычном скролле списка.
     * @param position
     * @param updateActiveElement Нужно ли обновлять активный эелемент
     */
    scrollPositionChange(position: number, updateActiveElement: boolean): void {
        const viewportOverlaySize = this._itemsSizesController.getViewportOverlaySize();
        const result = this._calculator.scrollPositionChange(
            position,
            updateActiveElement,
            viewportOverlaySize
        );
        this._processActiveElementIndexChanged(result);
        this._observersController.setScrollPosition(position);
    }

    shouldShiftRangeBeforeScrollToItem(index: number, position?: string, force?: boolean): boolean {
        return this._calculator.shouldShiftRangeBeforeScrollToItem(index, position, force);
    }

    // endregion Scroll

    getInvertedIndexes(index: number, offsetBeforeItem: number): TInvertedIndexes {
        return (this._calculator as Calculator).getInvertedIndexes(index, offsetBeforeItem);
    }

    setActiveElementIndex(activeElementIndex: number): void {
        this._calculator.setActiveElementIndex(activeElementIndex);
    }

    updateMinMaxIndexes(minIndex?: number, maxIndex?: number): void {
        const result = this._calculator.updateMinMaxIndexes(minIndex, maxIndex);
        this._processCalculatorResult(result, null);
    }

    // region Private API

    /**
     * Callback, вызываемый при достижении триггера.
     * Вызывает сдвиг itemsRange в направлении триггера.
     * В зависимости от результатов сдвига itemsRange вызывает indexesChangedCallback или itemsEndedCallback.
     * @param direction
     * @private
     */
    private _observersCallback(direction: IDirection): void {
        if (!this._handleTriggers) {
            return;
        }

        // после первого срабатывания триггера сбрасываем флаг resetTriggerOffset.
        // Чтобы дальше триггер срабатывал заранее за счет оффсета.
        let triggerOffsets;
        if (direction === 'forward') {
            triggerOffsets = this._observersController.setForwardTriggerPosition('offset');
        } else {
            triggerOffsets = this._observersController.setBackwardTriggerPosition('offset');
        }

        this._inertialScrolling.callAfterScrollStopped(() => {
            // НЕЛЬЗЯ делать рассчеты связанные со scrollPosition.
            // Т.к. в момент срабатывания триггера scrollPosition может быть не актуален.
            // Актуальное значение прийдет только после триггера в событии scrollMoveSync.
            // Выходит след-ая цепочка вызовов: scrollMoveSync -> observerCallback -> scrollMoveSync.
            let result = null;
            if (!this._disableVirtualScroll) {
                (this._calculator as Calculator).setTriggerOffsets(triggerOffsets);

                result = (this._calculator as Calculator).shiftRangeToDirection(direction);
                this._processCalculatorResult(result, 'fixed');
            }

            if (this._disableVirtualScroll || (result && !result.indexesChanged)) {
                // itemsEndedCallback должен вызываться ТОЛЬКО ТУТ,
                // загрузка осуществляется ТОЛЬКО по достижению триггера
                if (this._itemsEndedCallback) {
                    this._itemsEndedCallback(direction);
                }
            }
        });
    }

    /**
     * При изменении activeElementIndex обеспечивает activeElementChangedCallback.
     * @param {IActiveElementIndexChanged} result
     * @private
     */
    private _processActiveElementIndexChanged(result: IActiveElementIndexChanged): void {
        if (
            result.activeElementIndexChanged &&
            !this._itemsSizesController.isListContainerHidden()
        ) {
            if (this._activeElementChangedCallback) {
                this._activeElementChangedCallback(result.activeElementIndex);
            }
        }
    }

    /**
     * В зависимости от результатов сдвига itemsRange вызывает indexesChangedCallback.
     * Также, по необходимости, обеспечивает вызов activeElementChangedCallback.
     * @param {ICalculatorResult} result
     * @param scrollMode
     * @private
     */
    private _processCalculatorResult(result: ICalculatorResult, scrollMode: IScrollMode): void {
        if (result.placeholdersChanged) {
            this._observersController.setPlaceholders(result.placeholders);
            this._placeholdersChangedCallback(result.placeholders);
        }

        if (result.hasItemsOutsideOfRangeChanged) {
            this._observersController.setHasItemsOutRange(result.hasItemsOutsideOfRange);
            if (this._hasItemsOutRangeChangedCallback) {
                this._hasItemsOutRangeChangedCallback(result.hasItemsOutsideOfRange);
            }
        }

        if (result.indexesChanged) {
            this._indexesChangedCallback({
                range: result.range,
                oldState: result.oldState,
                shiftDirection: result.shiftDirection,
                restoreDirection: result.restoreDirection,
                scrollMode,
            });
        }
    }

    private _handleInitializingResult(result: ICalculatorResult): void {
        this._indexesInitializedCallback({
            range: result.range,
            oldState: result.oldState,
            shiftDirection: null,
            restoreDirection: null,
            scrollMode: null,
        });

        const hasItemsOutsideOfRange: IHasItemsOutsideOfRange = this._disableVirtualScroll
            ? { backward: false, forward: false }
            : {
                  backward: (this._calculator as Calculator).hasItemsOutsideOfRange('backward'),
                  forward: (this._calculator as Calculator).hasItemsOutsideOfRange('forward'),
              };

        // Даже если выключен виртуальный скролл нужно вызвать этот код.
        // Например, для того чтобы инициализировалось состояние теней в scrollContainer.
        this._observersController.setHasItemsOutRange(hasItemsOutsideOfRange);
        this._hasItemsOutRangeChangedCallback(hasItemsOutsideOfRange);
    }

    // endregion Private API
}
