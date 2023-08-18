/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import { Control } from 'UI/Base';
import { detection } from 'Env/Env';

import InertialScrolling from 'Controls/_baseList/Controllers/ScrollController/InertialScrolling';

import {
    getValidItemKeyAttribute,
    TItemKey,
    VirtualScrollController,
    VirtualScrollHideController,
} from 'Controls/display';
import type { IVirtualScrollConfig } from 'Controls/_baseList/interface/IVirtualScroll';
import type { IVirtualCollection } from './IVirtualCollection';
import {
    IActiveElementChangedChangedCallback,
    IDirection,
    IEdgeItem,
    IHasItemsOutsideOfRange,
    IIndexesChangedParams,
    IItemsEndedCallback,
    IItemsRange,
    IPlaceholders,
    ScrollController,
    IScrollControllerOptions,
    IScrollMode,
    ICalcMode,
    TItemsSizesUpdatedCallback,
} from 'Controls/_baseList/Controllers/ScrollController/ScrollController';
import {
    AbstractItemsSizesController,
    IAbstractItemsSizesControllerOptions,
    IItemsSizes,
    IRenderedOutsideItem,
} from 'Controls/_baseList/Controllers/ScrollController/ItemsSizeController/AbstractItemsSizeController';
import {
    AbstractObserversController,
    IAbstractObserversControllerOptions,
    ITriggersPositions,
    ITriggersOffsetCoefficients,
    ITriggersVisibility,
    ITriggerPosition,
    IAdditionalTriggersOffsets,
    ITriggersOffsetMode,
} from 'Controls/_baseList/Controllers/ScrollController/ObserverController/AbstractObserversController';
import { Logger } from 'UI/Utils';
import { TVirtualScrollMode } from 'Controls/_baseList/interface/IVirtualScroll';
import { isEqual } from 'Types/object';
import { ICalculatorState } from 'Controls/_baseList/Controllers/ScrollController/Calculator/Calculator';
import { CrudEntityKey } from 'Types/source';
import { CollectionItem } from 'Controls/display';
import { getMaxScrollPosition } from './ScrollUtil';

const ERROR_PATH = 'Controls/_baseList/Controllers/AbstractListVirtualScrollController';

export type TInitialScrollPosition = 'end';

export type IScheduledScrollType =
    | 'restoreScroll'
    | 'calculateRestoreScrollParams'
    | 'scrollToElement'
    | 'doScroll'
    | 'applyScrollPosition';

export interface IScheduledScrollToElementParams {
    key: TItemKey;
    position: string;
    force: boolean;
    selfScroll?: boolean;
}

/**
 * Интерфейс, описывающий параметры для подсчтеа крайнего видимого элемента
 * @remark
 * range, placeholders, itemsSizes - не обязательные параметры. Если их не задать, то будут использоваться
 * текущие значения. Задвать нужно только для восстановления скролла, т.к. восстанавливать скролл нужно
 * исходя из старого состояния.
 * @private
 */
export interface IEdgeItemCalculatingParams {
    direction: IDirection;
    offset?: number;
    range?: IItemsRange;
    placeholders?: IPlaceholders;
    itemsSizes?: IItemsSizes;
}

export type IScrollParam = number | 'top' | 'bottom' | 'pageUp' | 'pageDown';

export type IScrollOnReset = 'reset' | 'keep' | 'restore';

export interface IDoScrollParams {
    scrollParam: IScrollParam;
}

export interface IScheduledApplyScrollPositionParams {
    callback: () => number;
}

export interface IScheduledScrollParams {
    type: IScheduledScrollType;
    params:
        | IEdgeItem
        | IScheduledScrollToElementParams
        | IEdgeItemCalculatingParams
        | IDoScrollParams
        | IScheduledApplyScrollPositionParams;
}

type IScrollToElementUtil = (
    container: HTMLElement,
    position: string,
    force: boolean
) => Promise<void> | void;
type IDoScrollUtil = (scrollParam: IScrollParam) => boolean | undefined;
type IUpdateShadowsUtil = (hasItems: IHasItemsOutsideOfRange) => void;
type IUpdatePlaceholdersUtil = (placeholders: IPlaceholders) => void;
type IUpdateVirtualNavigationUtil = (
    hasItems: IHasItemsOutsideOfRange,
    forceUseHasItems?: boolean
) => void;
type IHasItemsOutRangeChangedCallback = (hasItems: IHasItemsOutsideOfRange) => void;
type IBeforeVirtualRangeChangeCallback = (range: IItemsRange) => Promise<void> | void;
export type IAbstractItemsSizesControllerConstructor = new (
    options: IAbstractItemsSizesControllerOptions
) => AbstractItemsSizesController;
export type IAbstractObserversControllerConstructor = new (
    options: IAbstractObserversControllerOptions
) => AbstractObserversController;
export type IAbstractListVirtualScrollControllerConstructor = new (
    options: IAbstractListVirtualScrollControllerOptions
) => AbstractListVirtualScrollController;

export const HIDDEN_ITEM_SELECTOR = '.ws-hidden';

// Нативный IntersectionObserver дергает callback по перерисовке.
// В ie нет нативного IntersectionObserver.
// Для него работает полифилл, используя throttle. Поэтому для ie нужна задержка.
// В fireFox возникает аналогичная проблема, но уже с нативным обсервером.
// https://online.sbis.ru/opendoc.html?guid=ee31faa7-467e-48bd-9579-b60bc43b2f87
const CHECK_TRIGGERS_DELAY_IF_NEED = 150;
const CHECK_TRIGGERS_DELAY =
    (detection.isWin && !detection.isDesktopChrome) ||
    (detection.firefox && detection.isUnix) ||
    detection.isIE ||
    detection.isMobileIOS
        ? CHECK_TRIGGERS_DELAY_IF_NEED
        : 0;

export interface IAbstractListVirtualScrollControllerOptions {
    collection: IVirtualCollection;
    listControl: Control;

    scrollPosition: number;
    viewportSize: number;
    contentSize: number;

    virtualScrollConfig: IVirtualScrollConfig;
    activeElementKey: TItemKey;
    initialScrollPosition?: TInitialScrollPosition;

    listContainer: HTMLElement;
    itemsContainer: HTMLElement;

    triggersQuerySelector: string;
    itemsQuerySelector: string;
    itemsContainerUniqueSelector: string;

    updateShadowsUtil?: IUpdateShadowsUtil;
    updatePlaceholdersUtil: IUpdatePlaceholdersUtil;
    updateVirtualNavigationUtil?: IUpdateVirtualNavigationUtil;

    triggersVisibility: ITriggersVisibility;
    triggersOffsetCoefficients: ITriggersOffsetCoefficients;
    triggersPositions: ITriggersPositions;
    additionalTriggersOffsets: IAdditionalTriggersOffsets;

    scrollToElementUtil: IScrollToElementUtil;
    doScrollUtil: IDoScrollUtil;

    itemsEndedCallback: IItemsEndedCallback;
    itemsSizesUpdatedCallback: TItemsSizesUpdatedCallback;
    activeElementChangedCallback: IActiveElementChangedChangedCallback;
    hasItemsOutRangeChangedCallback: IHasItemsOutRangeChangedCallback;
    beforeVirtualRangeChangeCallback: IBeforeVirtualRangeChangeCallback;
    triggersOffsetMode: ITriggersOffsetMode;

    feature1183225611: boolean;
    disableVirtualScroll: boolean;

    feature1184208466?: boolean;
    isReact: boolean;
    renderedItems?: TItemKey[];
}

export abstract class AbstractListVirtualScrollController<
    TOptions extends IAbstractListVirtualScrollControllerOptions = IAbstractListVirtualScrollControllerOptions
