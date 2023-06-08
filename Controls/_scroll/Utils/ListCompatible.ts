/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { DestroyableMixin } from 'Types/entity';
import { SCROLL_DIRECTION } from './Scroll';
import type ScrollModel from './ScrollModel';
import type ScrollState from './ScrollState';
import type { Control } from 'UI/Base';
import type { RegisterClass } from 'Controls/event';

interface IListCompatibleOptions {
    notifyUtil: Function;
}

export class ListCompatible extends DestroyableMixin {
    private _notifyUtil: Function;
    private _scrollMoveTimer: Record<SCROLL_DIRECTION, number> = {
        [SCROLL_DIRECTION.VERTICAL]: null,
        [SCROLL_DIRECTION.HORIZONTAL]: null,
    };

    constructor({ notifyUtil }: IListCompatibleOptions) {
        super();
        this._notifyUtil = notifyUtil;
    }

    generateCompatibleEvents(
        listScroll: RegisterClass,
        scrollModel: ScrollModel,
        oldScrollState: ScrollState
    ): void {
        if (
            scrollModel.clientHeight !== oldScrollState.clientHeight ||
            scrollModel.scrollHeight !== oldScrollState.scrollHeight ||
            scrollModel.contentClientHeight !==
                oldScrollState.contentClientHeight
        ) {
            this.sendByListScrollRegistrar(listScroll, 'scrollResize', {
                scrollHeight: scrollModel.scrollHeight,
                clientHeight: scrollModel.clientHeight,
            });
        }

        if (
            scrollModel.clientWidth !== oldScrollState.clientWidth ||
            scrollModel.scrollWidth !== oldScrollState.scrollWidth
        ) {
            this.sendByListScrollRegistrar(
                listScroll,
                'horizontalScrollResize',
                {
                    scrollWidth: scrollModel.scrollWidth,
                    clientWidth: scrollModel.clientWidth,
                }
            );
        }

        if (scrollModel.clientHeight !== oldScrollState.clientHeight) {
            this.sendByListScrollRegistrar(listScroll, 'viewportResize', {
                scrollHeight: scrollModel.scrollHeight,
                scrollTop: scrollModel.scrollTop,
                clientHeight: scrollModel.clientHeight,
                rect: scrollModel.viewPortRect,
            });
        }

        if (scrollModel.clientWidth !== oldScrollState.clientWidth) {
            this.sendByListScrollRegistrar(
                listScroll,
                'horizontalViewportResize',
                {
                    scrollHeight: scrollModel.scrollHeight,
                    scrollWidth: scrollModel.scrollWidth,
                    scrollTop: scrollModel.scrollTop,
                    scrollLeft: scrollModel.scrollLeft,
                    clientWidth: scrollModel.clientWidth,
                    clientHeight: scrollModel.clientHeight,
                    rect: scrollModel.viewPortRect,
                }
            );
        }

        if (scrollModel.scrollTop !== oldScrollState.scrollTop) {
            this.sendByListScrollRegistrar(listScroll, 'scrollMoveSync', {
                scrollTop: scrollModel.scrollTop,
                position: scrollModel.verticalPosition,
                clientHeight: scrollModel.clientHeight,
                scrollHeight: scrollModel.scrollHeight,
            });

            this._sendScrollMoveAsync(
                listScroll,
                scrollModel,
                SCROLL_DIRECTION.VERTICAL
            );
        }

        if (scrollModel.scrollLeft !== oldScrollState.scrollLeft) {
            this.sendByListScrollRegistrar(
                listScroll,
                'horizontalScrollMoveSync',
                {
                    scrollLeft: scrollModel.scrollLeft,
                    position: scrollModel.horizontalPosition,
                    clientWidth: scrollModel.clientWidth,
                    scrollWidth: scrollModel.scrollWidth,
                }
            );

            this._sendScrollMoveAsync(
                listScroll,
                scrollModel,
                SCROLL_DIRECTION.HORIZONTAL
            );
        }

        if (
            scrollModel.canVerticalScroll !== oldScrollState.canVerticalScroll
        ) {
            this.sendByListScrollRegistrar(
                listScroll,
                scrollModel.canVerticalScroll ? 'canScroll' : 'cantScroll',
                {
                    clientHeight: scrollModel.clientHeight,
                    scrollHeight: scrollModel.scrollHeight,
                    viewPortRect: scrollModel.viewPortRect,
                }
            );
        }

        if (
            scrollModel.canHorizontalScroll !==
            oldScrollState.canHorizontalScroll
        ) {
            this.sendByListScrollRegistrar(
                listScroll,
                scrollModel.canHorizontalScroll
                    ? 'canHorizontalScroll'
                    : 'cantHorizontalScroll',
                {
                    clientWidth: scrollModel.clientWidth,
                    scrollWidth: scrollModel.scrollWidth,
                    viewPortRect: scrollModel.viewPortRect,
                }
            );
        }
    }

