/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import {
    AbstractItemsSizesController,
    IAbstractItemsSizesControllerOptions,
    IItemsSizes,
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
} from './Calculator/Calculator';
import CalculatorWithoutVirtualization from './Calculator/CalculatorWithoutVirtualization';
import { CrudEntityKey } from 'Types/source';
import type { IEdgeItemCalculatingParams } from './AbstractListVirtualScrollController';
import {
    IAbstractCalculatorState,
    IActiveElementIndexChanged,
} from 'Controls/_baseList/Controllers/ScrollController/Calculator/AbstractCalculator';
import InertialScrolling from 'Controls/_baseList/resources/utils/InertialScrolling';
import { detection } from 'Env/Env';

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
export interface IIndexesChangedParams<
    TState extends IAbstractCalculatorState
> {
    /**
     * Направление, в котором был смещен диапазон.
     * @remark Возможно значение null. Это значит, что не возможно определить направление. Например, reset.
     */
    shiftDirection: IDirection | null;
    range: IItemsRange;
    oldState: TState;
    scrollMode: IScrollMode;
}

/**
 * Варианты значений режима работы скролла
 * @typedef {String} Controls/_baseList/Controllers/ScrollController/ScrollController/IScrollMode
 * @variant fixed DOM-элемент первой видимой записи должен сохранять свою позицию
 * относительно viewPort после смещения диапазона.
 * @variant unfixed DOM-элемент первой видимой записи не сохраняет свою позицию
 * относительно viewPort после смещения диапазона, а сдвигается по нативным правилам.
 */
export type IScrollMode = 'fixed' | 'unfixed';

/**
 * Варианты значений режима пересчета диапазона
 * @typedef {String} Controls/_baseList/Controllers/ScrollController/ScrollController/ICalcMode
 * @variant shift Диапазон смещается (пересчитывается и startIndex и stopIndex)
 * @variant extend Диапазон расширяется (пересчитывается или startIndex или stopIndex, зависит от направления)
 * @variant nothing Диапазон не пересчитывается
 */
export type ICalcMode = 'shift' | 'extend' | 'nothing';

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

export type IIndexesChangedCallback = (
    params: IIndexesChangedParams<ICalculatorState>
) => void;

export type IActiveElementChangedChangedCallback = (
    activeElementIndex: number
) => void;

export type IItemsEndedCallback = (direction: IDirection) => void;

export type IIndexesInitializedCallback = (
    range: IIndexesChangedParams<ICalculatorState>
) => void;

export type IHasItemsOutRangeChangedCallback = (
    hasItems: IHasItemsOutsideOfRange
) => void;

export type IPlaceholdersChangedCallback = (
    placeholders: IPlaceholders
) => void;

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
    feature1184208466?: boolean;
}

/**
 * Класс предназначен для управления scroll и обеспечивает:
 *   - генерацию событий о достижении границ контента (работа с триггерами);
 *   - scroll к записи / к границе (при необходимости - пересчёт range);
 *   - сохранение / восстановление позиции scroll.
 * @private
 */
export class ScrollController {
    private readonly _inertialScrolling: InertialScrolling =
        new InertialScrolling();

    private readonly _itemsSizesController: AbstractItemsSizesController;
    private readonly _observersController: AbstractObserversController;
    private readonly _calculator: Calculator | CalculatorWithoutVirtualization;
    private readonly _indexesChangedCallback: IIndexesChangedCallback;
    private readonly _activeElementChangedCallback: IActiveElementChangedChangedCallback;
    private readonly _hasItemsOutRangeChangedCallback: IHasItemsOutRangeChangedCallback;
    private readonly _placeholdersChangedCallback: IPlaceholdersChangedCallback;
    private readonly _itemsEndedCallback: IItemsEndedCallback;
    private readonly _indexesInitializedCallback: IIndexesInitializedCallback;

    private _viewportSize: number = 0;
    private _listContainerSize: number = 0;

    private _handleTriggers: boolean = true;
    private readonly _disableVirtualScroll: boolean;

