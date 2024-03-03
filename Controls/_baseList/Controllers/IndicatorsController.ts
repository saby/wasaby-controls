/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Collection, EIndicatorState, TIndicatorPosition, TIndicatorState } from 'Controls/display';
import { detection } from 'Env/Env';
import { RecordSet } from 'Types/collection';
import { ScrollControllerLib } from 'Controls/listsCommonLogic';

export interface IIndicatorsControllerOptions {
    model: Collection;
    items: RecordSet;
    isInfinityNavigation: boolean;
    isMaxCountNavigation: boolean;
    hasMoreDataToTop: boolean;
    hasMoreDataToBottom: boolean;
    shouldShowEmptyTemplate: boolean;
    scrollToFirstItem: (onDrawItems?: boolean) => void;
    displayBackwardTrigger?: () => void;
    hasHiddenItemsByVirtualScroll: (direction: 'up' | 'down') => boolean;
    hasError: () => boolean;
    attachLoadTopTriggerToNull: boolean; // TODO LI переименовать
    attachLoadDownTriggerToNull: boolean; // TODO LI переименовать
    supportIterativeLoading: boolean;
    stopDisplayPortionedSearchCallback: () => void;
    isIterativeLoading: boolean;
    iterativeLoadPageSize: number;
    iterativeLoadTimeout: number;

    /**
     * Наличие асинхронного рендеринга записей
     * TODO: убрать, когда построение будет только синхронным.
     * @protected
     */
    feature1184208466?: boolean;
}

const INDICATOR_DELAY = 2000;
export const INDICATOR_HEIGHT = 48;

const DEFAULT_ITERATIVE_LOADING_TIMEOUT = 30; // 30 секунд
const S_TO_MS_FACTOR = 1000;

enum SEARCH_STATES {
    NOT_STARTED = 0,
    STARTED = 'started',
    STOPPED = 'stopped',
    CONTINUED = 'continued',
    ABORTED = 'aborted',
}

type TPortionedSearchDirection = 'top' | 'bottom';

export const DIRECTION_COMPATIBILITY = {
    top: 'up',
    up: 'top',
    bottom: 'down',
    down: 'bottom',
};

/**
 * Контроллер, который управляет отображением индикаторов
 * @private
 */
export default class IndicatorsController {
    private _options: IIndicatorsControllerOptions;
    private _model: Collection;
    private _viewportFilled: boolean = false;
    private _unconditionallyDisplayTopIndicator: boolean = false;

    private _displayIndicatorTimer: number;

    private _portionedSearchDirection: TPortionedSearchDirection;
    private _portionedSearchTimer: number = null;
    private _searchState: SEARCH_STATES = 0;

    private _hasNotRenderedChanges: boolean = false;
    private _startDisplayDrawingIndicator: boolean = false;
    private _startDisplayGlobalIndicator: boolean = false;
    private _startDisplayBottomIndicator: boolean = false;

    private _loadingToDirectionInProgress: boolean;
    private _wasReload: boolean;
    private _mounted: boolean = false;
    private _wasInitializedIndicators: boolean = false;
    private _countLoadedItemsByIteration: number = 0;

    constructor(options: IIndicatorsControllerOptions) {
        this._options = options;
        this._model = options.model;

        if (this._options.isIterativeLoading) {
            const hasMoreData = this._options.hasMoreDataToBottom || this._options.hasMoreDataToTop;
            if (hasMoreData) {
                const direction = this._options.hasMoreDataToBottom ? 'bottom' : 'top';
                this.startDisplayPortionedSearch(direction);
            }
            // Есть реестры, которые при маунте уже начинают загрузку и изначально загруженные записи нужно учесть
            this._countLoadedItemsByIteration = this._model.getSourceCollection().getCount();
        }
    }