    onRegisterNewListScrollComponent(
        listScroll: RegisterClass,
        scrollModel: ScrollModel,
        component: Control
    ): void {
        this._sendByListScrollRegistrarToComponent(
            listScroll,
            component,
            scrollModel.canVerticalScroll ? 'canScroll' : 'cantScroll',
            {
                clientHeight: scrollModel.clientHeight,
                scrollHeight: scrollModel.scrollHeight,
                viewPortRect: scrollModel.viewPortRect,
            }
        );

        // TODO: Свести в одно событие canScroll с параметрами
        this._sendByListScrollRegistrarToComponent(
            listScroll,
            component,
            scrollModel.canHorizontalScroll
                ? 'canHorizontalScroll'
                : 'cantHorizontalScroll',
            {
                clientWidth: scrollModel.clientWidth,
                scrollWidth: scrollModel.scrollWidth,
                viewPortRect: scrollModel.viewPortRect,
            }
        );

        this._sendByListScrollRegistrarToComponent(
            listScroll,
            component,
            'viewportResize',
            {
                scrollHeight: scrollModel.scrollHeight,
                scrollTop: scrollModel.scrollTop,
                clientHeight: scrollModel.clientHeight,
                scrollWidth: scrollModel.scrollWidth,
                scrollLeft: scrollModel.scrollLeft,
                clientWidth: scrollModel.clientWidth,
                rect: scrollModel.viewPortRect,
            }
        );

        // При регистрации кидаем событие scrollMoveSync только если контейнер проскроллен
        if (scrollModel.scrollTop) {
            this._sendByListScrollRegistrarToComponent(
                listScroll,
                component,
                'scrollMoveSync',
                {
                    scrollTop: scrollModel.scrollTop,
                    position: scrollModel.verticalPosition,
                    clientHeight: scrollModel.clientHeight,
                    scrollHeight: scrollModel.scrollHeight,
                }
            );
        }

        // TODO: Свести в одно событие viewportResize с параметрами
        this._sendByListScrollRegistrarToComponent(
            listScroll,
            component,
            'horizontalViewportResize',
            {
                scrollHeight: scrollModel.scrollHeight,
                scrollWidth: scrollModel.scrollWidth,
                scrollTop: scrollModel.scrollTop,
                scrollLeft: scrollModel.scrollLeft,
                clientWidth: scrollModel.clientWidth,
                clientHeight: scrollModel.clientHeight,
                rect: scrollModel.viewPortRect,
            }
        );
    }

    sendByListScrollRegistrar(
        listScroll: RegisterClass,
        eventType: string,
        params: object
    ): void {
        listScroll.start(eventType, params);
        this._notifyUtil(eventType, [params]);
    }

    private _sendScrollMoveAsync(
        listScroll: RegisterClass,
        scrollModel: ScrollModel,
        direction: SCROLL_DIRECTION
    ): void {
        if (this._scrollMoveTimer[direction]) {
            clearTimeout(this._scrollMoveTimer[direction]);
        }

        this._scrollMoveTimer[direction] = setTimeout(() => {
            // Т.к код выполняется асинхронно, может получиться, что контрол к моменту вызова функции уже
            // уничтожился
            if (!this.destroyed) {
                if (direction === SCROLL_DIRECTION.VERTICAL) {
                    this.sendByListScrollRegistrar(listScroll, 'scrollMove', {
                        scrollTop: scrollModel.scrollTop,
                        position: scrollModel.verticalPosition,
                        clientHeight: scrollModel.clientHeight,
                        scrollHeight: scrollModel.scrollHeight,
                    });
                } else {
                    this.sendByListScrollRegistrar(
                        listScroll,
                        'horizontalScrollMove',
                        {
                            scrollLeft: scrollModel.scrollLeft,
                            position: scrollModel.horizontalPosition,
                            clientWidth: scrollModel.clientWidth,
                            scrollWidth: scrollModel.scrollWidth,
                        }
                    );
                }
                this._scrollMoveTimer[direction] = null;
            }
        }, 0);
    }

    private _sendByListScrollRegistrarToComponent(
        listScroll: RegisterClass,
        component: Control,
        eventType: string,
        params: object
    ): void {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        listScroll.startOnceTarget(component, eventType, params);
    }

    destroy(...args: unknown[]): void {
        if (this._scrollMoveTimer.vertical) {
            clearTimeout(this._scrollMoveTimer.vertical);
        }
        if (this._scrollMoveTimer.horizontal) {
            clearTimeout(this._scrollMoveTimer.horizontal);
        }
        super.destroy(...args);
    }
}
