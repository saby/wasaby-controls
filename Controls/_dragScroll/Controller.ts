/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import { constants } from 'Env/Env';
import type * as React from 'react';
import { DestroyableMixin } from 'Types/entity';
import { Logger } from 'UICommon/Utils';

export interface IDragScrollParams {
    startDragNDropCallback?(): void;

    canStartDragNDropCallback?(target: HTMLElement): boolean;

    canStartDragScrollCallback?(target: HTMLElement): boolean;

    onOverlayShown?(): void;

    onOverlayHide?(): void;

    scrollSpeedByDrag?: number;
}

const DEFAULT_SCROLL_SPEED_BY_DRAG = 0.75;
const DISTANCE_TO_START_DRAG_N_DROP = 3;
const START_ITEMS_DRAG_N_DROP_DELAY = 250;

interface IPoint {
    x: number;
    y: number;
}

export default class DragScroll extends DestroyableMixin {
    private readonly _canStartDragScrollCallback: IDragScrollParams['canStartDragScrollCallback'];
    private readonly _onOverlayShownCallback: IDragScrollParams['onOverlayShown'];
    private readonly _onOverlayHideCallback: IDragScrollParams['onOverlayHide'];
    private _startDragNDropCallback: IDragScrollParams['startDragNDropCallback'];
    private _canStartDragNDropCallback: IDragScrollParams['canStartDragNDropCallback'];

    private _scrollLength: number = 0;
    private _scrollPosition: number = 0;

    private readonly _scrollSpeed: number = DEFAULT_SCROLL_SPEED_BY_DRAG;

    private _isMouseDown: boolean = false;
    private _isOverlayShown: boolean = false;

    private _startMousePosition: IPoint;
    private _maxMouseMoveDistance: IPoint;
    private _startScrollPosition: number;
    private _currentScrollPosition: number;

    private _startItemsDragNDropTimer: number;

    constructor(params: IDragScrollParams) {
        super();
        this._onOverlayShownCallback = params.onOverlayShown;
        this._onOverlayHideCallback = params.onOverlayHide;

        if (!params.canStartDragScrollCallback) {
            this._canStartDragScrollCallback = () => {
                return true;
            };
        } else {
            this._canStartDragScrollCallback = params.canStartDragScrollCallback;
        }
        this._startDragNDropCallback = params.startDragNDropCallback;
        this._canStartDragNDropCallback = params.canStartDragNDropCallback;

        if (params.scrollSpeedByDrag && params.scrollSpeedByDrag <= 0) {
            Logger.warn(
                'Значение dragScrollSpeed не может быть меньше или равно нулю!' +
                    'При попытке задать dragScrollSpeed значение меньшее или равное нулю' +
                    'для него будет автоматически выставлено дефолтное значение равное "0.75"'
            );
            this._scrollSpeed = DEFAULT_SCROLL_SPEED_BY_DRAG;
        } else if (params.scrollSpeedByDrag) {
            this._scrollSpeed = params.scrollSpeedByDrag;
        }
    }

    setScrollPosition(newScrollPosition: number): void {
        this._scrollPosition = newScrollPosition;
    }

    setScrollLength(newScrollLength: number): void {
        this._scrollLength = newScrollLength;
    }

    setStartDragNDropCallback(callback: IDragScrollParams['startDragNDropCallback']): void {
        this._startDragNDropCallback = callback;
    }

    setCanStartDragNDropCallback(callback: IDragScrollParams['canStartDragScrollCallback']): void {
        this._canStartDragNDropCallback = callback;
    }

    isStarted(): boolean {
        return this._isMouseDown;
    }

    isScrolled(): boolean {
        return this._isMouseDown && this._maxMouseMoveDistance.x > 0;
    }

    startDragScroll(e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent): boolean {
        let isGrabStarted = false;
        // Обрабатываем только ПКМ или один тач.
        // Если началось скроллирование перетаскиванием, нужно убрать предыдущее
        // выделение и запретить выделение в процессе скроллирования.
        if (validateEvent(e)) {
            isGrabStarted = this._manageDragScrollStart(
                getCursorPosition(e),
                e.target as HTMLElement
            );
            if (isGrabStarted) {
                if (!isTouchEvent(e)) {
                    e.preventDefault();
                }
                this._clearSelection();
            }
        } else {
            this._manageDragScrollStop();
        }
        return isGrabStarted;
    }

    moveDragScroll(
        e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
    ): number | null {
        if (this._isMouseDown) {
            return this._manageDragScrollMove(getCursorPosition(e));
        }
        return null;
    }

    stopDragScroll(): void {
        if (this._isMouseDown) {
            this._manageDragScrollStop();
        }
    }

