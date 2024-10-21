/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { SyntheticEvent } from 'UICommon/Events';
import {
    getScrollContainerPageCoords,
    isCursorAtScrollPoint,
    SCROLL_DIRECTION,
} from 'Controls/_scroll/Utils/Scroll';
import { Entity } from 'Controls/dragnDrop';
import AutoScroll from 'Controls/_scroll/ContainerBase/AutoScroll';
import { AUTOSCROLL_SIZE } from './AutoScroll';
import { IAutoScrollOptions } from './AutoScroll';

// Автоподскролл при DnD.
export default class DnDAutoScroll {
    readonly _autoScroll: AutoScroll;
    // Флаг, идентифицирующий включен или выключен в текущий момент функционал автоскролла при приближении мыши к
    // верхней/нижней границе скролл контейнера.
    private _requiredAutoScroll: boolean = false;

    private _dragObject: {
        domEvent: MouseEvent;
        parentScrollContainerRect: DOMRect;
    };

    constructor(autoScroll: AutoScroll) {
        this._autoScroll = autoScroll;
    }

    updateOptions(options: IAutoScrollOptions): void {
        this._autoScroll.updateOptions(options);
    }

    onDragStart(dragObject: { entity: Entity; domEvent: MouseEvent }): void {
        const parentScrollContainer = dragObject.domEvent.target.closest(
            '.controls-Scroll-Container'
        );
        this._dragObject = {
            ...dragObject,
            parentScrollContainerRect: parentScrollContainer
                ? parentScrollContainer.getBoundingClientRect()
                : null,
        };
        this._requiredAutoScroll = !!dragObject.entity?.allowAutoscroll;
        this._autoScroll._scrollContainerCoords = getScrollContainerPageCoords(
            this._autoScroll._scrollContainer
        );

        const coords = getScrollContainerPageCoords(this._autoScroll._scrollContainer);
        // Если при начале перетаскивания курсор уже находится около границы контейнера,
        // то автоскролл запускать не нужно, надо дождаться пока он выйдет из области и только
        // при следующем заходе запустить процесс авто-скроллинга
        this._skipVerticalAutoscroll = isCursorAtScrollPoint(
            coords,
            dragObject.domEvent,
            AUTOSCROLL_SIZE
        ).near;
        this._skipHorizontalAutoscroll = isCursorAtScrollPoint(
            coords,
            dragObject.domEvent,
            AUTOSCROLL_SIZE,
            SCROLL_DIRECTION.HORIZONTAL
        ).near;
    }

    onDragEnd(): void {
        this._dragObject = null;
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
        this._requiredAutoScroll = false;
        // При окончании драга нужно стопнуть интервал.
        this._autoScroll.stopAutoScroll();
    }

    // Дополнительный обработчик автоскрола при DragNDrop
    dndScrollHandler(): void {
        if (!this._requiredAutoScroll) {
            this._autoScroll.stopAutoScroll();
            return;
        }
    }

    // Обрабатываем движение курсором мыши для того, что бы инициировать автоскролл когда курсор подходит к верхней
    // или нижней границе контейнера.
    onMouseMove(
        event: SyntheticEvent,
        verticalScrollAvailable: boolean,
        horizontalScrollAvailable: boolean
    ): void {
        const cursorPosition = this._autoScroll.getCursorPosition(event);

        if (!this._requiredAutoScroll) {
            this._autoScroll.onMouseMove(event, verticalScrollAvailable, horizontalScrollAvailable);
            return;
        }

        if (this._dragObject.parentScrollContainerRect) {
            const isParentContainerOfDraggableElement =
                this._dragObject.domEvent.target.closest('.controls-Scroll-Container') ===
                this._autoScroll._scrollContainer;
            const cursorOnParentContainer =
                this._dragObject.parentScrollContainerRect.left < cursorPosition.pageX &&
                this._dragObject.parentScrollContainerRect.right > cursorPosition.pageX &&
                this._dragObject.parentScrollContainerRect.top < cursorPosition.pageY &&
                this._dragObject.parentScrollContainerRect.bottom > cursorPosition.pageY;
            if (cursorOnParentContainer && !isParentContainerOfDraggableElement) {
                return;
            }
        }

        this._autoScroll.startAutoScroll(cursorPosition, true, true, this.dndScrollHandler, this);
    }

    onMouseLeave(): void {
        if (this._requiredAutoScroll) {
            document.addEventListener('mousemove', this.onMouseMove.bind(this));
        } else {
            this._autoScroll.onMouseLeave();
        }
        // При выходе курсора за границы скролл контейнера так же нужно сбросить
        // флаг что бы автоскролл запустился при следующем заходе в область
        this._autoScroll._skipVerticalAutoscroll = false;
        this._autoScroll._skipHorizontalAutoscroll = false;
    }

    destroy(): void {
        this._autoScroll.destroy();
        document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }
}