    /**
     * Обновляет опции и пересчитывает необходимые индикаторы.
     * @param {IIndicatorsControllerOptions} options Опции контроллера
     * @param {boolean} isLoading Флаг, означающий что в данный момент идет загрузка.
     * @return {boolean} Возвращает флаг, что изменились значения сброса оффсета триггера
     */
    updateOptions(options: IIndicatorsControllerOptions, isLoading: boolean): void {
        // во время загрузки sourceController всегда возвращает hasMore = false, а корректным значение будет
        // уже только после загрузки, поэтому hasMore обновим только после загрузки
        if (isLoading) {
            options.hasMoreDataToBottom = this._options.hasMoreDataToBottom;
            options.hasMoreDataToTop = this._options.hasMoreDataToTop;
        }
        const navigationChanged =
            this._options.isInfinityNavigation !== options.isInfinityNavigation;

        const shouldRecountAllIndicators = options.model && this._model !== options.model;
        const shouldRecountBottomIndicator =
            !shouldRecountAllIndicators &&
            (this._options.hasMoreDataToBottom !== options.hasMoreDataToBottom ||
                navigationChanged);
        const shouldRecountTopIndicator =
            !shouldRecountAllIndicators &&
            (this._options.hasMoreDataToTop !== options.hasMoreDataToTop || navigationChanged);

        this._options = options;
        this._model = options.model;

        if (shouldRecountAllIndicators) {
            this.recountIndicators('all', true);
        }
        if (shouldRecountTopIndicator) {
            this.recountIndicators('up', false);
        }
        if (shouldRecountBottomIndicator) {
            this.recountIndicators('down', false);
        }
    }

    initializeIndicators(): void {
        this._wasInitializedIndicators = true;
        if (this._viewportFilled && !this._options.isIterativeLoading && !this._wasReload) {
            if (this.shouldDisplayTopIndicator()) {
                this.displayTopIndicator(true);
            }
            if (this.shouldDisplayBottomIndicator()) {
                this.displayBottomIndicator();
            }
        }
    }

    /**
     * Обновляет значения опций, есть ли еще данные вверх или вниз.
     * @param {boolean} hasMoreToTop Есть ли данные вверх
     * @param {boolean} hasMoreToBottom Есть ли данные вниз
     * @void
     */
    setHasMoreData(hasMoreToTop: boolean, hasMoreToBottom: boolean): void {
        this._options.hasMoreDataToTop = hasMoreToTop;
        this._options.hasMoreDataToBottom = hasMoreToBottom;
    }

    setIterativeLoading(iterativeLoading: boolean): void {
        this._options.isIterativeLoading = iterativeLoading;
    }

    isEmptyTemplateDisplayed(): boolean {
        return this._options.shouldShowEmptyTemplate;
    }

    setEmptyTemplateDisplayed(value: boolean): void {
        this._options.shouldShowEmptyTemplate = value;
    }

    /**
     * Устанавливает значение флага, viewportFilled. Который означает, что у нас заполненн весь вьюпорт.
     * Это нужно для правильного отображения верхней ромашки. Т.к. подгрузка должна идти только в одну сторону
     * и в первую очередь вниз, и пока данные не занимают весь вьюпорт мы грузим(и отображаем ромашку) только вниз
     * @param viewportFilled
     */
    setViewportFilled(viewportFilled: boolean): void {
        if (this._viewportFilled !== viewportFilled) {
            this._viewportFilled = viewportFilled;
            if (viewportFilled && this._mounted && !this.isDisplayedPortionedSearch()) {
                if (this.shouldDisplayTopIndicator()) {
                    this.displayTopIndicator(true);
                }
                if (this.shouldDisplayBottomIndicator()) {
                    this.displayBottomIndicator();
                }
            }
        }
    }

    /**
     * Обрабатывает начало загрузки данных
     * @param direction
     */
    onDataLoadStarted(direction?: ScrollControllerLib.IDirection): void {
        if (direction) {
            if (!this._loadingToDirectionInProgress && !this._options.isIterativeLoading) {
                this._loadingToDirectionInProgress = true;
                this._updateIndicatorsState(DIRECTION_COMPATIBILITY[direction]);
            }
        } else {
            this.endDisplayPortionedSearch();
        }
    }