    _canStartDragNDrop(target: HTMLElement): boolean {
        let result = false;

        // Если DND доступен
        if (this._startDragNDropCallback) {
            if (this._canStartDragNDropCallback) {
                result = this._canStartDragNDropCallback(target);
            } else {
                result = true;
            }
        }

        return result;
    }

    /**
     * Начинает скроллирование с помощью Drag'N'Drop.
     * Возвращает флаг типа boolean, указывающий возможен ли старт прокрутки с помощью перетаскивания мыши.
     * @private
     */
    private _manageDragScrollStart(startPosition: IPoint, target: HTMLElement): boolean {
        const isTargetDragNDropDraggable = this._canStartDragNDrop(target);

        // Если за данный элемент нельзя скролить, то при возможности сразу начинаем DragNDrop.
        if (!this._isTargetScrollable(target)) {
            if (isTargetDragNDropDraggable) {
                this._initDragNDrop();
            }
            return false;
        }

        this._isMouseDown = true;
        this._startMousePosition = startPosition;
        this._startScrollPosition = this._scrollPosition;
        this._maxMouseMoveDistance = {
            x: 0,
            y: 0,
        };

        // Если в списке доступен DragNDrop, то он запускается отложенно и только в том случае, если пользователь
        // не начал водить мышью.
        // Если недоступен, то overlay по клину не поднимаем, иначе не сработают события click, mouseup по записи.
        if (isTargetDragNDropDraggable) {
            this._initDelayedDragNDrop();
        }
        return true;
    }

    /**
     * Обрабатывает перемещение указателя при запущеном перемещении скроле колонок через Drag'N'Drop
     * @param {IPoint} newMousePosition Координаты текущей позиции указателя.
     * @private
     */
    private _manageDragScrollMove(newMousePosition: IPoint): number | null {
        // Расстояние, на которое был перемещен указатель мыши с момента нажатия клавиши ПКМ.
        const mouseMoveDistance: IPoint = {
            x: newMousePosition.x - this._startMousePosition.x,
            y: newMousePosition.y - this._startMousePosition.y,
        };

        // Максимальное расстояние на которое был перемещен указатель мыши с момента нажатия клавиши ПКМ.
        this._maxMouseMoveDistance = {
            x: Math.max(Math.abs(this._maxMouseMoveDistance.x), Math.abs(mouseMoveDistance.x)),
            y: Math.max(Math.abs(this._maxMouseMoveDistance.y), Math.abs(mouseMoveDistance.y)),
        };

        // Если начали водить мышью вертикально, то начинаем drag'n'drop (если он включен в списке)
        if (this._shouldInitDragNDropByVerticalMovement()) {
            this._initDragNDrop();
            return null;
        }

        // Если активно начали водить мышью по горизонтали, то считаем, что будет drag scrolling.
        // Сбрасываем таймер отложенного запуска Drag'n'drop'а записей, при скролле он не должен возникать.
        // Показывыем overlay во весь экран, чтобы можно было водить мышкой где угодно на экране.
        // Если в списке нет Drag'n'drop'а записей, то сразу начинаем скроллирование при движении мышки.
        const distanceToStartDragNDrop = this._startDragNDropCallback
            ? DISTANCE_TO_START_DRAG_N_DROP
            : 0;
        if (this._maxMouseMoveDistance.x > distanceToStartDragNDrop) {
            if (!this._isOverlayShown) {
                this._showOverlay();
            }
        }

        // Новая позиция скролла лежит в диапазоне от 0 до максимально возможной прокрутке в списке.
        const newScrollPosition = Math.min(
            Math.max(
                this._startScrollPosition - Math.floor(this._scrollSpeed * mouseMoveDistance.x),
                0
            ),
            this._scrollLength
        );

        // Не надо стрелять событием, если позиция скролла не поменялась.
        if (this._currentScrollPosition !== newScrollPosition) {
            this._currentScrollPosition = newScrollPosition;
            this._scrollPosition = newScrollPosition;
            return newScrollPosition;
        } else {
            return null;
        }
    }

    /**
     * Завершает скроллирование с помощью Drag'N'Drop.
     * @private
     */
    private _manageDragScrollStop(): void {
        this._clearDragNDropTimer();
        this._isMouseDown = false;
        if (this._isOverlayShown && this._onOverlayHideCallback) {
            this._onOverlayHideCallback();
        }
        this._isOverlayShown = false;
        this._startMousePosition = null;
        this._maxMouseMoveDistance = null;
        this._startScrollPosition = 0;
        this._currentScrollPosition = 0;
    }

    /**
     * Активирует overlay сколлирования перетаскиванием. Overlay - растянутый на все окно браузера блок,
     * необходимый для возможности скроллирования даже за пределами таблицы.
     * Если overlay активен, Drag'N'Drop записей невозможен.
     * @private
     */
    private _showOverlay(): void {
        this._isOverlayShown = true;
        if (this._onOverlayShownCallback) {
            this._onOverlayShownCallback();
        }
        this._clearDragNDropTimer();
    }

