/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import type { EdgeIntersectionObserver } from 'Controls/scroll';
import { Control } from 'UI/Base';
import type {
    IDirection,
    IHasItemsOutsideOfRange,
} from 'Controls/_baseList/Controllers/ScrollController/ScrollController';
import { Logger } from 'UI/Utils';
import { isEqual } from 'Types/object';
import { IPlaceholders } from '../ScrollController';

const ERROR_PATH =
    'Controls/_baseList/Controllers/ScrollController/ObserversController/AbstractObserversController';
const COUNT_TRIGGERS = 2;

export type TIntersectionEvent = 'bottomIn' | 'bottomOut' | 'topIn' | 'topOut';

export interface ITriggersOffsets {
    backward: number;
    forward: number;
}

export interface ITriggersVisibility {
    backward: boolean;
    forward: boolean;
}

export type ITriggerPosition = 'null' | 'offset';

export interface ITriggersPositions {
    backward: ITriggerPosition;
    forward: ITriggerPosition;
}

export interface ITriggersOffsetCoefficients {
    backward: number;
    forward: number;
}

export interface IAdditionalTriggersOffsets {
    backward: number;
    forward: number;
}

export type TObserversCallback = (direction: IDirection) => void;

export type ITriggersOffsetMode = 'translate' | 'inset';

export interface IAbstractObserversControllerBaseOptions {
    listControl: Control;
    listContainer?: HTMLElement;
    viewportSize: number;
    contentSize: number;
    scrollPosition: number;
    triggersQuerySelector: string;
    triggersVisibility: ITriggersVisibility;
    triggersOffsetCoefficients: ITriggersOffsetCoefficients;
    triggersPositions: ITriggersPositions;
    additionalTriggersOffsets: IAdditionalTriggersOffsets;
    hasItemsOutsideOfRange?: IHasItemsOutsideOfRange;
    triggersOffsetMode: ITriggersOffsetMode;
}

export interface IAbstractObserversControllerOptions
    extends IAbstractObserversControllerBaseOptions {
    observersCallback: TObserversCallback;
}

export const DEFAULT_TRIGGER_OFFSET = 0.3;

/**
 * Класс предназначен для управления observer, срабатывающим при достижении границ контента списка.
 * @private
 */
export abstract class AbstractObserversController {
    private _listControl: Control;
    protected _listContainer: HTMLElement;
    protected _triggers: HTMLElement[] = [];
    private _triggersQuerySelector: string;
    private _viewportSize: number;
    private _scrollPosition: number = 0;
    protected _listContainerSize: number = 0;
    private _contentSizeBeforeList: number = 0;
    protected _triggersOffsetMode: ITriggersOffsetMode;

    protected _placeholders: IPlaceholders = { backward: 0, forward: 0 };
    private _hasItemsOutRange: IHasItemsOutsideOfRange = {
        backward: false,
        forward: false,
    };

    private _triggersOffsetCoefficients: ITriggersOffsetCoefficients;

    /**
     * Сбрасываем оффсет триггеров в 0 пр помощи этих переменных.
     * Это нужно для того, чтобы изначально не произошло лишних подгрузок и чтобы триггер работал, если список пустой.
     * @private
     */
    private _triggersPositions: ITriggersPositions;

    private _triggersVisibility: ITriggersVisibility;
    private _triggersOffsets: ITriggersOffsets = {
        backward: 0,
        forward: 0,
    };

    private _additionalTriggersOffsets: IAdditionalTriggersOffsets = {
        backward: 0,
        forward: 0,
    };

    protected _observer: EdgeIntersectionObserver;
    private readonly _observersCallback: TObserversCallback;

    constructor(options: IAbstractObserversControllerOptions) {
        this._listControl = options.listControl;
        this._listContainer = options.listContainer;
        this._viewportSize = options.viewportSize || 0;
        this._listContainerSize = options.contentSize || 0;
        this._scrollPosition = options.scrollPosition || 0;
        this._triggersQuerySelector = options.triggersQuerySelector;
        this._triggersVisibility = options.triggersVisibility;
        this._observersCallback = options.observersCallback;
        this._triggersOffsetMode = options.triggersOffsetMode;

        this._triggersOffsetCoefficients = options.triggersOffsetCoefficients;
        this._triggersPositions = options.triggersPositions;
        if (options.additionalTriggersOffsets) {
            this._additionalTriggersOffsets = options.additionalTriggersOffsets;
        }
        if (options.hasItemsOutsideOfRange) {
            this._hasItemsOutRange = options.hasItemsOutsideOfRange;
        }

        if (this._listContainer) {
            this._updateTriggers();
        }
    }