    /**
     * Обрабатывает загрузку данных
     */
    onDataLoad(loadedItems: RecordSet, direction?: ScrollControllerLib.IDirection): void {
        if (this.shouldHideGlobalIndicator()) {
            this.hideGlobalIndicator();
        }

        if (this._loadingToDirectionInProgress) {
            this._loadingToDirectionInProgress = false;
            if (direction) {
                this._updateIndicatorsState(DIRECTION_COMPATIBILITY[direction]);
            }
        }

        const isReload = !direction;
        if (isReload) {
            this._wasReload = true;
            this.hideIndicator('top');
            this.hideIndicator('bottom');
            this.setViewportFilled(false);

            // Всегда завершаем порционный поиск и при необходимости далее запустим его
            this.endDisplayPortionedSearch();
            if (
                this._options.supportIterativeLoading &&
                this._options.isIterativeLoading &&
                (this._options.hasMoreDataToBottom || this._options.hasMoreDataToTop)
            ) {
                const direction = this._options.hasMoreDataToBottom ? 'bottom' : 'top';
                this.startDisplayPortionedSearch(direction);
            } else {
                this.recountIndicators('all', true);
            }
        } else {
            // проверять что сейчас порционный поиск по метаданным нельзя,
            // т.к. в этот момент могут сказать что вниз порционный поиск закончился(metaData.iterative = false)
            const isIterativeLoading =
                this._options.isIterativeLoading || !!this.getPortionedSearchDirection();
            if (isIterativeLoading) {
                const hasNotMoreDataToCurrentDirection =
                    (direction === 'up' && !this._options.hasMoreDataToTop) ||
                    (direction === 'down' && !this._options.hasMoreDataToBottom);

                if (hasNotMoreDataToCurrentDirection) {
                    this.endDisplayPortionedSearch();

                    const anotherDirection = direction === 'up' ? 'down' : 'up';
                    const hasMoreDataToAnotherDirection =
                        (anotherDirection === 'up' && this._options.hasMoreDataToTop) ||
                        (anotherDirection === 'down' && this._options.hasMoreDataToBottom);
                    if (hasMoreDataToAnotherDirection) {
                        // Если выполнена последняя подгрузка в сторону и есть данные в другую сторону,
                        // то нужно в другую сторону показать индикатор с триггером.
                        // Чтобы по триггеру, можно было начать итеративную загрузку в другую сторону.
                        // Поэтому пересчитываем индикатор с scrollToFirstItem=true, чтобы обязательно показался триггер.
                        // В данный момент это актуально только для смены загрузки снизу вверх.
                        if (this._viewportFilled) {
                            this.recountIndicators(anotherDirection, true);
                        } else {
                            // Если вьюпорт не заполнен, то нужно просто показать триггер, чтобы началась подгрузка вверх
                            // Индикатор не нужно показывать, т.к. он должен показаться через 2с после последнего запроса
                            // Если покажем, то могут быть прыжки - индикатор показался и сразу же скрылся.
                            this._options.displayBackwardTrigger?.();
                        }
                    }
                }

                this._resetDisplayPortionedSearchTimer(loadedItems);
            } else {
                this.recountIndicators(direction);
            }
        }

        if (this._options.isIterativeLoading && this._options.supportIterativeLoading) {
            this._countLoadedItemsByIteration += loadedItems.getCount();
            if (this.shouldStopDisplayPortionedSearch()) {
                this.stopDisplayPortionedSearch();
            }
        }
    }

    /**
     * Уничтожает состояние контроллера.
     * Сбрасывает все таймеры.
     */
    destroy(): void {
        this.clearDisplayPortionedSearchTimer();
    }

    // region LoadingIndicator

    /**
     * Проверяет, должен ли отображаться верхний индикатор.
     * @return {boolean} Отображать ли верхний индикатор.
     */
    shouldDisplayTopIndicator(): boolean {
        // верхний индикатор покажем только если заполнен вьюпорт, т.к. загрузка в первую очередь идет вниз
        // или сразу же покажем если вниз грузить нечего
        const allowByViewport = this._viewportFilled || !this._options.hasMoreDataToBottom;
        const allowByAttachOption =
            this._options.attachLoadTopTriggerToNull ||
            (this._options.isIterativeLoading && this._options.supportIterativeLoading);

        const allowByVirtualScroll = this._shouldDisplayIndicatorByVirtualScroll('up');
        const allowByAsync =
            this._options.feature1184208466 && this._options.hasHiddenItemsByVirtualScroll('up');

        return (
            allowByViewport &&
            allowByAttachOption &&
            ((this._options.hasMoreDataToTop && allowByVirtualScroll) ||
                this._unconditionallyDisplayTopIndicator ||
                allowByAsync) &&
            this._shouldDisplayIndicator('up')
        );
    }