    /**
     * Определяет, нужно ли запускать Drag'N'Drop записей при вертикальном перемещении мышки до срабатывания таймера.
     * Если была зажата клавиша мыши над элементом и указатель был перемещен на достаточно большое расстояние по вертикали,
     * то нужно незамедлительно начать Drag'N'Drop записей, даже если еще не прошло время отложенного запуска Drag'N'Drop записей.
     * После срабатывания таймера, запускать Drag'N'Drop записей при вертикальном перемещении мыши нецелесообразно, т.к.
     * либо Drag'N'Drop уже начался по отложенному запуску, либо началось скроллирование таблицы.
     *
     * @see IDragScrollOptions.dragNDropDelay
     * @see START_ITEMS_DRAG_N_DROP_DELAY
     * @see DISTANCE_TO_START_DRAG_N_DROP
     * @private
     */
    private _shouldInitDragNDropByVerticalMovement(): boolean {
        // TODO: Убрать селектор .controls-Grid__row, логически о нем знать здесь мы не можем
        return (
            !!this._startDragNDropCallback &&
            !this._isOverlayShown &&
            typeof this._startItemsDragNDropTimer === 'number' &&
            this._maxMouseMoveDistance.x < DISTANCE_TO_START_DRAG_N_DROP &&
            this._maxMouseMoveDistance.y > DISTANCE_TO_START_DRAG_N_DROP
        );
    }

    /**
     * Запускает Drag'N'Drop записей. Скроллирование колонок прекращается.
     * @private
     */
    private _initDragNDrop(): void {
        this._manageDragScrollStop();
        this._startDragNDropCallback();
    }

    /**
     * Отложенно запускает Drag'N'Drop записей если в течение определенного промежутка времени указатель не был перемещен
     * или был перемещен на небольшое расстояние. Скроллирование колонок в таком случае прекращается.
     *
     * @see IDragScrollOptions.dragNDropDelay
     * @see START_ITEMS_DRAG_N_DROP_DELAY
     * @see DISTANCE_TO_START_DRAG_N_DROP
     * @private
     */
    private _initDelayedDragNDrop(): void {
        this._startItemsDragNDropTimer = setTimeout(() => {
            this._startItemsDragNDropTimer = null;
            if (this._maxMouseMoveDistance.x < DISTANCE_TO_START_DRAG_N_DROP) {
                this._initDragNDrop();
            }
        }, START_ITEMS_DRAG_N_DROP_DELAY);
    }

    /**
     * Возвращает флаг типа boolean указывающий, можно ли скроллировать таблицу мышью за данный HTML элемент
     *
     * @param {HTMLElement} target HTML элемент, над которым была зажата клавиша мыши.
     * @return {Boolean} Флаг указывающий, можно ли скроллировать таблицу мышью за данный HTML элемент.
     * @private
     */
    private _isTargetScrollable(target: HTMLElement): boolean {
        return this._canStartDragScrollCallback(target);
    }

    /**
     * Сбросить таймер отложенного старта Drag'N'Drop'а записей.
     * Происходит например, если указатель увели достаточно далеко или Drag'N'Drop записей уже начался из-за
     * перемещения указателя вертикально.
     * @private
     */
    private _clearDragNDropTimer(): void {
        if (this._startItemsDragNDropTimer) {
            clearTimeout(this._startItemsDragNDropTimer);
            this._startItemsDragNDropTimer = null;
        }
    }

    /**
     * Возвращает объект Selection, представленный в виде диапазона текста, который пользователь выделил на странице.
     * @private
     */
    private _getSelection(): Selection | null {
        return constants.isBrowserPlatform ? window.getSelection() : null;
    }

    /**
     * Сбрасывает выделение текста в окне браузера.
     * @private
     */
    private _clearSelection(): void {
        const selection = this._getSelection();
        if (selection) {
            if (selection.removeAllRanges) {
                selection.removeAllRanges();
            } else if (selection.empty) {
                selection.empty();
            }
        }
    }

    destroy(): void {
        this._manageDragScrollStop();
    }
}

function getCursorPosition(
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
): IPoint {
    if ((e as TouchEvent).touches) {
        const touchEvent = e as TouchEvent;
        return {
            x: touchEvent.touches[0].clientX,
            y: touchEvent.touches[0].clientY,
        };
    } else {
        const mouseEvent = e as MouseEvent;
        return {
            x: mouseEvent.clientX,
            y: mouseEvent.clientY,
        };
    }
}

function isTouchEvent(
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
): e is TouchEvent | React.TouchEvent {
    return !!(e as TouchEvent | React.TouchEvent).touches;
}

function validateEvent(e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent): boolean {
    if (isTouchEvent(e)) {
        return e.touches.length === 1;
    } else {
        return e.buttons === 1;
    }
}