    destroy(): void {
        if (this._observer) {
            this._observer.destroy();
            this._observer = null;
        }
    }

    setListContainer(newListContainer: HTMLElement): void {
        this._listContainer = newListContainer;
        if (this._observer) {
            this._observer.destroy();
        }
        this._updateTriggers();
    }

    setViewportSize(size: number): ITriggersOffsets {
        if (this._viewportSize !== size) {
            this._viewportSize = size;
            this._recalculateOffsets();
        }

        return this.getTriggersOffsets();
    }

    setContentSizeBeforeList(size: number): boolean {
        const changed = this._contentSizeBeforeList !== size;
        if (changed) {
            this._contentSizeBeforeList = size;
        }
        return changed;
    }

    setScrollPosition(position: number): void {
        if (this._scrollPosition !== position) {
            this._scrollPosition = position;
        }
    }

    setListContainerSize(size: number): ITriggersOffsets {
        if (this._listContainerSize !== size) {
            this._listContainerSize = size;
            this._recalculateOffsets();
        }

        return this.getTriggersOffsets();
    }

    setHasItemsOutRange(hasItemsOutsideOfRange: IHasItemsOutsideOfRange): void {
        this._hasItemsOutRange = hasItemsOutsideOfRange;
    }

    setPlaceholders(placeholders: IPlaceholders): void {
        this._placeholders = placeholders;
    }

    setBackwardTriggerPosition(position: ITriggerPosition): ITriggersOffsets {
        if (this._triggersPositions.backward !== position) {
            this._triggersPositions.backward = position;
            this._recalculateOffsets();
        }

        return this.getTriggersOffsets();
    }

    setForwardTriggerPosition(position: ITriggerPosition): ITriggersOffsets {
        if (this._triggersPositions.forward !== position) {
            this._triggersPositions.forward = position;
            this._recalculateOffsets();
        }

        return this.getTriggersOffsets();
    }

    /**
     * Задает размеры дополнительного отступа для триггеров.
     * Используется, чтобы позиционировать триггер от ромашки, а не от края списка.
     * Можно избавиться, если позиционировать триггер с помощью transform=`translateY({offset}px), но
     * нужн решить проблему с пробелом перед списком, если триггер релативный https://jsfiddle.net/hg7qc8s1/49/
     */
    setAdditionalTriggersOffsets(
        additionalTriggersOffsets: IAdditionalTriggersOffsets
    ): ITriggersOffsets {
        if (!isEqual(this._additionalTriggersOffsets, additionalTriggersOffsets)) {
            this._additionalTriggersOffsets = additionalTriggersOffsets;
            this._recalculateOffsets();
        }

        return this.getTriggersOffsets();
    }

    getTriggersOffsets(): ITriggersOffsets {
        return this._triggersOffsets;
    }

    /**
     * Проверяет видимость триггера и если триггер виден, то для него вызывает observerCallback.
     * Данный метод нужен для сценария, если после отрисовки новых записей триггер остался виден.
     * В этом кейсе нативный IntersectionObserver не вызовет повторно колбэк, поэтому мы проверяем сами.
     */
    checkTriggersVisibility(): void {
        // если список скрыт, то не нужно проверять видимость триггеров
        if (!this._listContainer || !this._listContainer.offsetParent) {
            return;
        }

        // Сперва смотрим триггер в конце списка, т.к. в первую очередь должны в эту сторону отображать записи.
        if (this._isTriggerVisible('forward', this._contentSizeBeforeList)) {
            this._intersectionObserverHandler('bottomIn');
        }
        if (this._isTriggerVisible('backward', this._contentSizeBeforeList)) {
            this._intersectionObserverHandler('topIn');
        }
    }

    updateTriggers(): void {
        this._updateTriggers();
    }

    // region TriggerVisibility

    setBackwardTriggerVisibility(visible: boolean): void {
        if (this._triggersVisibility.backward !== visible) {
            this._setTriggerVisible('backward', visible);
            this._triggersVisibility.backward = visible;
        }
    }