> {
    protected _options: TOptions;

    private readonly _inertialScrolling: InertialScrolling;

    protected _collection: IVirtualCollection;
    protected _scrollController: ScrollController;
    private _itemSizeProperty: string;
    private _virtualScrollMode: TVirtualScrollMode;
    private _activeElementKey: TItemKey;
    private _initialScrollPosition?: TInitialScrollPosition;
    private readonly _itemsContainerUniqueSelector: string;
    protected _scrollOnReset: IScrollOnReset = null;
    protected _scrollPosition: number;
    private _scrollContainerSize: number;
    private _viewportSize: number;

    protected readonly _scrollToElementUtil: IScrollToElementUtil;
    protected readonly _doScrollUtil: IDoScrollUtil;
    private readonly _updateShadowsUtil?: IUpdateShadowsUtil;
    private readonly _updatePlaceholdersUtil: IUpdatePlaceholdersUtil;
    private readonly _updateVirtualNavigationUtil?: IUpdateVirtualNavigationUtil;
    private readonly _hasItemsOutRangeChangedCallback?: IHasItemsOutRangeChangedCallback;
    private readonly _beforeVirtualRangeChangeCallback?: IBeforeVirtualRangeChangeCallback;
    private _beforeVirtualRangeChangeCallbackPromise?: Promise;

    private _itemsRangeScheduledSizeUpdate: IItemsRange;
    protected _scheduledScrollParams: IScheduledScrollParams;
    private _scheduledUpdateHasItemsOutRange: IHasItemsOutsideOfRange;
    private _scheduledCheckTriggersVisibility: boolean;
    private _scheduledUpdatePlaceholders: IPlaceholders;
    private _handleChangedIndexesAfterSynchronizationCallback: Function;

    /**
     * TODO: убрать, когда построение будет только синхронным.
     * @protected
     */
    protected _setItemsContainerOnItemsRendered: Function = null;

    private _checkTriggersVisibilityTimeout: number;

    /**
     * Экземпляр промиса подскролла к записи. В случае повторного вызова подскролла к одной и той же записи,
     * до заверщения первого, будет возвращен промис из первого вызова, вместо планирования нового подскролла.
     * @private
     */
    private _scrollToItemPromise: Promise<void>;

    /**
     * Стейт используется для отделения внешнего скролла и скролла, который был вызван в служебных целях
     * самим контроллером. Так, не нужно вычислять активный элемент, после подскролла к записи.
     * Это нужно из-за того, что подскролл делается так, что целевой эелемент в верху вьюпорта,
     * а активный элемент не обязятельно.
     * Можно убрать после https://online.sbis.ru/opendoc.html?guid=075223ea-ed73-4412-9bba-0452cd555736
     * @private
     */
    private _selfScroll: boolean;

    /**
     * Предопределенное направление для восстановления скролла.
     * @remark Используется при подгрузке в узел, т.к. в этом случае обязательно нужно
     * восстанавливать скролл относительно верхней записи. В данном кейсе сделать это через shiftDirection нельзя, т.к.
     * смещать диапазон точно нужно вниз, но скролл восстанавливаем относительно верхней записи.
     * @private
     */
    private _predicatedRestoreDirection: IDirection;

    /**
     * Стейт используется, чтобы определить что сейчас идет отрисовка.
     * Нужно для того, чтобы не менять индексы уже во время отрисовки.
     * @private
     */
    private _renderInProgress: boolean;

    private _mounted: boolean = false;

    /**
     * Стейт, который определяет что сейчас выполняется отрисовка новых индексов.
     * Проставляется при изменении индексов и сбрасывается в afterRender
     * @private
     */
    private _renderNewIndexes: boolean;

    /**
     * Колбэк, который вызывается когда завершился скролл к элементу. Скролл к элементу вызывается асинхронно.
     * По этому колбэку резолвится промис, который возвращается из метода scrollToItem
     * @private
     */
    private _scrollCompletedCallback: () => void;

    private _scrollToPageBlocked: boolean = false;

    /**
     * Ключи записей, завершивших отрисовку. (важно в случае наличия асинхронного рендера)
     * @protected
     */
    protected _renderedItems: TItemKey[] = [];

    /**
     * Наличие асинхронного рендеринга записей
     * TODO: убрать, когда построение будет только синхронным.
     * @protected
     */
    protected readonly _feature1184208466: boolean;
    protected readonly _isReact: boolean;
    private _itemsRenderedOutsideRange: IRenderedOutsideItem[] = [];

    /**
     * Состояние видимости списка
     * @private
     */
    private _listIsHidden: boolean = false;

    constructor(options: TOptions) {
        this._options = options;

        this._validateEdgeItem = this._validateEdgeItem.bind(this);

        this._itemSizeProperty = options.virtualScrollConfig.itemHeightProperty;
        this._virtualScrollMode = options.virtualScrollConfig.mode;
        this._initialScrollPosition = options.initialScrollPosition;
        this.setActiveElementKey(options.activeElementKey);
        this._itemsContainerUniqueSelector = options.itemsContainerUniqueSelector;

        this._scrollToElementUtil = options.scrollToElementUtil;
        this._doScrollUtil = options.doScrollUtil;
        this._updateShadowsUtil = options.updateShadowsUtil;
        this._updatePlaceholdersUtil = options.updatePlaceholdersUtil;
        this._updateVirtualNavigationUtil = options.updateVirtualNavigationUtil;
        this._hasItemsOutRangeChangedCallback = options.hasItemsOutRangeChangedCallback;
        this._beforeVirtualRangeChangeCallback = options.beforeVirtualRangeChangeCallback;

        this._renderedItems = options.renderedItems || [];
        this._feature1184208466 = options.feature1184208466;
        this._isReact = options.isReact;

        this._inertialScrolling = new InertialScrolling({
            maxScrollPosition: 0,
        });

        this._initCollection(options.collection);
        this._createScrollController(options);
        if (this._collection) {
            this.resetItems();
        }
    }

    protected abstract _getItemsSizeControllerConstructor(
        options: TOptions
    ): IAbstractItemsSizesControllerConstructor;

    protected abstract _getObserversControllerConstructor(): IAbstractObserversControllerConstructor;

    setCollection(collection: IVirtualCollection): void {
        this._initCollection(collection);
        if (this._scrollController && this._collection) {
            this.resetItems();
        }
    }

    setItemsContainer(itemsContainer: HTMLElement): void {
        if (itemsContainer && this._itemsContainerUniqueSelector) {
            if (!itemsContainer.matches(this._itemsContainerUniqueSelector)) {
                Logger.error(
                    `Hydration error! itemsContainer doesn't match "${this._itemsContainerUniqueSelector}".`
                );
            }
        }
        this._updateItemsRenderedOutsideRange();
        this._scrollController.setItemsContainer(itemsContainer, this._getGivenItemsSizes());
    }

    setItemsQuerySelector(newItemsQuerySelector: string): void {
        const itemsQuerySelector = this._getItemsSelector(
            newItemsQuerySelector,
            this._virtualScrollMode
        );
        this._scrollController.setItemsQuerySelector(
            itemsQuerySelector,
            this._getGivenItemsSizes()
        );
    }

    setListContainer(listContainer: HTMLElement): void {
        this._scrollController.setListContainer(listContainer);
    }

    setRenderedItems(renderedItems: TItemKey[]): void {
        this._renderedItems = renderedItems;
        if (this._isReact && this._feature1184208466) {
            // Пока не все записи отрисованы до конца (как следствие их - высота не окончательна)
            // нелзья вызвать пересчет диапазона по триггерам.
            // TODO: убрать, когда построение будет только синхронным.
            this._scrollController.setTriggersAllowed(this._isAllRendered());
        }
    }

    getElement(key: CrudEntityKey): HTMLElement {
        return this._scrollController.getElement(getValidItemKeyAttribute(key));
    }

    endBeforeMountListControl(): void {
        // Устанавливаем _renderInProgress именно после маунта списка, т.к. нужно дождаться завершения:
        // - инициализации начальных индексов коллекции;
        // - инициализации строки добавления по месту.
        this._renderInProgress = true;
    }

    afterMountListControl(): void {
        this._renderInProgress = false;
        this._renderNewIndexes = false;
        if (!this._feature1184208466) {
            this._scrollController.setTriggersAllowed(true);
        }
        this._mounted = true;
        this._listIsHidden = this._scrollController.isListContainerHidden();

        this._handleScheduledUpdateHasItemsOutRange();
        this._handleScheduledUpdatePlaceholders();

        // может быть запланирован скролл к активному элементу
        if (!this._setItemsContainerOnItemsRendered) {
            this._handleScheduledScroll();
        }

        this._scrollController.updateViewportOverlaySize();

        // Если изначальная позиция ScrollContainer-а была задана end,
        // то contentSizeBeforeItems будет посчитан неправильно.
        // Поэтому планируем обновление размеров элементов на момент,
        // когда ScrollContainer уже будет отрисован правильно и размеры будут считаться правильно.
        if (this._isEndInitialScrollPosition()) {
            this._scheduleUpdateItemsSizes({
                startIndex: this._collection.getStartIndex(),
                endIndex: this._collection.getStopIndex(),
            });
        }

        // При маунте списка инициализируем состояние виртуализации
        // Если список скрыт изначально, то сразу говорим что виртуализация выключена
        const hasItems = this._listIsHidden
            ? { backward: false, forward: false }
            : {
                  backward: this._collection.getStartIndex() > 0,
                  forward: this._collection.getStopIndex() < this._collection.getCount(),
              };
        this._updateVirtualNavigationUtil(hasItems);
    }

    destroy(): void {
        this._updatePlaceholdersUtil({
            forward: 0,
            backward: 0,
        });
        if (this._updateVirtualNavigationUtil) {
            // Форсим переданное значение, чтобы hasMore не влияло на навигацию.
            // Мы хотим принудительно выключить навигацию.
            this._updateVirtualNavigationUtil(
                {
                    forward: false,
                    backward: false,
                },
                true
            );
        }

        if (this._scheduledScrollParams) {
            const shouldResetScroll =
                this._scheduledScrollParams.type === 'doScroll' &&
                ((this._scheduledScrollParams.params as IDoScrollParams).scrollParam === 'top' ||
                    (this._scheduledScrollParams.params as IDoScrollParams).scrollParam ===
                        'bottom');
            if (shouldResetScroll) {
                this._doScroll((this._scheduledScrollParams.params as IDoScrollParams).scrollParam);
            }

            const shouldApplyScrollPosition =
                this._scheduledScrollParams.type === 'applyScrollPosition';
            if (shouldApplyScrollPosition) {
                (
                    this._scheduledScrollParams.params as IScheduledApplyScrollPositionParams
                ).callback();
            }
        }
        this._scrollController.destroy();
    }

    endBeforeUpdateListControl(): void {
        // Нужно проставлять именно тут этот флаг. Например, если нам прокинутт 2 опции, одна из которых будет source.
        // То индексы могут посчитаться где-то между beforeUpdate и beforeRender.
        // Нужно чтобы эти индексы применились уже после отрисовки.
        // Также не нужно забывать, что индексы могут синхронно пересчитаться внутри _beforeUpdate
        // и вот их нужно применить сразу же.
        this._renderInProgress = true;
    }

    beforeRenderListControl(): void {
        // TODO: убрать, когда построение будет только синхронным.
        const isAllRendered = !(this._isReact && this._feature1184208466) || this._isAllRendered();

        // На beforeRender нам нужно только считать параметры для восстановления скролла.
        // Все остальные типы скролла выполняются на afterRender, когда записи уже отрисовались.
        if (
            this._scheduledScrollParams &&
            this._scheduledScrollParams.type === 'calculateRestoreScrollParams' &&
            isAllRendered
        ) {
            this._handleScheduledScroll();
        }
    }

    afterRenderListControl(): void {
        this._renderNewIndexes = false;
        if (!this._feature1184208466) {
            this._scrollController.setTriggersAllowed(this._isAllRendered());
        }

        this._updateItemsRenderedOutsideRange();

        // TODO: убрать условие, когда построение будет только синхронным.
        const rangePromise = !!this._beforeVirtualRangeChangeCallbackPromise;
        const allRendered = !(this._isReact && this._feature1184208466) || this._isAllRendered();
        if (allRendered && !rangePromise) {
            this._handleScheduledUpdateItemsSizes();
            this._handleScheduledUpdateHasItemsOutRange();
            this._handleScheduledUpdatePlaceholders();
            this._handleScheduledScroll();
            this._handleScheduledCheckTriggerVisibility();
        }

        if (this._handleChangedIndexesAfterSynchronizationCallback) {
            this._handleChangedIndexesAfterSynchronizationCallback();
            this._handleChangedIndexesAfterSynchronizationCallback = null;
        }
        this._renderInProgress = false;
    }

    setPredicatedRestoreDirection(restoreDirection: IDirection): void {
        this._predicatedRestoreDirection = restoreDirection;
    }

    saveScrollPosition(
        params: Partial<IEdgeItemCalculatingParams> = {},
        scheduleOnBeforeRender: boolean = false
    ): void {
        // Если и так запланировано восстановление скролла, то не нужно пытаться еще раз сохранять позицию.
        // Данный кейс возможен если мы, например: скроллим вверх, смещаем диапазон, показываем ромашку(т.к. следующее
        // достижение триггера долнжо подгрузить данные). В этом случае восстановление скролла будет запланировано
        // в indexesChangedCallback.
        // Если _renderNewIndexes=true, это значит что мы и так уже сохраним позицию скролла
        // Если _scrollToItemPromise, то это значит что мы скроллим к элементу,
        // после этого не нужно восстанавливать скролл
        if (this._scheduledScrollParams || this._renderNewIndexes || this._scrollToItemPromise) {
            return;
        }

        const resultParams = {
            ...params,
            direction: params.direction || 'backward',
        };
        if (scheduleOnBeforeRender) {
            this._scheduleScroll({
                type: 'calculateRestoreScrollParams',
                params: resultParams,
            });
            return;
        }

        const edgeItem = this._scrollController.getEdgeVisibleItem(resultParams);
        if (edgeItem) {
            this._scheduleScroll({
                type: 'restoreScroll',
                params: edgeItem,
            });
        }
    }

    restoreScrollPosition(): void {
        if (!this._scheduledScrollParams || this._scheduledScrollParams.type !== 'restoreScroll') {
            return;
        }
        const contentBeforeListChanged = this._scrollController.updateContentSizeBeforeList();

        // Также нужно обновить размеры, т.к. могут измениться размеры контента до списка
        if (contentBeforeListChanged && !this._isScheduledUpdateItemsSizes()) {
            this._scrollController.updateItemsSizes();
        }
        this._handleScheduledScroll();
    }

    virtualScrollPositionChange(position: number, applyScrollPositionCallback: () => void): void {
        // Когда мы смещаем диапазон к виртуальной позиции, то scrollPosition нужно применить после отрисовки
        // нового диапазона. Для этого ScrollContainer прокидывает коллбэк.
        this._scheduleScroll({
            type: 'applyScrollPosition',
            params: {
                callback: applyScrollPositionCallback,
            },
        });
        const indexesChanged = this._scrollController.scrollToVirtualPosition(position);
        if (!indexesChanged && !this._renderInProgress) {
            this._handleScheduledScroll();
        }
    }

    stickyFixedChanged(): void {
        // По изменению стики-блоков пересчитываем размер оверлея.
        // Ранее пересчёты велись по скроллу, но это ухудшает производительность, особенно на маломощных устройствах.
        // https://online.sbis.ru/opendoc.html?guid=d9d84480-ae89-4ed0-8cd8-f7f30f9307cc&client=3
        this._scrollController.updateViewportOverlaySize();
    }

    scrollPositionChange(position: number): void {
        if (detection.isMobileIOS) {
            this._inertialScrolling.scrollPositionChange(position);
        }

        this._scrollPosition = position;

        const scheduledScrollType = this._scheduledScrollParams?.type;

        // В следующий кадр случится подскролл, значит, не нужно вычислять активный элемент сейчас
        const willScroll =
            scheduledScrollType === 'scrollToElement' ||
            scheduledScrollType === 'restoreScroll' ||
            scheduledScrollType === 'doScroll' ||
            scheduledScrollType === 'applyScrollPosition';

        // Если текущее состояние не отрендерилось, то рано вычислять активный элемент
        // TODO: убрать, когда построение будет только синхронным.
        const isAllRendered = !(this._isReact && this._feature1184208466) || this._isAllRendered();

        // Если в ближайую перерисовку будет отрендерен новый диапазон,
        // то активный элемент сейчас будет посчитан неверно: диапазон уже поменялся,
        // а размеры контента еще не обновились
        this._scrollController.scrollPositionChange(
            position,
            !(willScroll || this._selfScroll || this._renderNewIndexes) && isAllRendered
        );
        this._selfScroll = false;
        if (this._scrollCompletedCallback) {
            this._scrollCompletedCallback();
            this._scrollCompletedCallback = null;
        }
    }

    setScrollBehaviourOnReset(scrollBehaviourOnReset: IScrollOnReset): void {
        if (scrollBehaviourOnReset === 'reset') {
            // Сбрасываем скролл, только если до этого не сказали восстановить или сохранить скролл
            if (!this._scrollOnReset) {
                this._scrollOnReset = 'reset';
            }
        } else {
            this._scrollOnReset = scrollBehaviourOnReset;
        }
    }

    contentResized(contentSize: number): void {
        this._contentResized(contentSize);
    }

    viewportResized(viewportSize: number): void {
        this._viewportResized(viewportSize);
    }

    /**
     * При изменении размеров скролла, вызываем пересчет высот,
     * так как мог поменяться контент вне списка. По-другому мы эти изменения не отследим.
     */
    scrollResized(size: number): void {
        this._scrollContainerSize = size;
        this._inertialScrolling.setMaxScrollPosition(
            getMaxScrollPosition(this._scrollContainerSize, this._viewportSize)
        );

        const newHiddenState = this._scrollController.isListContainerHidden();
        if (!this._listIsHidden && newHiddenState) {
            this._listIsHidden = true;
            // При скрытии списка нужно сказать, что виртуализация выключена
            // Форсим переданное значение, чтобы hasMore не влияло на навигацию.
            // Мы хотим принудительно выключить навигацию.
            this._updateVirtualNavigationUtil(
                {
                    backward: false,
                    forward: false,
                },
                true
            );
        } else if (this._listIsHidden && !newHiddenState) {
            this._listIsHidden = false;
            // При показе списка нужно восстановить состояние виртуализации
            this._updateVirtualNavigationUtil({
                backward: this._collection.getStartIndex() > 0,
                forward: this._collection.getStopIndex() < this._collection.getCount(),
            });
        }

        // застиканный контент может изменить размер, поэтому нужно обновить viewportOverlaySize
        this._scrollController.updateViewportOverlaySize();

        const contentBeforeListChanged = this._scrollController.updateContentSizeBeforeList();
        // Если размер itemsContainer-а изменился между beforeRender списка и событием scrollResize,
        // значит какая-то запись асинхронно построилась и сработал ResizeObserver. Поэтому нам нужно обновить размеры.
        const itemsContainerSizeChanged = this._scrollController.updateItemsContainerSize();
        this._scrollController.setScrollContainerSize(size);

        // Также нужно обновить размеры, т.к. могут измениться размеры контента до списка
        if (
            (contentBeforeListChanged || itemsContainerSizeChanged) &&
            !this._isScheduledUpdateItemsSizes()
        ) {
            // т.к. scrollResized может сработать до afterRender,
            // то нам в этом кейсе сперва нужно пересчитать элементы отрисованные за пределами диапазона.
            this._updateItemsRenderedOutsideRange();

            this._scrollController.updateItemsSizes();
        }
    }

    protected _contentResized(contentSize: number): boolean {
        const changed = this._scrollController.listContainerResized(contentSize);
        // contentResized может сработать до afterRender.
        // Поэтому если запланировано обновление размеров, то мы его должны обязательно сделать на afterRender
        if (changed && !this._isScheduledUpdateItemsSizes()) {
            // т.к. contentResized может сработать до afterRender,
            // то нам в этом кейсе сперва нужно пересчитать элементы отрисованные за пределами диапазона.
            this._updateItemsRenderedOutsideRange();

            this._scrollController.updateItemsSizes();
        }
        return changed;
    }

    protected _viewportResized(viewportSize: number): boolean {
        this._viewportSize = viewportSize;
        this._inertialScrolling.setMaxScrollPosition(
            getMaxScrollPosition(this._scrollContainerSize, this._viewportSize)
        );

        return this._scrollController.viewportResized(viewportSize);
    }

    setActiveElementKey(activeElementKey: TItemKey): void {
        if (this._activeElementKey !== activeElementKey) {
            this._activeElementKey = activeElementKey;
            if (this._scrollController && this._collection) {
                this._scrollController.setActiveElementIndex(this._getIndexByKey(activeElementKey));
            }
        }
    }

    getEdgeVisibleItem(direction: IDirection, offset?: number): IEdgeItem {
        return this._scrollController.getEdgeVisibleItem({ direction, offset });
    }

    checkTriggersVisibility(schedule: boolean = false): void {
        if (schedule) {
            this._scheduleCheckTriggersVisibility();
            return;
        }

        if (this._checkTriggersVisibilityTimeout) {
            clearTimeout(this._checkTriggersVisibilityTimeout);
        }

        // Возможна ситуация, что мы сперва проверим из кода что триггер виден, а после этого отработает observer.
        // Нужно гарантированно сперва дать отработать observer-у.
        // requestAnimationFrame, чтобы гарантированно изменения отобразились на странице.
        // Другой порядок не даст нам таких гарантий и либо IO не отработает, либо попадаем в цикл синхронизации.
        window?.requestAnimationFrame(() => {
            this._checkTriggersVisibilityTimeout = setTimeout(() => {
                const rangePromise = !!this._beforeVirtualRangeChangeCallbackPromise;
                // Если сейчас идет синхронизация(что-то отрисовывается) или мы запланировали скролл, то
                // переносим проверку видимости триггеров на следующий afterRender, когда уже
                // точно отрисуются изменения и запланированный скролл будет выполнен(в частности восстановление)
                if (
                    rangePromise ||
                    this._renderInProgress ||
                    this._isScheduledScroll() ||
                    this._renderNewIndexes
                ) {
                    this._scheduleCheckTriggersVisibility();
                } else {
                    this._scrollController.checkTriggersVisibility();
                }
            }, CHECK_TRIGGERS_DELAY);
        });
    }

    // region CollectionChanges

    addItems(position: number, count: number, scrollMode: IScrollMode, calcMode: ICalcMode): void {
        // Если скролл не будет восстанавливаться, то сбрасываем predicatedRestoreDirection
        if ((calcMode === 'nothing' && scrollMode !== 'fixed') || scrollMode === 'unfixed') {
            this._predicatedRestoreDirection = null;
        }
        const oldItemSizes = this._scrollController.getItemsSizes();
        const oldPlaceholders = this._scrollController.getPlaceholders();
        const oldRange = {
            startIndex: this._collection.getStartIndex(),
            endIndex: this._collection.getStopIndex(),
        };
        this._wasAdding = true;
        this._scrollController.addItems(position, count, scrollMode, calcMode);

        // В этом случае новые записи вытеснят старые из диапазона, поэтому нужно обновить размеры записей
        if (calcMode === 'nothing') {
            this._scheduleUpdateItemsSizes({
                startIndex: this._collection.getStartIndex(),
                endIndex: this._collection.getStopIndex(),
            });
            // если pageSize не заполняет вьюпорт то триггер может быть все еще виден и нужно пересчитать диапазон
            this._scheduleCheckTriggersVisibility();

            // Диапазон может не пересчитаться(условие выше), но в этом случае все равно может быть
            // необходимо восстановление скролла.
            // Т.к. добавленные записи могут вытеснить в отображаемый диапазон другие записи,
            // которые могут иметь другие размеры
            if (scrollMode === 'fixed') {
                this._scheduleScroll({
                    type: 'calculateRestoreScrollParams',
                    params: {
                        direction: 'backward',
                        itemsSizes: oldItemSizes,
                        placeholders: oldPlaceholders,
                        range: oldRange,
                    },
                });
            }
        }
    }

    moveItems(
        addPosition: number,
        addCount: number,
        removePosition: number,
        removeCount: number
    ): void {
        this._scrollController.moveItems(addPosition, addCount, removePosition, removeCount);
    }

    removeItems(position: number, count: number, scrollMode: IScrollMode): void {
        this._scrollController.removeItems(position, count, scrollMode);
    }

    resetItems(): void {
        const activeIndex = this._getIndexByKey(this._activeElementKey);
        // скроллим к активному элементу только если он задан и он есть в списке
        // Если активный элемент находится в начале, то на маунт он и так виден, поэтому не скроллим к нему.
        // Если вызвать скролл, то ничего не произойдет, но при наличии графической шапки она сожмется.
        // Если есть скролл, то шапка уже сжата и нам надо проскроллить.
        const shouldScrollToActiveItem =
            activeIndex !== -1 && !(activeIndex === 0 && !this._scrollPosition);

        // Браузер при замене контента всегда пытается восстановить скролл в прошлую позицию.
        // Т.е. если scrollTop = 1000, а размер нового контента будет лишь 500, то видимым будет последний элемент.
        // Из-за этого получится что мы вначале из-за нативного подскрола видим последний элемент, а затем сами
        // устанавливаем скролл в "0".
        // Как итог - контент мелькает. Поэтому сбрасываем скролл в 0 именно ДО отрисовки.
        // Пример ошибки: https://online.sbis.ru/opendoc.html?guid=c3812a26-2301-4998-8283-bcea2751f741
        // Демка нативного поведения: https://jsfiddle.net/alex111089/rjuc7ey6/1/
        // Не нужно сбрасывать скролл, если список не был проскроллен и нужно будет скроллить вверх,
        // т.к. вызов скролла не вызовет изменений, но при этом сожмется графическая шапка.
        // Не нужно сбрасывать скролл, если будем скроллить к активному элементу.
        const shouldResetScrollPosition =
            this._scrollOnReset === 'reset' &&
            (!!this._scrollPosition || this._isEndInitialScrollPosition()) &&
            !shouldScrollToActiveItem;
        if (shouldResetScrollPosition && this._shouldDoScroll()) {
            const scrollParam = this._isEndInitialScrollPosition() ? 'bottom' : 'top';
            this._scheduleScroll({
                type: 'doScroll',
                params: { scrollParam },
            });
        }

        const totalCount = this._getCollectionItemsCount();
        this._scrollController.updateGivenItemsSizes(this._getGivenItemsSizes());

        // Инициализируем диапазон, начиная:
        // с текущего startIndex, если собираемся оставить прежнюю позицию скролла,
        // с индекса активного элемента, если он задан
        // с нуля в остальных случаях
        const startIndex =
            this._scrollOnReset === 'keep'
                ? this._collection.getStartIndex()
                : activeIndex !== -1
                ? activeIndex
                : 0;
        // При сохраненнии позиции скролла на reset нужно сохранить и старый диапазон.
        // Для этого недостаточно сохранять только startIndex, т.к. из-за смещений диапазона
        // его размер может не соответствовать pageSize, поэтому зная только startIndex и pageSize
        // не получится восстановить старый диапазон.
        const endIndex = this._scrollOnReset === 'keep' ? this._collection.getStopIndex() : null;
        this._scrollController.resetItems(
            totalCount,
            { startIndex, endIndex },
            this._getGivenItemsSizes()
        );
        if (shouldScrollToActiveItem) {
            if (this._feature1184208466) {
                this._scrollController.setTriggersAllowed(false);
            }
            if (this._renderInProgress) {
                this._scheduleScroll({
                    type: 'scrollToElement',
                    params: {
                        key: this._activeElementKey,
                        position: 'top',
                        force: true,
                    },
                });
            } else {
                this.scrollToItem(this._activeElementKey, 'top', true);
            }
        }
    }

    changeItems(): void {
        if (this._shouldSaveScrollPosition()) {
            this.saveScrollPosition();
        }
        this._scheduleUpdateItemsSizes({
            startIndex: this._collection.getStartIndex(),
            endIndex: this._collection.getStopIndex(),
        });
    }

    // endregion CollectionChanges

    // region ScrollTo

    /**
     * Выполняет подскролл к элементу коллекции
     * @param key - ключ элемета коллекции, к которому нужно сделать подскролл
     * @param position - целевое положение элемента
     * @param force - нужна ли прокрутка, если элемент уже виден
     * @param selfScroll - Является ли подскролл "служебным" и нужно ли игнорировать его обработку.
     * (Временно, пока activeElement не всегда находится в начале вьюпорта)
     * @param waitInertialScroll
     */
    scrollToItem(
        key: TItemKey,
        position?: string,
        force?: boolean,
        selfScroll: boolean = true,
        waitInertialScroll: boolean = true
    ): Promise<void> {
        const itemIndex = this._getIndexByKey(key);
        if (itemIndex === -1 || this._scrollController.isListContainerHidden()) {
            return Promise.resolve();
        }

        // Если уже запланирован подскролл к этой записи, то не будем планировать еще один
        if (
            this._scrollToItemPromise &&
            this._scheduledScrollParams &&
            this._scheduledScrollParams.type === 'scrollToElement' &&
            (this._scheduledScrollParams.params as IScheduledScrollToElementParams).key === key
        ) {
            return this._scrollToItemPromise;
        }
        this._scrollToItemPromise = new Promise<void>((resolver) => {
            return (this._scrollCompletedCallback = resolver);
        });
        this._scrollToItemPromise.finally(() => {
            return (this._scrollToItemPromise = null);
        });
        const rangeChanged = this._scrollController.scrollToItem(itemIndex, force, position);

        // Если текущее состояние не отрендерилось, то записи, к которой скроллят, может не быть
        // TODO: убрать, когда построение будет только синхронным.
        const isAllRendered = !(this._isReact && this._feature1184208466) || this._isAllRendered();
        const rangePromise = !!this._beforeVirtualRangeChangeCallbackPromise;
        if (
            rangeChanged ||
            this._scheduledScrollParams ||
            this._renderNewIndexes ||
            !isAllRendered ||
            rangePromise
        ) {
            this._scheduleScroll({
                type: 'scrollToElement',
                params: { key, position, force, selfScroll },
            });
        } else {
            this._scrollToElement(key, position, force, selfScroll, waitInertialScroll);
        }

        return this._scrollToItemPromise;
    }

    isScrollToItemInProgress(): boolean {
        return this._scheduledScrollParams?.type === 'scrollToElement';
    }

    /**
     * Скроллит к переданной странице.
     * Скроллит так, чтобы было видно последний элемент с предыдущей страницы, чтобы не потерять "контекст".
     * Смещает диапазон, возвращает промис с ключом записи верхней полностью видимой записи.
     * @param direction Условная страница, к которой нужно скроллить. (Следующая, предыдущая)
     * @private
     */
    scrollToPage(direction: IDirection): Promise<TItemKey> {
        this._scrollToPageBlocked = true;

        const afterScrollCallback = () => {
            this._scrollToPageBlocked = false;
            return this._getFirstVisibleItemKey();
        };

        const edgeItem = this._scrollController.getEdgeVisibleItem({
            direction,
        });
        if (edgeItem && this._scrollController.getScrollToPageMode(edgeItem.key) === 'edgeItem') {
            const scrollPosition = direction === 'forward' ? 'top' : 'bottom';
            return this.scrollToItem(edgeItem.key, scrollPosition, true, false).then(
                afterScrollCallback
            );
        } else {
            const promise = new Promise<void>((resolver) => {
                return (this._scrollCompletedCallback = resolver);
            });
            this._doScroll(direction === 'forward' ? 'pageDown' : 'pageUp');
            return promise.then(afterScrollCallback);
        }
    }

    /**
     * Скроллит к переданному краю списка.
     * Смещает диапазон, возвращает промис с индексами крайних видимых полностью элементов.
     * @param edge Край списка
     * @private
     */
    scrollToEdge(edge: IDirection): Promise<void | TItemKey> {
        const itemIndex = edge === 'backward' ? 0 : this._getCollectionItemsCount() - 1;
        const item = this._collection.at(itemIndex);
        // не нужно скроллить, если список пуст
        if (item) {
            const itemKey = item.key;
            let itemPosition;
            if (edge === 'backward') {
                itemPosition = 'top';
            } else {
                // Если скроллим к forward краю и изначальная позиция скролла была в конце,
                // то мы должны увидеть край последней записси
                itemPosition = 'bottom';
            }

            // передаем selfScroll = false, чтобы скролл был обработан и пересчитался активный элемент.
            return this.scrollToItem(itemKey, itemPosition, true, false).then(() => {
                this._doScroll(itemPosition);
                return this._getFirstVisibleItemKey();
            });
        } else {
            return Promise.resolve();
        }
    }

    shouldShiftRangeBeforeScrollToItem(index: number, position?: string, force?: boolean): boolean {
        return this._scrollController.shouldShiftRangeBeforeScrollToItem(index, position, force);
    }

    protected _getFirstVisibleItemKey(): TItemKey {
        if (!this._collection || !this._getCollectionItemsCount()) {
            return null;
        }

        const firstVisibleItemIndex = this._scrollController.getFirstVisibleItemIndex();
        const item = this._collection.at(firstVisibleItemIndex);
        return item ? item.key : null;
    }

    // endregion ScrollTo

    // region Triggers

    setBackwardTriggerVisibility(visible: boolean): void {
        this._scrollController.setBackwardTriggerVisibility(visible);
    }

    setForwardTriggerVisibility(visible: boolean): void {
        this._scrollController.setForwardTriggerVisibility(visible);
    }

    setBackwardTriggerPosition(position: ITriggerPosition): void {
        this._scrollController.setBackwardTriggerPosition(position);
    }

    setForwardTriggerPosition(position: ITriggerPosition): void {
        this._scrollController.setForwardTriggerPosition(position);
    }

    setAdditionalTriggersOffsets(additionalTriggersOffsets: IAdditionalTriggersOffsets): void {
        this._scrollController.setAdditionalTriggersOffsets(additionalTriggersOffsets);
    }

    // endregion Triggers

    private _createScrollController(options: TOptions): void {
        const scrollControllerOptions = this._getScrollControllerOptions(options);
        this._scrollController = new ScrollController(scrollControllerOptions);
    }

    protected _getScrollControllerOptions(options: TOptions): IScrollControllerOptions {
        const itemsQuerySelector = this._getItemsSelector(
            options.itemsQuerySelector,
            options.virtualScrollConfig.mode
        );
        return {
            listControl: options.listControl,
            virtualScrollConfig: options.virtualScrollConfig,

            itemsContainer: options.itemsContainer,
            listContainer: options.listContainer,

            itemsQuerySelector,
            itemsSizeControllerConstructor: this._getItemsSizeControllerConstructor(options),
            observerControllerConstructor: this._getObserversControllerConstructor(),
            triggersQuerySelector: this._getTriggersSelector(options.triggersQuerySelector),

            triggersVisibility: options.triggersVisibility,
            triggersOffsetCoefficients: options.triggersOffsetCoefficients,
            triggersPositions: options.triggersPositions,
            additionalTriggersOffsets: options.additionalTriggersOffsets,

            scrollPosition: options.scrollPosition || 0,
            viewportSize: options.virtualScrollConfig.viewportHeight || options.viewportSize || 0,
            contentSize: options.contentSize || 0,
            totalCount: this._getCollectionItemsCount(),
            givenItemsSizes: this._getGivenItemsSizes(),
            feature1183225611: options.feature1183225611,
            feature1184208466: options.feature1184208466,
            disableVirtualScroll: options.disableVirtualScroll,
            activeElementIndex: this._getIndexByKey(options.activeElementKey),
            indexesInitializedCallback: this._indexesInitializedCallback.bind(this),
            indexesChangedCallback: this._indexesChangedCallback.bind(this),
            itemsSizesUpdatedCallback: options.itemsSizesUpdatedCallback,
            validateItemCallback: this._validateEdgeItem,
            placeholdersChangedCallback: (placeholders: IPlaceholders): void => {
                this._scheduleUpdatePlaceholders(placeholders);
            },
            hasItemsOutRangeChangedCallback: this._hasItemsOutRangeChangedHandler.bind(this),
            activeElementChangedCallback: options.activeElementChangedCallback,
            itemsEndedCallback: options.itemsEndedCallback,
            triggersOffsetMode: options.triggersOffsetMode || 'inset',

            inertialScrolling: this._inertialScrolling,
        };
    }

    protected _hasItemsOutRangeChangedHandler(
        hasItemsOutsideOfRange: IHasItemsOutsideOfRange
    ): void {
        this._scheduleUpdateHasItemsOutRange(hasItemsOutsideOfRange);
        if (this._hasItemsOutRangeChangedCallback) {
            this._hasItemsOutRangeChangedCallback(hasItemsOutsideOfRange);
        }
        // Это нужно выполнять в этом же цикле синхронизации.
        // Чтобы ScrollContainer и отступ под пэйджинг отрисовались в этом же цикле.
        if (this._updateVirtualNavigationUtil) {
            this._updateVirtualNavigationUtil(hasItemsOutsideOfRange);
        }

        // Если у нас есть записи скрытые виртуальным скроллом, то мы точно должны показать триггер.
        if (hasItemsOutsideOfRange.backward) {
            this.setBackwardTriggerVisibility(true);
        }
        if (hasItemsOutsideOfRange.forward) {
            this.setForwardTriggerVisibility(true);
        }
    }

    private _indexesInitializedCallback(params: IIndexesChangedParams<ICalculatorState>): void {
        this._handleChangedIndexes(params.range, null, () => {
            if (this._scrollOnReset === 'restore') {
                this._scheduleScroll({
                    type: 'calculateRestoreScrollParams',
                    params: {
                        range: params.oldState.range,
                        placeholders: params.oldState.placeholders,
                        itemsSizes: params.oldState.itemsSizes,
                        direction: 'backward',
                    },
                });
            }

            // нужно сразу сбросить плэйсхолдеры в ScrollContainer-е, не дожидаясь отрисовок,
            // чтобы он сразу правильно прислал событие scrollMoveSync, а не virtualScrollMove
            this._scheduledUpdatePlaceholders = null;
            this._updatePlaceholdersUtil({
                backward: 0,
                forward: 0,
            });

            // TODO: убрать, когда не будет асинхронного построения
            if (this._isReact && this._feature1184208466 && this._virtualScrollMode === 'hide') {
                this._collection.resetRenderedItems();
            }
            this.setScrollBehaviourOnReset(null);
        });
    }

    private _indexesChangedCallback(params: IIndexesChangedParams<ICalculatorState>): void {
        this._handleChangedIndexes(params.range, params.shiftDirection, () => {
            if (!this._feature1184208466) {
                // Запрещаем срабатывание триггера во время отрисовки новых индексов,
                // чтобы не было сразу нескольких смещений диапазона за одну отрисовку.
                // Может сработать наша проверка checkTriggersVisibility и асинхронно еще отстрелит ObserverController.
                this._scrollController.setTriggersAllowed(false);
            }

            // Планируем восстановление скролла. Скролл можно восстановить запомнив крайний видимый элемент (IEdgeItem).
            // EdgeItem мы можем посчитать только на _beforeRender - это момент когда точно прекратятся события scroll
            // и мы будем знать актуальную scrollPosition.
            // Поэтому в params запоминаем необходимые параметры для подсчета EdgeItem.
            if (params.restoreDirection && params.scrollMode === 'fixed') {
                const restoreDirection =
                    this._predicatedRestoreDirection || params.restoreDirection;
                this._predicatedRestoreDirection = null;

                // Если уже был запланирован скролл к элементу или doScroll к краю списка,
                // то нет смысла восстанавливать скролл
                const scheduledScrollType = this._scheduledScrollParams?.type;
                if (
                    scheduledScrollType !== 'scrollToElement' &&
                    scheduledScrollType !== 'doScroll'
                ) {
                    this._scheduleScroll({
                        type: 'calculateRestoreScrollParams',
                        params: {
                            direction: restoreDirection,
                            range: params.oldState.range,
                            placeholders: params.oldState.placeholders,
                            itemsSizes: params.oldState.itemsSizes,
                        } as IEdgeItemCalculatingParams,
                    });
                }
            }

            if (this._feature1184208466) {
                this._scrollController.setTriggersAllowed(this._isAllRendered());
            }
        });
    }

    /**
     * Обрабатывает новые индексы сразу же или после выполнения текущей синхронизации.
     * Для дополнительной обработки можно передать handleAdditionallyCallback
     * @param range Новый диапазон
     * @param shiftDirection
     * @param handleAdditionallyCallback Коллбэк с дополнительными действиями
     * @private
     */
    private _handleChangedIndexes(
        range: IItemsRange,
        shiftDirection: IDirection,
        handleAdditionallyCallback?: Function
    ): void {
        const callback = () => {
            this._renderNewIndexes = true;
            this._scheduleUpdateItemsSizes(range);
            // Возможно ситуация, что после смещения диапазона(подгрузки данных) триггер остался виден
            // Поэтому после отрисовки нужно проверить, не виден ли он. Если он все еще виден, то нужно
            // вызвать observerCallback. Сам колбэк не вызовется, т.к. видимость триггера не поменялась.
            this._scheduleCheckTriggersVisibility();
            // Если меняется только endIndex, то это не вызовет изменения скролла и восстанавливать его не нужно.
            // Например, если по триггеру отрисовать записи вниз, то скролл не изменится.
            // НО когда у нас меняется startIndex, то мы отпрыгнем вверх, если не восстановим скролл.
            // PS. ОБРАТИТЬ ВНИМАНИЕ! Восстанавливать скролл нужно ВСЕГДА, т.к. если записи добавляются в самое начало,
            // то startIndex не изменится, а изменится только endIndex, но по факту это изменение startIndex.
            this._applyIndexes(range.startIndex, range.endIndex, shiftDirection);

            if (handleAdditionallyCallback) {
                handleAdditionallyCallback();
            }
        };

        const applyRange = () => {
            // Нельзя изменять индексы во время отрисовки, т.к. возможно что afterRender будет вызван другими измениями.
            // Из-за этого на afterRender не будет еще отрисован новый диапазон, он отрисуется на следующую синхронизацию.
            if (this._renderInProgress) {
                this._handleChangedIndexesAfterSynchronizationCallback = callback;
            } else {
                callback();
            }
        };

        const applyRangeWithCallback = () => {
            const beforeRangeChangeCallbackResult = this.callBeforeRangeChangeCallback?.(range);
            if (beforeRangeChangeCallbackResult instanceof Promise) {
                if (this._wasAdding) {
                    this._wasAdding = false;
                    // При добавлении, когда требуется предзагрузка данных для записей,
                    // откладываем применение индексов, чтобы отложить отрисовку записей до загрузки данных для них.
                    // Но есть ситуации, когда из-за откладывания применения индексов, пропадают уже видимые записи.
                    // Это происходит, когда добавляют записи в начало диапазона,
                    // тем самым увеличивая индексы последних записей.
                    // Поэтому временно проставляем индексы, чтобы старые записи остались видны.
                    this._applyIndexes(
                        Math.min(this._collection.getStartIndex(), range.startIndex),
                        Math.max(this._collection.getStopIndex(), range.endIndex),
                        shiftDirection
                    );
                }
                beforeRangeChangeCallbackResult.then(() => {
                    applyRange();
                });
            } else {
                applyRange();
            }
        };

        if (this._beforeVirtualRangeChangeCallbackPromise) {
            this._beforeVirtualRangeChangeCallbackPromise.then(applyRangeWithCallback);
        } else {
            applyRangeWithCallback();
        }
    }

    callBeforeRangeChangeCallback(range): Promise<unknown> | void {
        if (this._beforeVirtualRangeChangeCallbackPromise) {
            return this._beforeVirtualRangeChangeCallbackPromise.then(() => {
                this._beforeVirtualRangeChangeCallbackPromise = null;
                return this.callBeforeRangeChangeCallback(range);
            });
        } else {
            const beforeRangeChangeCallbackResult = this._beforeVirtualRangeChangeCallback?.(range);
            if (beforeRangeChangeCallbackResult instanceof Promise) {
                // Пока ждем промиса до применения нового диапазона, мы не можем смещать диапазон еще раз.
                this._scrollController.setTriggersAllowed(false);
                this._beforeVirtualRangeChangeCallbackPromise = beforeRangeChangeCallbackResult;
                beforeRangeChangeCallbackResult.then(
                    () => (this._beforeVirtualRangeChangeCallbackPromise = null)
                );
                return beforeRangeChangeCallbackResult;
            }
        }
    }

    private _scheduleUpdateItemsSizes(itemsRange: IItemsRange): void {
        // Не планируем обновление размеров, если список не замаунтился.
        // Почситаем размеры после маунта в одной точке - viewResize
        if (this._mounted) {
            this._itemsRangeScheduledSizeUpdate = itemsRange;
        }
    }

    private _isScheduledUpdateItemsSizes(): boolean {
        // Обновление размеров элементов запланировано, если:
        // 1. Непосредственно уже запланировано обновление размеров
        // 2. Запланирована обработка новых индексов (это потом спровоцирует планирование обновления размеров)
        // 3. Есть незавершенный промис для применения индексов. После их отрисовки будет обновление размеров
        return (
            !!this._itemsRangeScheduledSizeUpdate ||
            !!this._handleChangedIndexesAfterSynchronizationCallback ||
            !!this._beforeVirtualRangeChangeCallbackPromise
        );
    }

    private _handleScheduledUpdateItemsSizes(): void {
        if (this._itemsRangeScheduledSizeUpdate) {
            this._scrollController.updateItemsSizes(this._itemsRangeScheduledSizeUpdate);
            this._itemsRangeScheduledSizeUpdate = null;
        }
    }

    private _scheduleUpdateHasItemsOutRange(hasItemsOutsideOfRange: IHasItemsOutsideOfRange): void {
        this._scheduledUpdateHasItemsOutRange = hasItemsOutsideOfRange;
    }

    private _handleScheduledUpdateHasItemsOutRange(): void {
        const hasItemsOutsideOfRange = this._scheduledUpdateHasItemsOutRange;
        if (hasItemsOutsideOfRange) {
            if (this._updateShadowsUtil) {
                this._updateShadowsUtil(hasItemsOutsideOfRange);
            }
            this._scheduledUpdateHasItemsOutRange = null;
        }
    }

    private _scheduleCheckTriggersVisibility(): void {
        this._scheduledCheckTriggersVisibility = true;
    }

    private _handleScheduledCheckTriggerVisibility(): void {
        if (this._isReact && this._feature1184208466 && !this._isAllRendered()) {
            // Если не все записи завершили отрисовку, то рано проверять видимость триггеров.
            return;
        }
        if (this._scheduledCheckTriggersVisibility) {
            this._scheduledCheckTriggersVisibility = false;

            this.checkTriggersVisibility();
        }
    }

    protected _isAllRendered(range?: IItemsRange): boolean {
        let allRendered = true;

        // С фичей ожидания асинхронного построения определяем отрисован ли весь диапазон по _renderedItems
        if (this._feature1184208466) {
            const startIndex = range ? range.startIndex : this._collection.getStartIndex();
            const endIndex = range ? range.endIndex : this._collection.getStopIndex();
            for (let i = startIndex; i < endIndex && allRendered; i++) {
                const item = this._collection.at(i);
                if (this._collection.getSourceIndexByItem(item) === -1) {
                    continue;
                }
                allRendered = this._renderedItems.includes(item.key);
            }
        } else {
            // Иначе, если мы все еще ждем промис, чтобы сменить диапазон, значит не все отрендерено.
            allRendered = !this._beforeVirtualRangeChangeCallbackPromise;
        }

        return allRendered;
    }

    private _isItemRendered(itemKey: CrudEntityKey): boolean {
        return this._renderedItems.includes(itemKey);
    }

    protected _scheduleUpdatePlaceholders(placeholders: IPlaceholders): void {
        this._scheduledUpdatePlaceholders = placeholders;
    }

    private _handleScheduledUpdatePlaceholders(): void {
        if (this._scheduledUpdatePlaceholders) {
            this._updatePlaceholdersUtil(this._scheduledUpdatePlaceholders);
            this._scheduledUpdatePlaceholders = null;
        }
    }

    protected _isScheduledScroll(): boolean {
        return !!this._scheduledScrollParams;
    }

    protected _scheduleScroll(scrollParams: IScheduledScrollParams): void {
        this._scheduledScrollParams = scrollParams;
    }

    protected _validateEdgeItem(itemKey: string): boolean {
        return true;
    }

    protected _handleScheduledScroll(): void {
        if (this._scheduledScrollParams) {
            switch (this._scheduledScrollParams.type) {
                case 'calculateRestoreScrollParams':
                    const params = this._scheduledScrollParams.params as IEdgeItemCalculatingParams;
                    const edgeItem = this._scrollController.getEdgeVisibleItem(params);
                    this._scheduledScrollParams = null;

                    if (edgeItem) {
                        this._scheduleScroll({
                            type: 'restoreScroll',
                            params: edgeItem,
                        });
                    }
                    break;
                case 'restoreScroll':
                    const restoreScrollParams = this._scheduledScrollParams.params as IEdgeItem;
                    const scrollPosition =
                        this._scrollController.getScrollPositionToEdgeItem(restoreScrollParams);
                    this._selfScroll = true;
                    const scrollWillNotChange = this._doScroll(scrollPosition);

                    // если позиция для восстановления совпадает с текущей, то скролл не поменяется и события не будет.
                    if (scrollWillNotChange) {
                        this._selfScroll = false;
                    }
                    this._scheduledScrollParams = null;
                    break;
                case 'scrollToElement':
                    const scrollToElementParams = this._scheduledScrollParams
                        .params as IScheduledScrollToElementParams;

                    // Переносим скролл на следующий рендер, если индексы будут применены только на этот рендер
                    //
                    if (this._handleChangedIndexesAfterSynchronizationCallback) {
                        break;
                    }

                    this._scrollToElement(
                        scrollToElementParams.key,
                        scrollToElementParams.position,
                        scrollToElementParams.force,
                        scrollToElementParams.selfScroll
                    );
                    this._scheduledScrollParams = null;
                    break;
                case 'doScroll':
                    const doScrollParams = this._scheduledScrollParams.params as IDoScrollParams;
                    // Здесь вызываем утилиту без вызова метода shouldDoScroll,
                    // т.к. мы эту проверку сделали при планировании скролла.
                    // Например, при проваливании узла мы должны сбросить скролл в 0,
                    // но после отрисовки проверка уже может не пройти
                    this._doScrollUtil(doScrollParams.scrollParam);
                    this._scheduledScrollParams = null;
                    break;
                case 'applyScrollPosition':
                    // containerBase в событии virtualScrollMove прокидывает callback, который нужно позвать
                    // после отрисовки нового диапазона для установки scrollPosition
                    const applyScrollParams = this._scheduledScrollParams
                        .params as IScheduledApplyScrollPositionParams;
                    const position = applyScrollParams.callback();

                    // После виртуального скролла scrollPosition может остаться прежним, тогда события скролла не будет.
                    // Но активный элемент пересчитать все еще нужно, поэтому вызываем обработчик здесь
                    this.scrollPositionChange(position);
                    this._scheduledScrollParams = null;
                    break;
                default:
                    Logger.error(
                        `${ERROR_PATH}::_handleScheduledScroll | ` +
                            'Внутренняя ошибка списков! Неопределенный тип запланированного скролла.'
                    );
            }
            if (
                !this._handleChangedIndexesAfterSynchronizationCallback &&
                this._feature1184208466
            ) {
                this._scrollController.setTriggersAllowed(this._isAllRendered());
            }
        }
    }

    private _doScroll(scrollParam: IScrollParam): boolean {
        return this._shouldDoScroll() && this._doScrollUtil(scrollParam);
    }

    private _shouldDoScroll(): boolean {
        // Если размер списка меньше вьюпорта, то он не должен управлять скроллом.
        // Это бессмыслено, так как либо скролла нет, либо маленький список - не основной контент в этом скролле
        return this._scrollController.shouldDoScroll();
    }

    private _scrollToElement(
        key: TItemKey,
        position?: string,
        force?: boolean,
        selfScroll?: boolean,
        waitInertialScroll?: boolean
    ): void {
        const scrollToElement = () => {
            let currentItemIndex = this._collection.getIndexByKey(key);
            let element = this.getElement(key);

            // Скроллим к первому видимому элементу, т.к. к скрытому элементу невозможно проскроллить
            while (element && getComputedStyle(element).display === 'none') {
                currentItemIndex++;
                const item = this._collection.at(currentItemIndex);
                element = item ? this.getElement(item.key) : null;
            }

            if (element) {
                this._selfScroll = selfScroll !== false;
                const result = this._scrollToElementUtil(element, position, force);
                if (result instanceof Promise) {
                    result.then(() => {
                        this._scrollCompletedCallback();
                        this._scrollCompletedCallback = null;
                    });
                } else {
                    this._scrollCompletedCallback?.();
                    this._scrollCompletedCallback = null;
                }
            } else {
                if (this._feature1184208466 && !this._isItemRendered(key)) {
                    // Если еще не отрендерили запись, переносим подскролл.
                    this._scheduleScroll({
                        type: 'scrollToElement',
                        params: { key, position, force, selfScroll },
                    });
                } else {
                    Logger.error(
                        `${ERROR_PATH}::_scrollToElement | ` +
                            'Внутренняя ошибка списков! По ключу записи не найден DOM элемент. ' +
                            'Промис scrollToItem не отстрельнет, возможны ошибки.'
                    );
                }
            }
        };

        if (waitInertialScroll) {
            this._inertialScrolling.callAfterScrollStopped(scrollToElement);
        } else {
            scrollToElement();
        }
    }

    /**
     * Корректирует селктор элементов.
     * Если виртуальный скролл настроен скрывать записи вне диапазона, то нужно в селекторе исключить скрытые записи.
     * @param selector
     * @param virtualScrollMode
     * @private
     */
    protected _getItemsSelector(selector: string, virtualScrollMode: TVirtualScrollMode): string {
        let correctedSelector = selector;
        if (virtualScrollMode === 'hide') {
            correctedSelector += `:not(${HIDDEN_ITEM_SELECTOR})`;
        }
        if (this._itemsContainerUniqueSelector) {
            correctedSelector = `${this._itemsContainerUniqueSelector} > ${correctedSelector}`;
        }
        return correctedSelector;
    }

    protected _getTriggersSelector(selector: string): string {
        return selector;
    }

    private _getGivenItemsSizes(): IItemsSizes | null {
        if (!this._itemSizeProperty) {
            return null;
        }
        let offset = 0;
        return this._collection.getItems().map((it) => {
            const itemSize = {
                size: it.getGivenItemsSize(this._itemSizeProperty),
                offset,
                key: String(it.key),
            };

            if (!itemSize.size) {
                Logger.error(
                    'Controls/baseList:BaseControl | Задана опция itemHeightProperty, ' +
                        `но для записи с ключом "${it.key}" высота не определена!`
                );
            }
            offset += itemSize.size;
            return itemSize;
        });
    }

    private _updateItemsRenderedOutsideRange(): void {
        const itemsRenderedOutsideRange: IRenderedOutsideItem[] = [];
        this._collection.each((item, index) => {
            if (item.isRenderedOutsideRange()) {
                itemsRenderedOutsideRange.push({
                    key: String(item.key),
                    collectionIndex: index,
                });
            }
        });

        if (!isEqual(this._itemsRenderedOutsideRange, itemsRenderedOutsideRange)) {
            this._itemsRenderedOutsideRange = itemsRenderedOutsideRange;

            // Если скрылась или отобразилась запись за пределами диапазона, то нужно восстановить скролл
            if (!this._isScheduledScroll()) {
                this.saveScrollPosition();
            }
            if (!this._isScheduledUpdateItemsSizes()) {
                this._scheduleUpdateItemsSizes({
                    startIndex: this._collection.getStartIndex(),
                    endIndex: this._collection.getStopIndex(),
                });
            }

            this._scrollController.setItemsRenderedOutsideRange(itemsRenderedOutsideRange);
        }
    }

    private _initCollection(collection: IVirtualCollection): void {
        if (this._collection === collection) {
            return;
        }

        // При смене коллекции мы не знаем, была ли до этого коллекция и была ли она уничтожена.
        // Если не была уничтожена, то нужно сбросить итератор, который установил AbstractListVirtualScrollController.
        // Неразрушенная коллекция при вызове resetViewIterator сбросит его к дефолтному.
        if (this._collection && !this._collection.isDestroyed()) {
            this._collection.resetViewIterator();
        }

        this._collection = collection;
        if (this._collection) {
            this._setCollectionIterator();
        }
    }

    private _isEndInitialScrollPosition(): boolean {
        return this._initialScrollPosition === 'end';
    }

    private _shouldSaveScrollPosition(): boolean {
        return !!this._scrollPosition;
    }

    protected _setCollectionIterator(): void {
        switch (this._virtualScrollMode) {
            case 'hide':
                VirtualScrollHideController.setup(
                    this
                        ._collection as unknown as VirtualScrollHideController.IVirtualScrollHideCollection
                );
                break;
            default:
                VirtualScrollController.setup(
                    this._collection as unknown as VirtualScrollController.IVirtualScrollCollection
                );
                break;
        }
    }

    protected abstract _getCollectionItemsCount(): number;

    protected abstract _getIndexByKey<T extends TItemKey = TItemKey>(key: T): number;

    protected abstract _applyIndexes(
        startIndex: number,
        endIndex: number,
        shiftDirection: IDirection
    ): void;
}