    /**
     * Отображает верхний индикатор
     * @param {boolean} scrollToFirstItem Нужно ли скроллить к первому элементу, чтобы добавить отступ под триггер
     * @param onDrawItems // TODO удалить https://online.sbis.ru/opendoc.html?guid=e84068e3-0844-4930-89e3-1951efbaee25
     * @void
     */
    displayTopIndicator(
        scrollToFirstItem: boolean,
        onDrawItems: boolean,
        isTopIndicatorDisplayed: boolean
    ): void {
        const wasDisplayedIndicator = this._model.getTopIndicator().isDisplayed();

        if (!isTopIndicatorDisplayed && !wasDisplayedIndicator) {
            this._hasNotRenderedChanges = true;
        }

        // если индикатор уже показан, то возможно у нас поменялось состояние индикатора.
        // Поэтому метод на модели нужно всегда вызывать
        const indicatorState = this._getLoadingIndicatorState('top');
        this._model.displayIndicator('top', indicatorState);

        // к первому элементу не нужно скроллить, если индикатор и так был показан
        // Возможен кейс: маунт списка, вьюпорт не заполнен, вызывается смещение диапазона вниз,
        // по изменению индексов мы вызываем пересчет индикаторов, но маусЭнтер еще не успел сработать.
        const shouldScrollToFirstItem =
            (scrollToFirstItem || !this._wasInitializedIndicators || !this._viewportFilled) &&
            !wasDisplayedIndicator;
        if (shouldScrollToFirstItem) {
            this._options.scrollToFirstItem(onDrawItems);
        }
    }

    setUnconditionallyDisplayTopIndicator(value: boolean): void {
        this._unconditionallyDisplayTopIndicator = value;
    }

    /**
     * Проверяет, должен ли отображаться нижний индикатор.
     * @return {boolean} Отображать ли нижний индикатор.
     */
    hasNotRenderedChanges(): boolean {
        return this._hasNotRenderedChanges;
    }

    afterRenderCallback(): void {
        this._hasNotRenderedChanges = false;
        if (this._wasReload) {
            this._wasReload = false;
            if (detection.isMobilePlatform && this.shouldDisplayTopIndicator()) {
                this.displayTopIndicator(true);
            }
        }
    }

    afterMountCallback(): void {
        this._mounted = true;
    }

    /**
     * Проверяет, должен ли отображаться нижний индикатор.
     * @return {boolean} Отображать ли нижний индикатор.
     */
    shouldDisplayBottomIndicator(): boolean {
        const allowByAttachOption =
            this._options.attachLoadDownTriggerToNull ||
            (this._options.isIterativeLoading && this._options.supportIterativeLoading);
        return (
            allowByAttachOption &&
            this._options.hasMoreDataToBottom &&
            this._shouldDisplayIndicator('down')
        );
    }

    /**
     * Отображает нижний индикатор
     * @void
     */
    displayBottomIndicator(): void {
        // если индикатор уже показан, то возможно у нас поменялось состояние индикатора.
        // Поэтому метод на модели нужно всегда вызывать
        if (this._viewportFilled) {
            const indicatorState = this._getLoadingIndicatorState('bottom');
            this._model.displayIndicator('bottom', indicatorState);
            if (this._startDisplayBottomIndicator) {
                this._startDisplayBottomIndicator = false;
                this._clearDisplayIndicatorTimer();
            }
        } else {
            this._startDisplayBottomIndicator = true;
            this._startDisplayIndicatorTimer(() => {
                this._startDisplayBottomIndicator = false;
                const indicatorState = this._getLoadingIndicatorState('bottom');
                this._model.displayIndicator('bottom', indicatorState);
            });
        }
    }

    hideIndicator(direction: TIndicatorPosition): void {
        const topIndicatorIsDisplayed = this._model.getTopIndicator().isDisplayed();
        if (direction === 'top' && topIndicatorIsDisplayed) {
            this._hasNotRenderedChanges = true;
        }
        this._model.hideIndicator(direction);
    }

    shouldDisplayGlobalIndicator(): boolean {
        // Если таймер занят показом индикатора отрисовки, то мы должны показать в первую очередь глобальный индикатор.
        return (
            (!this._displayIndicatorTimer || this._startDisplayDrawingIndicator) &&
            !this._options.isIterativeLoading &&
            (!this._options.hasError || !this._options.hasError())
        );
    }

    /**
     * Отображает глобальный индикатор загрузки.
     * Отображает его с задержкой в 2с.
     * @param {number} topOffset Отступ сверху для центрирования ромашки
     */
    displayGlobalIndicator(topOffset: number): void {
        this._startDisplayGlobalIndicator = true;
        this._startDisplayDrawingIndicator = false;
        this._startDisplayIndicatorTimer(() => {
            return this._model.displayIndicator('global', EIndicatorState.Loading, topOffset);
        });
    }

    shouldHideGlobalIndicator(): boolean {
        return (
            (!!this._displayIndicatorTimer && this._startDisplayGlobalIndicator) ||
            !!this._model.getGlobalIndicator()
        );
    }