    setForwardTriggerVisibility(visible: boolean): void {
        if (this._triggersVisibility.forward !== visible) {
            this._setTriggerVisible('forward', visible);
            this._triggersVisibility.forward = visible;
        }
    }

    private _setTriggerVisible(direction: IDirection, visible: boolean): void {
        const trigger = direction === 'forward' ? this._triggers[1] : this._triggers[0];
        // Триггера может не быть, например если список сразу же построился со скрытыми записями виртуальным скроллом.
        // Но вызовется сеттер видимости триггера в beforeMount, нужно запомнить ее в стейте.
        // А видимость триггеру проставим сразу же на afterMount, когда его получим из dom-а.
        if (!trigger) {
            return;
        }

        if (trigger.style.display !== 'none' && trigger.style.display !== '') {
            Logger.error(
                `${ERROR_PATH}::_setTriggerVisibility | ` +
                    'В стиле триггера невозможное значение display. ' +
                    'Нужно проверить стили и классы навешанные на триггеры.'
            );
        }

        const currentVisible = trigger.style.display === '';
        if (!currentVisible && visible) {
            trigger.style.display = '';
        } else if (currentVisible && !visible) {
            trigger.style.display = 'none';
        }
    }

    // endregion TriggerVisibility

    // region OnCollectionChange

    resetItems(): ITriggersOffsets {
        // Прижимаем триггер к краю, чтобы после перезагрузки не было лишних подгрузок
        // Если прикладники настроили свой оффсет, то не прижимаем триггер.
        // Т.к. прикладникам в этом кейсе такая оптимизация не нужна, они хотят видеть записи заранее
        if (this._triggersOffsetCoefficients.backward === DEFAULT_TRIGGER_OFFSET) {
            this.setBackwardTriggerPosition('null');
        }
        if (this._triggersOffsetCoefficients.forward === DEFAULT_TRIGGER_OFFSET) {
            this.setForwardTriggerPosition('null');
        }
        this.setAdditionalTriggersOffsets({
            forward: 0,
            backward: 0,
        });
        return this.getTriggersOffsets();
    }

    // endregion OnCollectionChange

    private _intersectionObserverHandler(eventName: TIntersectionEvent): void {
        if (eventName === 'bottomOut' || eventName === 'topOut') {
            return;
        }

        let direction: IDirection;
        if (eventName === 'bottomIn') {
            direction = 'forward';
        }
        if (eventName === 'topIn') {
            direction = 'backward';
        }

        // Если у нас и так виден триггер вниз, то вверх не нужно вызывать обсервер.
        // Это нужно, чтобы в первую очередь отображались записи вниз.
        const shouldHandleTrigger =
            direction === 'forward' ||
            (direction === 'backward' &&
                (!this._hasItemsOutRange.forward ||
                    !this._isTriggerVisible('forward', this._contentSizeBeforeList)));
        if (shouldHandleTrigger) {
            this._observersCallback(direction);
        }
    }

    private _recalculateOffsets(): void {
        const size =
            this._listContainerSize < this._viewportSize
                ? this._listContainerSize
                : this._viewportSize;
        let newBackwardTriggerOffset =
            this._triggersPositions.backward === 'null'
                ? 0
                : size * this._triggersOffsetCoefficients.backward;
        let newForwardTriggerOffset =
            this._triggersPositions.forward === 'null'
                ? 0
                : size * this._triggersOffsetCoefficients.forward;

        newBackwardTriggerOffset += this._additionalTriggersOffsets.backward;
        newForwardTriggerOffset += this._additionalTriggersOffsets.forward;

        // Чтобы на различных масштабах триггер срабатывал, задаем ему offset 1 вместо 0.
        // Если задан 0, то браузер как-то странно округляет все значения и триггер в итоге не срабатывает.
        if (newBackwardTriggerOffset === 0) {
            newBackwardTriggerOffset = 1;
        }
        if (newForwardTriggerOffset === 0) {
            newForwardTriggerOffset = 1;
        }

        const backwardTriggerOffsetChanged =
            this._triggersOffsets.backward !== newBackwardTriggerOffset;
        const forwardTriggerOffsetChanged =
            this._triggersOffsets.forward !== newForwardTriggerOffset;

        this._triggersOffsets = {
            backward: newBackwardTriggerOffset,
            forward: newForwardTriggerOffset,
        };

        if (this._triggers && this._triggers.length) {
            if (backwardTriggerOffsetChanged) {
                this._applyTriggerOffset(
                    this._triggers[0],
                    'backward',
                    this._triggersOffsets.backward
                );
            }
            if (forwardTriggerOffsetChanged) {
                this._applyTriggerOffset(
                    this._triggers[1],
                    'forward',
                    this._triggersOffsets.forward
                );
            }
        }
    }