// Как работает pageDown/pageUp:
// 1. Обрабатывается нажатие клавиши
// 2. Получаем крайний видимый элемент
// 3. Скроллим к нему
// 4. Возвращаем промис с ключом записи, к которой проскролили
// 5. Ставим маркер на эту запись

// Как работает восстановление скролла:
// 1. Срабатывает trigger, вызываем shiftToDirection, смещаем диапазон
// 2. Вызываем indexesChangedCallback
// 3. Планируем восстановление скролла. Для этого запоминаем текущий(не новый) range, плейсхолдеры и shiftDirection
// 4. На beforeRender считаем крайний видимый элемент по параметрам из шага 3.
// 5. На afterRender считаем новый scrollPosition до крайнего видимого элемента
// EdgeItem можно запоминать ТОЛЬКО на beforeRender, т.к. после срабатывания триггера может произойти скролл.
// beforeRender - это точка после которой гарантированно не будет меняться scrollPosition.
// Но т.к. мы считаем EdgeItem на beforeRender, нам нужно прокидывать старый range и плейсхолдер, чтобы EdgeItem
// посчитать по состоянию до смещения диапазона.
// Плейсхолдер нужны, чтобы из ItemSizes посчитать актуальный offset
// (ItemSize.offset = placeholders.backward + element.offset(настоящий оффсет в DOM)