    /**
     * Скрывает глобальный индикатор загрузки
     */
    hideGlobalIndicator(): void {
        // TODO LI кривые юниты нужно фиксить
        if (!this._model || this._model.destroyed) {
            return;
        }
        this._startDisplayGlobalIndicator = false;
        this.hideIndicator('global');
        this._clearDisplayIndicatorTimer();
    }

    /**
     * Отображает индикатор долгой отрисовки элементов
     * @param indicatorElement DOM элемент индикатора
     * @param position Позиция индикатора
     * @void
     */
    displayDrawingIndicator(indicatorElement: HTMLElement, position: 'top' | 'bottom'): void {
        if (!this._shouldHandleDrawingIndicator(position) || !indicatorElement) {
            return;
        }

        this._startDisplayDrawingIndicator = true;
        this._startDisplayIndicatorTimer(() => {
            // Устанавливаем напрямую в style, чтобы не ждать и не вызывать лишний цикл синхронизации,
            // т.к. браузер занят отрисовкой записей. И если мы вызовем синхронизацию для отрисовки ромашек, то
            // скорее всего эта сихнронизация выполнится уже после того, как отрисовались записи.
            indicatorElement.style.display = '';
            indicatorElement.style.position = 'sticky';
            indicatorElement.style[position] = '0';
        });
    }

    /**
     * Скрывает индикатор долгой отрисовки элементов
     * @param indicatorElement DOM элемент индикатора
     * @param position Позиция индикатора
     */
    hideDrawingIndicator(indicatorElement: HTMLElement, position: 'top' | 'bottom'): void {
        if (!this._shouldHandleDrawingIndicator(position) || !indicatorElement) {
            return;
        }

        this._startDisplayDrawingIndicator = false;
        this._clearDisplayIndicatorTimer();
        indicatorElement.style.display = 'none';
        indicatorElement.style.position = '';
        indicatorElement.style[position] = '';
    }

    /**
     * Пересчитывает индикаторы в заданном направлении
     * @param direction Направление, для которого будут пересчитаны индикаторы. all - пересчет всех индикаторов.
     * @param {boolean} scrollToFirstItem Нужно ли скроллить к первому элементу, чтобы добавить отступ под верхний триггер
     */
    recountIndicators(direction: 'up' | 'down' | 'all', scrollToFirstItem: boolean = false): void {
        // если поиск был прерван, то ничего делать не нужно, т.к. ромашек теперь точно не будет
        if (this._getSearchState() === SEARCH_STATES.ABORTED || this._model.destroyed) {
            return;
        }

        switch (direction) {
            case 'up':
                this._recountTopIndicator(scrollToFirstItem);
                break;
            case 'down':
                this._recountBottomIndicator();
                break;
            case 'all':
                this._recountTopIndicator(scrollToFirstItem);
                this._recountBottomIndicator();
                // после перезагрузки скрываем глобальный индикатор
                if (this.shouldHideGlobalIndicator()) {
                    this.hideGlobalIndicator();
                }
                break;
        }
    }

    /**
     * Определяет есть ли отображенные индикаторы.
     * @return {boolean} Есть ли отображенные индикаторы.
     */
    hasDisplayedIndicator(): boolean {
        return !!(
            this._model.hasIndicator('global') ||
            this._model.getTopIndicator().isDisplayed() ||
            this._model.getBottomIndicator().isDisplayed()
        );
    }

    private _updateIndicatorsState(direction: TIndicatorPosition): void {
        if (direction === 'top' && this.shouldDisplayTopIndicator()) {
            this.displayTopIndicator(false, false);
        }

        if (direction === 'bottom' && this.shouldDisplayBottomIndicator()) {
            this.displayBottomIndicator();
        }
    }

    private _recountTopIndicator(scrollToFirstItem: boolean = false): void {
        // если сейчас порционный поиск и у нас еще не кончился таймер показа индикатора, то не нужно пересчитывать,
        // т.к. при порционном поиске индикатор покажется с задержкой в 2с, дожидаемся её
        if (this._options.isIterativeLoading && this._displayIndicatorTimer) {
            return;
        }

        const isTopIndicatorDisplayed = this._model.getTopIndicator().isDisplayed();
        if (this.shouldDisplayTopIndicator()) {
            // смотри комментарий в _recountBottomIndicator
            if (this._options.isIterativeLoading && this._portionedSearchDirection !== 'bottom') {
                this.startDisplayPortionedSearch('top');
            } else {
                this.displayTopIndicator(scrollToFirstItem, true, isTopIndicatorDisplayed);
            }
        } else {
            this.hideIndicator('top');
        }
    }