    protected _updateTriggers(): void {
        // нужно править юниты
        if (!this._listContainer) {
            return;
        }

        this._triggers = this._getTriggers();

        if (this._triggers.length !== COUNT_TRIGGERS) {
            return;
        }

        this._recalculateOffsets();

        this._triggers[0].style.display = this._triggersVisibility.backward ? '' : 'none';
        this._triggers[1].style.display = this._triggersVisibility.forward ? '' : 'none';
        this._applyTriggerOffset(this._triggers[0], 'backward', this._triggersOffsets.backward);
        this._applyTriggerOffset(this._triggers[1], 'forward', this._triggersOffsets.forward);

        this._observer = this._createTriggersObserver(
            this._listControl,
            this._intersectionObserverHandler.bind(this),
            ...this._triggers
        );
    }

    /**
     * Возвращает DOM-элементы триггеров.
     * @remark
     * Возвращает триггеры только из текущего списка, исключая триггеры вложенных списков.
     * Для этого сперва получает только первый триггер, который точно находится в этом списке,
     * т.к. лежит до itemsContainer. И уже получает все сестринские элементы к первому триггера
     * и из них выбирает только триггеры.
     * @private
     */
    protected _getTriggers(): HTMLElement[] {
        const allTriggers = Array.from(
            this._listContainer.querySelectorAll(this._triggersQuerySelector)
        );
        // Исключаем триггеры из вложенных списков. Триггеры текущего списка будут находиться в начале и в конце всегда,
        // т.к. элементы, которые могут содержать списки, находятся между триггерами.
        const triggersOfThisList = [allTriggers.shift(), allTriggers.pop()].filter((it) => {
            return !!it;
        }) as HTMLElement[];
        // Триггеров может не быть, например если отображается пустое представление
        if (triggersOfThisList.length !== 0 && triggersOfThisList.length !== COUNT_TRIGGERS) {
            Logger.error(
                'Неверное кол-во триггеров в списке.' +
                    ` Убедитесь, что на всех триггерах есть класс: ${this._triggersQuerySelector}`
            );
        }
        return triggersOfThisList;
    }

    private _isTriggerVisible(direction: IDirection, contentSizeBeforeList: number): boolean {
        if (direction === 'backward') {
            const backwardViewportPosition = this._scrollPosition;
            const backwardTriggerPosition = this._getTriggerPosition(
                direction,
                contentSizeBeforeList
            );
            return (
                this._triggersVisibility.backward &&
                backwardTriggerPosition >= backwardViewportPosition
            );
        } else {
            const forwardViewportPosition = this._scrollPosition + this._viewportSize;
            const forwardTriggerPosition = this._getTriggerPosition(
                direction,
                contentSizeBeforeList
            );
            return (
                this._triggersVisibility.forward &&
                forwardTriggerPosition <= forwardViewportPosition
            );
        }
    }

    protected _getTriggerPosition(direction: IDirection, contentSizeBeforeList: number): number {
        if (direction === 'backward') {
            return contentSizeBeforeList + this._triggersOffsets.backward;
        } else {
            return contentSizeBeforeList + this._listContainerSize - this._triggersOffsets.forward;
        }
    }

    /**
     * Создает observer для отслеживания видимости триггеров
     * @param component
     * @param handler
     * @param backwardTriggerElement
     * @param forwardTriggerElement
     * @protected
     */
    protected abstract _createTriggersObserver(
        component: Control,
        handler: Function,
        backwardTriggerElement?: HTMLElement,
        forwardTriggerElement?: HTMLElement
    ): EdgeIntersectionObserver;

    /**
     * Применяет отступ от края списка к элементу триггера
     * @param element
     * @param direction
     * @param offset
     * @protected
     */
    protected abstract _applyTriggerOffset(
        element: HTMLElement,
        direction: IDirection,
        offset: number
    ): void;
}