    constructor(options: IScrollControllerOptions) {
        this._indexesChangedCallback = options.indexesChangedCallback;
        this._hasItemsOutRangeChangedCallback =
            options.hasItemsOutRangeChangedCallback;
        this._placeholdersChangedCallback = options.placeholdersChangedCallback;
        this._activeElementChangedCallback =
            options.activeElementChangedCallback;
        this._itemsEndedCallback = options.itemsEndedCallback;
        this._indexesInitializedCallback = options.indexesInitializedCallback;

        this._viewportSize = options.viewportSize;
        this._listContainerSize = options.contentSize;

        this._disableVirtualScroll = options.disableVirtualScroll;

        this._itemsSizesController = new options.itemsSizeControllerConstructor(
            {
                itemsContainer: options.itemsContainer,
                itemsQuerySelector: options.itemsQuerySelector,
                totalCount: options.totalCount,
                feature1184208466: options.feature1184208466,
            }
        );

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
            viewportSize: options.viewportSize,
            contentSize: options.contentSize,
            givenItemsSizes: options.givenItemsSizes,
            feature1183225611: options.feature1183225611,
            validateItemCallback: options.validateItemCallback,
        });
    }

    getListContainerSize(): number {
        return this._listContainerSize;
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
            this._viewportSize -
                this._itemsSizesController.getViewportOverlaySize() <
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

            const triggerOffsets =
                this._observersController.setViewportSize(viewportSize);
            if (!this._disableVirtualScroll) {
                (this._calculator as Calculator).setTriggerOffsets(
                    triggerOffsets
                );
            }
            this._calculator.setViewportSize(viewportSize);
        }
        return changed;
    }

    listContainerResized(listContainerSize: number): boolean {
        const changed = this._listContainerSize !== listContainerSize;
        if (changed) {
            this._listContainerSize = listContainerSize;

            const triggerOffsets =
                this._observersController.setListContainerSize(
                    listContainerSize
                );
            if (!this._disableVirtualScroll) {
                (this._calculator as Calculator).setTriggerOffsets(
                    triggerOffsets
                );
            }
            this._calculator.setListContainerSize(listContainerSize);
        }
        return changed;
    }

    updateViewportOverlaySize(): void {
        this._itemsSizesController.updateViewportOverlaySize();
    }

    setScrollContainerSize(size: number): void {
        this._calculator.setScrollContainerSize(size);
    }

    getElement(key: CrudEntityKey): HTMLElement {
        return this._itemsSizesController.getElement(key);
    }

    isListContainerHidden(): boolean {
        return this._itemsSizesController.isListContainerHidden();
    }

    getFirstVisibleItemIndex(): number {
        const stickyContentSize =
            this._itemsSizesController.getStickyContentSizeBeforeItems();
        return this._calculator.getFirstVisibleItemIndex(stickyContentSize);
    }

    setItemsRenderedOutsideRange(items: string[]): void {
        if (this._disableVirtualScroll) {
            return;
        }

        this._itemsSizesController.setItemsRenderedOutsideRange(items);
        const result = (
            this._calculator as Calculator
        ).setItemsRenderedOutsideRange(items);
        this._processCalculatorResult(result, null);
    }

    // region Triggers

    setBackwardTriggerVisibility(visible: boolean): void {
        this._observersController.setBackwardTriggerVisibility(visible);
    }

    setForwardTriggerVisibility(visible: boolean): void {
        this._observersController.setForwardTriggerVisibility(visible);
    }

    setBackwardTriggerPosition(position: ITriggerPosition): void {
        const triggerOffsets =
            this._observersController.setBackwardTriggerPosition(position);
        if (!this._disableVirtualScroll) {
            (this._calculator as Calculator).setTriggerOffsets(triggerOffsets);
        }
    }

    setForwardTriggerPosition(position: ITriggerPosition): void {
        const triggerOffsets =
            this._observersController.setForwardTriggerPosition(position);
        if (!this._disableVirtualScroll) {
            (this._calculator as Calculator).setTriggerOffsets(triggerOffsets);
        }
    }

    setAdditionalTriggersOffsets(
        additionalTriggersOffsets: IAdditionalTriggersOffsets
    ): void {
        const triggersOffsets =
            this._observersController.setAdditionalTriggersOffsets(
                additionalTriggersOffsets
            );
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
    setItemsContainer(
        newItemsContainer: HTMLElement,
        givenItemsSizes?: IItemsSizes
    ): void {
        this._itemsSizesController.setItemsContainer(newItemsContainer);
        this._itemsSizesController.resetItems(
            this._calculator.getTotalItemsCount(),
            givenItemsSizes
        );
    }

    /**
     * Обновить селектор элементов. Также пересчитывает размеры отображаемых в данный момент элементов.
     * @param {string} newItemsQuerySelector
     * @param givenItemsSizes Заранее данные размеры записей
     */
    setItemsQuerySelector(
        newItemsQuerySelector: string,
        givenItemsSizes?: IItemsSizes
    ): void {
        this._itemsSizesController.setItemsQuerySelector(newItemsQuerySelector);
        this._itemsSizesController.resetItems(
            this._calculator.getTotalItemsCount(),
            givenItemsSizes
        );

        const newItemsSizes = this._itemsSizesController.updateItemsSizes(
            this._calculator.getRange()
        );
        this._calculator.updateItemsSizes(newItemsSizes, false);
    }

    /**
     * Обновить контейнер списочного контрола. Также производит реинициализацию observers.
     * @param {HTMLElement} newListContainer
     */
    setListContainer(newListContainer: HTMLElement): void {
        this._observersController.setListContainer(newListContainer);
        this._itemsSizesController.setListContainer(newListContainer);
        this.updateContentSizeBeforeList();
    }

    // Более плотная работа по управлению обработкой триггеров по задаче
    // https://online.sbis.ru/doc/55c59e45-b3fa-451c-b2b8-8e7ecf02be3b
    setTriggersAllowed(isAllowed: boolean): void {
        this._handleTriggers = isAllowed;
    }

    updateContentSizeBeforeList(): boolean {
        const contentSizeBeforeList =
            this._itemsSizesController.getContentSizeBeforeList();
        if (!this._disableVirtualScroll) {
            (this._calculator as Calculator).setContentSizeBeforeList(
                contentSizeBeforeList
            );
        }
        return this._observersController.setContentSizeBeforeList(
            contentSizeBeforeList
        );
    }

    // endregion Update DOM elements

    // region Update items sizes

    updateItemsSizes(
        itemsRange: IItemsRange = this._calculator.getRange()
    ): void {
        const newItemsSizes =
            this._itemsSizesController.updateItemsSizes(itemsRange);
        this._calculator.updateItemsSizes(newItemsSizes, false);
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
    addItems(
        position: number,
        count: number,
        scrollMode: IScrollMode,
        calcMode: ICalcMode
    ): void {
        this._inertialScrolling.callAfterScrollStopped(() => {
            const itemsSizes = this._itemsSizesController.addItems(
                position,
                count
            );
            this._calculator.updateItemsSizes(itemsSizes, true);

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
            this._calculator.updateItemsSizes(itemsSizes, true);
        });
    }

    /**
     * Обрабатывает удаление элементов из коллекции.
     * @param position Индекс первого удаленного элемента.
     * @param count Кол-во удаленных элементов.
     * @param scrollMode Режим скролла
     */
    removeItems(
        position: number,
        count: number,
        scrollMode: IScrollMode
    ): void {
        this._inertialScrolling.callAfterScrollStopped(() => {
            const result = this._calculator.removeItems(position, count);

            const itemsSizes = this._itemsSizesController.removeItems(
                position,
                count
            );
            this._calculator.updateItemsSizes(itemsSizes, true);

            this._processCalculatorResult(result, scrollMode);
        });
    }

    /**
     * Обрабатывает пересоздание всех элементов коллекции.
     * @param totalCount Общее кол-во элементов в коллекции
     * @param initRange Диапазон, который задает изначальные значения start и end индексов.
     * @param givenItemsSizes Заранее данные размеры записей
     */
    resetItems(
        totalCount: number,
        initRange: IItemsRange,
        givenItemsSizes?: IItemsSizes
    ): void {
        // Перезагрузка во время инерционного скролла должна останавливать скролл,
        // т.к. у нас полностью меняется набор данных и пытаться сохранить плавность инерционного скролла нет смысла
        // Вообще перезагрузка во время инерционного скролла крайне странный кейс.
        // Данная ошибка выстрелила из-за вызова doScroll над списком.
        this._inertialScrolling.endInertialScroll();

        const triggerOffsets = this._observersController.resetItems();
        if (!this._disableVirtualScroll) {
            (this._calculator as Calculator).setTriggerOffsets(triggerOffsets);
        }

        const newItemsSizes = this._itemsSizesController.resetItems(
            totalCount,
            givenItemsSizes
        );
        this._calculator.updateItemsSizes(newItemsSizes, true);

        const result = this._calculator.resetItems(totalCount, initRange);

        // TODO SCROLL нужно будет удалить
        // Код нужен только для того, чтобы у триггера проставить оффсет после инициализации.
        // НО при иницализации оффсет у триггера не нужен в этом кейсе.(чтобы избежать лишних подгрузок)
        // Удалить, после внедрения. Нужно будет поправить тест. Внедряемся без каких-либо изменений тестов.
        if (!this._disableVirtualScroll) {
            const hasItemsOutsideOfRange = {
                backward: (
                    this._calculator as Calculator
                ).hasItemsOutsideOfRange('backward'),
                forward: (
                    this._calculator as Calculator
                ).hasItemsOutsideOfRange('forward'),
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
        const itemSize = this._itemsSizesController
            .getItemsSizes()
            .find((item) => {
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
    scrollToItem(
        itemIndex: number,
        force?: boolean,
        position?: string
    ): boolean {
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

        const result = (
            this._calculator as Calculator
        ).shiftRangeToVirtualScrollPosition(position);
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
        if (detection.isMobileIOS) {
            this._inertialScrolling.scrollStarted();
        }
        const viewportOverlaySize =
            this._itemsSizesController.getViewportOverlaySize();
        const result = this._calculator.scrollPositionChange(
            position,
            updateActiveElement,
            viewportOverlaySize
        );
        this._processActiveElementIndexChanged(result);
        this._observersController.setScrollPosition(position);
    }

    hasEnoughContentToScrollToItem(
        index: number,
        position?: string,
        force?: boolean
    ): boolean {
        return this._calculator.hasEnoughContentToScrollToItem(
            index,
            position,
            force
        );
    }

    // endregion Scroll

    setActiveElementIndex(activeElementIndex: number): void {
        this._calculator.setActiveElementIndex(activeElementIndex);
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
            triggerOffsets =
                this._observersController.setForwardTriggerPosition('offset');
        } else {
            triggerOffsets =
                this._observersController.setBackwardTriggerPosition('offset');
        }

        this._inertialScrolling.callAfterScrollStopped(() => {
            // НЕЛЬЗЯ делать рассчеты связанные со scrollPosition.
            // Т.к. в момент срабатывания триггера scrollPosition может быть не актуален.
            // Актуальное значение прийдет только после триггера в событии scrollMoveSync.
            // Выходит след-ая цепочка вызовов: scrollMoveSync -> observerCallback -> scrollMoveSync.
            let result = null;
            if (!this._disableVirtualScroll) {
                (this._calculator as Calculator).setTriggerOffsets(
                    triggerOffsets
                );

                result = (this._calculator as Calculator).shiftRangeToDirection(
                    direction
                );
                this._processCalculatorResult(result, 'fixed');
            }

            if (
                this._disableVirtualScroll ||
                (result && !result.indexesChanged)
            ) {
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
    private _processActiveElementIndexChanged(
        result: IActiveElementIndexChanged
    ): void {
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
    private _processCalculatorResult(
        result: ICalculatorResult,
        scrollMode: IScrollMode
    ): void {
        if (result.placeholdersChanged) {
            this._observersController.setPlaceholders(result.placeholders);
            this._placeholdersChangedCallback(result.placeholders);
        }

        if (result.hasItemsOutsideOfRangeChanged) {
            this._observersController.setHasItemsOutRange(
                result.hasItemsOutsideOfRange
            );
            if (this._hasItemsOutRangeChangedCallback) {
                this._hasItemsOutRangeChangedCallback(
                    result.hasItemsOutsideOfRange
                );
            }
        }

        if (result.indexesChanged) {
            this._indexesChangedCallback({
                range: result.range,
                oldState: result.oldState,
                shiftDirection: result.shiftDirection,
                scrollMode,
            });
        }
    }

    private _handleInitializingResult(result: ICalculatorResult): void {
        this._indexesInitializedCallback({
            range: result.range,
            oldState: result.oldState,
            shiftDirection: result.shiftDirection,
            scrollMode: null,
        });

        const hasItemsOutsideOfRange: IHasItemsOutsideOfRange = this
            ._disableVirtualScroll
            ? { backward: false, forward: false }
            : {
                  backward: (
                      this._calculator as Calculator
                  ).hasItemsOutsideOfRange('backward'),
                  forward: (
                      this._calculator as Calculator
                  ).hasItemsOutsideOfRange('forward'),
              };

        // Даже если выключен виртуальный скролл нужно вызвать этот код.
        // Например, для того чтобы инициализировалось состояние теней в scrollContainer.
        this._observersController.setHasItemsOutRange(hasItemsOutsideOfRange);
        this._hasItemsOutRangeChangedCallback(hasItemsOutsideOfRange);
    }

    // endregion Private API
}