    private _recountBottomIndicator(): void {
        // если сейчас порционный поиск и у нас еще не кончился таймер показа индикатора, то не нужно пересчитывать,
        // т.к. при порционном поиске индикатор покажется с задержкой в 2с, дожидаемся её
        if (this._options.isIterativeLoading && this._displayIndicatorTimer) {
            return;
        }

        if (this.shouldDisplayBottomIndicator()) {
            this.displayBottomIndicator();
        } else {
            if (this._startDisplayBottomIndicator) {
                this._clearDisplayIndicatorTimer();
            }
            this.hideIndicator('bottom');
        }
    }

    private _shouldDisplayIndicator(direction: 'up' | 'down'): boolean {
        // если нет элементов, то покажем глобальный индикатор при долгой загрузке
        const hasItems = !!this._model.getCount();
        // порционынй поиск может быть включен не только в infinity навигации.
        const allowByNavigation =
            (this._options.isInfinityNavigation && hasItems) ||
            (this._options.isIterativeLoading &&
                (this._options.isInfinityNavigation ||
                    (this._options.isMaxCountNavigation &&
                        this._countLoadedItemsByIteration < this._options.iterativeLoadPageSize)));
        const allowByVirtualScroll = this._shouldDisplayIndicatorByVirtualScroll(direction);
        return (
            allowByNavigation &&
            allowByVirtualScroll &&
            !this._options.shouldShowEmptyTemplate &&
            (!this._options.hasError || !this._options.hasError())
        );
    }

    private _shouldDisplayIndicatorByVirtualScroll(direction: 'up' | 'down') {
        // Индикатор порционного поиска не должны скрывать даже если есть записи скрытые виртуальным скроллом
        return (
            this._options.feature1184208466 ||
            !this._options.hasHiddenItemsByVirtualScroll?.(direction) ||
            (direction === 'up' && this._unconditionallyDisplayTopIndicator) ||
            (this._options.isIterativeLoading &&
                this._getSearchState() === SEARCH_STATES.CONTINUED &&
                this._portionedSearchDirection === DIRECTION_COMPATIBILITY[direction])
        );
    }

    private _startDisplayIndicatorTimer(showIndicator: () => void): void {
        this._clearDisplayIndicatorTimer();
        this._displayIndicatorTimer = setTimeout(() => {
            if (!this._model || this._model.destroyed) {
                return;
            }

            this._displayIndicatorTimer = null;
            showIndicator();
        }, INDICATOR_DELAY);
    }

    private _clearDisplayIndicatorTimer(): void {
        if (this._displayIndicatorTimer) {
            clearTimeout(this._displayIndicatorTimer);
            this._displayIndicatorTimer = null;
        }
    }

    private _getLoadingIndicatorState(direction: TIndicatorPosition): TIndicatorState {
        let state =
            direction === 'global' || this._loadingToDirectionInProgress
                ? EIndicatorState.Loading
                : EIndicatorState.HiddenLoading;

        if (this._portionedSearchDirection === direction) {
            if (this.isDisplayedPortionedSearch()) {
                state = EIndicatorState.PortionedSearch;
            }
            if (this._searchState === SEARCH_STATES.STOPPED) {
                const isStoppedByLoadedCount =
                    this._countLoadedItemsByIteration >= this._options.iterativeLoadPageSize;
                state = isStoppedByLoadedCount
                    ? EIndicatorState.HiddenLoading
                    : EIndicatorState.ContinueSearch;
            }
        }

        return state;
    }

    private _shouldHandleDrawingIndicator(position: 'top' | 'bottom'): boolean {
        // Этими опциями в календаре полностью отключены ромашки, т.к. там не может быть долгой подгрузки.
        // И в IE из-за его медленной работы индикаторы вызывают прыжки
        const allowByOptions =
            (this._options.attachLoadTopTriggerToNull && position === 'top') ||
            (this._options.attachLoadDownTriggerToNull && position === 'bottom');
        // индикатор отрисовки мы должны показывать, только если не показан обычный индикатор в этом направлении
        const allowByIndicators =
            (position === 'top' && !this._model.getTopIndicator().isDisplayed()) ||
            (position === 'bottom' && !this._model.getBottomIndicator().isDisplayed());
        // при порционном поиске индикатор всегда отрисовать и поэтому индикатор отрисовки не нужен
        return (
            !this._options.isIterativeLoading &&
            allowByOptions &&
            allowByIndicators &&
            !this._startDisplayGlobalIndicator &&
            !this._startDisplayBottomIndicator
        );
    }

    // endregion LoadingIndicator

    // region PortionedSearch

    /**
     * Начинает отображение индикатора порционного поиска. Индикатор позывается только через 2с.
     * @param direction Направление, в котором будет отрисован индикатор
     */
    startDisplayPortionedSearch(direction: TPortionedSearchDirection): void {
        if (!this._options.supportIterativeLoading) {
            return;
        }

        this._countLoadedItemsByIteration = 0;
        const currentState = this._getSearchState();
        if (
            currentState === SEARCH_STATES.NOT_STARTED ||
            currentState === SEARCH_STATES.ABORTED ||
            currentState === SEARCH_STATES.STOPPED
        ) {
            this._setSearchState(SEARCH_STATES.STARTED);
            this._startDisplayPortionedSearchTimer();
            this._portionedSearchDirection = direction;

            // скрываем оба индикатора, т.к. после начала порционного поиска индикатор
            // должен показаться только в одну сторону и через 2с
            if (!this._viewportFilled) {
                this.hideIndicator('top');
                this.hideIndicator('bottom');
            }
            this._startDisplayIndicatorTimer(() => {
                const allowDisplay = !this._options.hasHiddenItemsByVirtualScroll(
                    DIRECTION_COMPATIBILITY[direction] as 'up' | 'down'
                );
                if (allowDisplay) {
                    this._model.displayIndicator(direction, EIndicatorState.PortionedSearch);
                }
            });
        }
    }

    /**
     * Определяет, нужно ли приостанавливать поиск
     * @remark
     * Поиск нужно приостановить если страница успела загрузиться быстрее 30с(при первой подгрузке)
     * или быстрее 2м(при последующних подгрузках)
     */
    shouldStopDisplayPortionedSearch(): boolean {
        // если загрузилась целая страница раньше чем прервался порционный поиск, то приостанавливаем его
        // по стандарту в этом кейсе под страницей понимается viewport
        // проверять по скрытию триггера загрузку страницы не лучшая идея, т.к. изначально может быть много данных,
        // а первая порционная подгрузка тоже загрузит много данных => события скрытия триггера не будет.
        return (
            this._countLoadedItemsByIteration >= this._options.iterativeLoadPageSize &&
            this._searchState !== SEARCH_STATES.STOPPED
        );
    }

    /**
     * Приостанавливаем отображение порционного поиска.
     */
    stopDisplayPortionedSearch(): void {
        this.clearDisplayPortionedSearchTimer();
        this._setSearchState(SEARCH_STATES.STOPPED);
        // https://online.sbis.ru/opendoc.html?guid=0be69d45-286d-4f71-af2e-fe8653804da9
        if (this._model && !this._model.destroyed) {
            const displayTopIndicator =
                this._portionedSearchDirection === 'top' && this.shouldDisplayTopIndicator();
            const displayBottomIndicator =
                this._portionedSearchDirection === 'bottom' && this.shouldDisplayBottomIndicator();
            if (displayTopIndicator || displayBottomIndicator) {
                const wasDisplayedIndicator = this._model.getTopIndicator().isDisplayed();
                const isPortionedSearchIndicator =
                    this._model.getTopIndicator().getState() === 'portioned-search';
                if (!wasDisplayedIndicator || isPortionedSearchIndicator) {
                    this._hasNotRenderedChanges = true;
                }
            }

            if (displayTopIndicator) {
                this.displayTopIndicator(true);
            } else if (displayBottomIndicator) {
                this.displayBottomIndicator();
            } else {
                this.hideIndicator(this._portionedSearchDirection);
            }
        }
        this._options.stopDisplayPortionedSearchCallback();
    }

    /**
     * Продолжаем отображение порционного поиска.
     * @param direction Новое направление порционного поиска. Оно может смениться, если сперва поиск шел вниз,
     * а после полной загрузки вниз, стали грузить вверх.
     */
    continueDisplayPortionedSearch(
        direction: TPortionedSearchDirection = this._portionedSearchDirection
    ): void {
        this._setSearchState(SEARCH_STATES.CONTINUED);
        if (this._portionedSearchDirection !== direction) {
            this._countLoadedItemsByIteration = 0;
        }
        this._portionedSearchDirection = direction;
        this._startDisplayPortionedSearchTimer();
        this._model.displayIndicator(
            this._portionedSearchDirection,
            EIndicatorState.PortionedSearch
        );
    }

    /**
     * Прерываем отображение порционного поиска.
     */
    abortDisplayPortionedSearch(): void {
        this._countLoadedItemsByIteration = 0;
        this._setSearchState(SEARCH_STATES.ABORTED);
        this.clearDisplayPortionedSearchTimer();
        // скрываем все индикаторы, т.к. после abort никаких подгрузок не будет
        this.hideIndicator('top');
        this.hideIndicator('bottom');
        this.hideIndicator('global');
    }

    /**
     * Заканчиваем отображение порционного поиска.
     */
    endDisplayPortionedSearch(): void {
        if (!this._portionedSearchDirection) {
            return;
        }

        this._countLoadedItemsByIteration = 0;
        this.hideIndicator(this._portionedSearchDirection);
        this._portionedSearchDirection = null;
        this._setSearchState(SEARCH_STATES.NOT_STARTED);
        this.clearDisplayPortionedSearchTimer();
    }

    /**
     * Определяет, можно ли продолжить отображать порционный поиск.
     * @return {boolean} Можно ли продолжить отображать порционный поиск
     */
    shouldContinueDisplayPortionedSearch(direction?: 'up' | 'down'): boolean {
        // Либо мы при остановке пытаемся подгрузить в другую сторону, либо поиск не приостановле
        const allowByStoppedState =
            (direction && this.getPortionedSearchDirection() !== direction) ||
            this._getSearchState() !== SEARCH_STATES.STOPPED ||
            this._countLoadedItemsByIteration >= this._options.iterativeLoadPageSize;
        return (
            allowByStoppedState &&
            this._getSearchState() !== SEARCH_STATES.ABORTED &&
            this._options.supportIterativeLoading
        );
    }

    /**
     * Проверяет, отображается ли сейчас порционный поиск
     * @return {boolean} Отображается ли сейчас порционный поиск
     */
    isDisplayedPortionedSearch(): boolean {
        return (
            this._getSearchState() === SEARCH_STATES.STARTED ||
            this._getSearchState() === SEARCH_STATES.CONTINUED
        );
    }

    /**
     * Возвращает направление порционного поиска.
     */
    getPortionedSearchDirection(): 'up' | 'down' {
        // Приводим новые названия направлений к старым
        return DIRECTION_COMPATIBILITY[this._portionedSearchDirection] as 'up' | 'down';
    }

    /**
     * Прерывает таймеры отображения порционного поиска
     */
    clearDisplayPortionedSearchTimer(): void {
        this._clearDisplayIndicatorTimer();
        this._clearPortionedSearchTimer();
    }

    private _clearPortionedSearchTimer(): void {
        if (this._portionedSearchTimer) {
            clearTimeout(this._portionedSearchTimer);
            this._portionedSearchTimer = null;
        }
    }

    private _startDisplayPortionedSearchTimer(): void {
        const duration =
            (this._options.iterativeLoadTimeout || DEFAULT_ITERATIVE_LOADING_TIMEOUT) *
            S_TO_MS_FACTOR;
        this._clearPortionedSearchTimer();
        this._portionedSearchTimer = setTimeout(() => {
            this.stopDisplayPortionedSearch();
        }, duration);
    }

    private _setSearchState(state: SEARCH_STATES): void {
        this._searchState = state;
    }

    private _getSearchState(): SEARCH_STATES {
        return this._searchState;
    }

    /**
     * Перезапускаем таймер для показа индикатора порционного поиска
     */
    private _resetDisplayPortionedSearchTimer(loadedItems: RecordSet): void {
        // Нужно ли перезапустить таймер для показа индикатора порционного поиска.
        // Перезапускаем таймер, только если порционный поиск был начат, таймер запущен и еще не выполнился
        // и были подгруженны данные.
        const shouldResetDisplayPortionedSearchTimer =
            loadedItems.getCount() &&
            this.isDisplayedPortionedSearch() &&
            !!this._displayIndicatorTimer;
        if (!shouldResetDisplayPortionedSearchTimer) {
            return;
        }

        this._clearDisplayIndicatorTimer();
        this._startDisplayIndicatorTimer(() => {
            return this._model.displayIndicator(
                this._portionedSearchDirection,
                EIndicatorState.PortionedSearch
            );
        });
    }

    // endregion PortionedSearch
}
