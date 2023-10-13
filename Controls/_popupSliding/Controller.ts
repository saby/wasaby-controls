/**
 * @kaizen_zone 5d04426f-0434-472a-b02c-eecab5eb3c36
 */
import { IDragOffset } from 'Controls/popupTemplate';
import { BaseController } from 'Controls/popupTemplateStrategy';
import {
    Controller as PopupController,
    IPopupItem,
    IPopupPosition,
    ISlidingPanelPopupOptions,
} from 'Controls/popup';
import * as PopupContent from 'wml!Controls/_popupSliding/SlidingPanelContent';
import SlidingPanelStrategy, { AnimationState, ISlidingPanelItem, ResizeType } from './Strategy';
import { constants, detection } from 'Env/Env';

const ANIMATION_CLASS = 'controls-SlidingPanel__animation';
const MAX_DELAY_ANIMATION = 800;

/**
 * SlidingPanel Popup Controller
 * @class Controls/_popupSliding/Opener/Controller
 *
 * @private
 * @extends Controls/_popupTemplate/BaseController
 */
class Controller extends BaseController {
    TYPE: string = 'SlidingPanel';
    private _destroyPromiseResolvers: Record<string, Function> = {};
    private _panels: ISlidingPanelItem[] = [];

    elementCreated(item: ISlidingPanelItem, container: HTMLDivElement): boolean {
        this._updatePopupSizes(item, container);
        // После создания запускаем анимацию изменив позицию
        item.position = SlidingPanelStrategy.getShowingPosition(
            item,
            this._getRestrictiveContainerCoords(item)
        );
        item.popupOptions.workspaceWidth = this._getWorkspaceWidth(item);
        item.animationState = AnimationState.showing;

        // Фиксим оттягивание документа при свайпе на IOS
        if (!this._hasOpenedPopups()) {
            this._toggleCancelBodyDragging(true);
        }

        this._addPopupToList(item);
        return true;
    }

    elementUpdated(
        item: ISlidingPanelItem,
        container: HTMLDivElement,
        isOrientationChanging?: boolean
    ): boolean {
        if (!this._isTopPopup(item) && !isOrientationChanging) {
            return false;
        }
        this._updatePosition(
            item,
            container,
            isOrientationChanging ? ResizeType.orientationChange : null
        );
        return true;
    }

    /**
     * Обновление размеров и позиции попапа
     * @param item
     * @param container
     * @param resizeType При изменении размеров экрана нужно варидировать размер шторки, чтобы она не оказалась меньше,
     * чем минимальная высота после возвращение экрана к нормальным размерам
     * @private
     */
    private _updatePosition(
        item: ISlidingPanelItem,
        container: HTMLDivElement,
        resizeType?: ResizeType
    ): void {
        if (resizeType === ResizeType.outer || resizeType === ResizeType.orientationChange) {
            this._fixOuterResize(item, container);
        }
        this._updatePopupSizes(item, container);
        const position = SlidingPanelStrategy.getPosition(
            item,
            this._getRestrictiveContainerCoords(item),
            resizeType
        );
        if (position.height !== item.position.height) {
            container.style.height = `${position.height}px`;
        }
        item.position = position;

        item.popupOptions.workspaceWidth = this._getWorkspaceWidth(item);
        if (!item.popupOptions.slidingPanelData) {
            item.popupOptions.slidingPanelData = this._getPopupTemplatePosition(item);
        }

        /* При смене ориентации в Application выполняется костыль, который ломает любое перепозиционирование
         * Он на 500мс делает body нефиксированной высоты,
         * в этот момент попапы перепозиционируются и неправильно считают координаты
         * Т.к. функция фиксит открытие клавиатуры, то её не нужно выполнять в случае смены ориентации,
         * сломается только кейс со сменой ориентации при открытой клаве, это более редкий кейс, ждет версию
         * TODO: https://online.sbis.ru/opendoc.html?guid=f8eb89f4-5bfe-44d2-95ca-485571580dc2
         * нужно в 6100 решить эту проблему, с вводом IoS 15 костыль скорее всего не актуален
         */
        if (resizeType !== ResizeType.orientationChange || !detection.isMobileSafari) {
            this._fixIosBug(item, container);
        }
    }

    /**
     * Фиксим тут следующую историю:
     * После открытия шторки/смены ориентации с портретной на альбомную восстановить высоту,
     * которая была до изменения высоты окна.
     * @param item
     * @param container
     */
    _fixOuterResize(item: ISlidingPanelItem, container: HTMLDivElement): void {
        const viewportHeight = window.visualViewport?.height;
        if (
            item.heightForRestoreAfterResize &&
            item.heightForRestoreAfterResize <= viewportHeight
        ) {
            const newHeight = item.heightForRestoreAfterResize;
            item.position.height = newHeight;
            container.style.height = newHeight + 'px';
            const maxHeight = item.position.maxHeight;
            if (maxHeight < newHeight) {
                item.position.maxHeight = newHeight;
                container.style.maxHeight = newHeight + 'px';
            }
            item.heightForRestoreAfterResize = null;
        } else {
            const oldHeight = item.sizes.height;
            if (oldHeight > viewportHeight) {
                item.heightForRestoreAfterResize = oldHeight;
            }
        }
    }

    _fixIosBug(item: ISlidingPanelItem, container: HTMLDivElement): void {
        if (!document) {
            return;
        }
        const bodyHeight = document.body.clientHeight;
        const viewportHeight = window.visualViewport?.height || document.body.clientHeight;
        const viewportOffsetTop = window.visualViewport?.offsetTop || 0;

        // Если высчитана высота берем ее, если высота по контенту, смотрим на контенте. На контенте до цикла синх.
        // значение может быть больше, чем позволяет maxHeight.
        const isFullHeight = item.position.height
            ? item.position.height === item.position.maxHeight
            : item.sizes.height >= item.position.maxHeight;

        // Если поле ввода в верхней части экрана, то при показе клавиатуры размер экрана браузера не ресайзится
        // (ресайзится только visualViewPort). В этом случае css св-во bottom: 0 будет позиционировать окно под
        // клавиатурой, т.к. физически отсчет координат начинается там.

        // Чтобы визаульно не было видно реакции окна при открыти клавы (изменения размеров, скачка позиции и т.п.)
        // Добавляю компенсацию высоты клавиатуры через отступ, сохраняя высоту окна.
        // Когда есть viewport.offsetTop, значит браузер при установке фокуса подскроллил окно и нужно компенсировать
        // отступ на размер offsetTop, т.к. нижняя часть body, от которой будет считаться позиция окажется выше
        const toggle = isFullHeight && bodyHeight > viewportHeight;
        if (toggle) {
            const dif = bodyHeight - viewportHeight - viewportOffsetTop;

            // Высоту так же компенсируем на размер офсета, т.к. мы уменьшили нижний отступ
            const panelMaxHeight = bodyHeight - viewportOffsetTop;
            item.position.height = panelMaxHeight;
            if (viewportHeight === item.position.maxHeight) {
                container.style.maxHeight = '100vh';
                item.position.maxHeight = undefined;
            } else {
                if (panelMaxHeight < item.position.maxHeight) {
                    container.style.maxHeight = `${panelMaxHeight}px`;
                    item.position.maxHeight = panelMaxHeight;
                }
            }

            // В шаблон нужно спускать высоту шаблона, без учета паддинга,
            // т.к. шаблон расчитывает там увидить данные о размерах попапа и он не знает ничего о паддинге
            const templateHeight = panelMaxHeight - dif;
            const slidingPanelData = item.popupOptions.slidingPanelData;
            slidingPanelData.height = templateHeight;
            slidingPanelData.maxHeight = templateHeight;
            if (slidingPanelData.minHeight > templateHeight) {
                slidingPanelData.minHeight = templateHeight;
            }
            // На ios есть проблема с подскроллом к активному элементу, а именно,
            // когда активный элемент находится в низу окна, то при изменении размеров шапки,
            // элемент находится под клавиатурой.
            // Поэтому сами подскроливаем через 410мс(значение подобрано экспериментально)
            // https://online.sbis.ru/opendoc.html?guid=c47fc224-b12e-4a61-bcb1-4970ced0c7b0
            if (document.activeElement && detection.isMobileIOS) {
                setTimeout(() => {
                    document.activeElement.scrollIntoView({
                        behavior: 'smooth',
                    });
                }, 410);
            }
        } else {
            container.style.paddingBottom = '0px';
            container.style.boxSizing = '';
        }
    }

    elementDestroyed(item: ISlidingPanelItem): Promise<void> {
        // Если попап еще не замаунчен, то просто закрываем без анимации
        if (!this._isPopupOpened(item)) {
            this._finishPopupClosing(item);
            return Promise.resolve(null);
        }

        // Запускаем анимацию закрытия и откладываем удаление до её окончания
        item.position = SlidingPanelStrategy.getHidingPosition(
            item,
            this._getRestrictiveContainerCoords(item)
        );
        item.popupOptions.workspaceWidth = this._getWorkspaceWidth(item);
        item.animationState = AnimationState.closing;
        return new Promise((resolve) => {
            this._destroyPromiseResolvers[item.id] = resolve;
            this._finishPopupClosing(item);
            // Есть проблема в специфических сценариях, когда событие завершения анимации может не прийти,
            // либо на слабых устройствах, анимация либо не происходит, либо происходит с большой задержкой.
            // Поэтому сами завершаем закрытие окна, через 800мс
            setTimeout(() => {
                if (item.animationState === AnimationState.closing) {
                    resolve();
                    this._destroyPromiseResolvers[item.id] = undefined;
                }
            }, MAX_DELAY_ANIMATION);
        });
    }

    elementAnimated(item: ISlidingPanelItem): boolean {
        if (item.animationState === 'showing') {
            /*
                После показа меняем координату позиционирования на противоположную,
                чтобы прибить окно к краю вьюпорта и не пересчитывать позицию при изменении размеров.
                Например: Если шторка открывается снизу, то будет bottom: 0;
             */
            if (!this._isKeyboardVisible()) {
                item.position = SlidingPanelStrategy.getPosition(
                    item,
                    this._getRestrictiveContainerCoords(item)
                );
            }
            item.popupOptions.className += ' controls-Popup_shown';
        }

        // Резолвим удаление, только после окончания анимации закрытия
        const destroyResolve = this._destroyPromiseResolvers[item.id];
        if (destroyResolve) {
            destroyResolve();
        }
        item.animationState = void 0;
        return true;
    }

    closePopupByOutsideClick(item: IPopupItem): void {
        if (item.popupOptions?.closeOnOverlayClick !== false) {
            super.closePopupByOutsideClick(item);
        }
    }

    resizeInner(item: ISlidingPanelItem, container: HTMLDivElement): boolean {
        const restrictiveContainerCoords = this._getRestrictiveContainerCoords(item);

        this._updatePopupSizes(item, container);

        // Если еще открытие, то ресайзим по стартовым координатам(по которым анимируем открытие)
        if (item.animationState === 'showing') {
            if (!item.position.height) {
                return true;
            }
            item.position = SlidingPanelStrategy.getStartPosition(item, restrictiveContainerCoords);
        } else {
            const height = item.position.height;
            item.position = SlidingPanelStrategy.getPosition(
                item,
                restrictiveContainerCoords,
                ResizeType.inner
            );
            if (item.position.height !== height) {
                container.style.height = item.position.height + 'px';
            }
        }
        item.popupOptions.slidingPanelData = this._getPopupTemplatePosition(item);
        item.popupOptions.workspaceWidth = this._getWorkspaceWidth(item);
        this._fixIosBug(item, container);
        // Если изменились размеры окна, то автоматически скроллим к полю ввода внутри окна, чтобы оно всегда было видно
        if (detection.isPhone && this._isKeyboardVisible()) {
            document.activeElement.scrollIntoView({block: 'center', behavior: 'smooth'});
        }
        return true;
    }

    resizeOuter(item: ISlidingPanelItem, container: HTMLDivElement): boolean {
        if (this._isTopPopup(item)) {
            this._updatePosition(item, container, ResizeType.outer);
            return true;
        }
        return false;
    }

    elementUpdateOptions(item: ISlidingPanelItem, container: HTMLElement): boolean {
        super.elementUpdateOptions(item, container);
        if (!item.popupOptions?.className?.includes(ANIMATION_CLASS)) {
            this._initItemAnimation(item);
        }
        return true;
    }

    protected _initItemAnimation(item: ISlidingPanelItem): void {
        item.popupOptions.className = `${
            item.popupOptions.className || ''
        } controls-SlidingPanel__popup
            ${ANIMATION_CLASS} controls_popupSliding_theme-${PopupController.getTheme()}`;
        item.animationState = AnimationState.initializing;
        if (item.popupState !== item.controller.POPUP_STATE_INITIALIZING) {
            item.popupOptions.className += ' controls-Popup_shown';
        }
    }

    protected _isKeyboardVisible(): boolean {
        if (detection.isMobilePlatform && constants.isBrowserPlatform && document.activeElement) {
            const isInput = document.activeElement.tagName === 'INPUT';
            const isTextArea = document.activeElement.tagName === 'TEXTAREA';
            const isContentEditable =
                document.activeElement.getAttribute('contenteditable') === 'true';

            if (isInput || isTextArea || isContentEditable) {
                return true;
            }
        }
        return false;
    }

    getDefaultConfig(item: ISlidingPanelItem): void | Promise<void> {
        item.position = SlidingPanelStrategy.getStartPosition(
            item,
            this._getRestrictiveContainerCoords(item)
        );
        this._initItemAnimation(item);
        item.popupOptions.workspaceWidth = this._getWorkspaceWidth(item);
        item.popupOptions.content = PopupContent;
        item.popupOptions.slidingPanelData = this._getPopupTemplatePosition(item);
    }

    popupDragStart(item: ISlidingPanelItem, container: HTMLDivElement, offset: IDragOffset): void {
        // Если открыта клавиатура, то размеры шторки оставляем прежними
        if (item.popupOptions.slidingPanelOptions.userMoveLocked || this._isKeyboardVisible()) {
            return;
        }
        const position = item.position;
        const isFirstDrag = !item.dragStartHeight;

        if (isFirstDrag) {
            item.dragStartHeight = this._getHeight(item);
        }

        const {slidingPanelOptions: {position: positionOption} = {}} = item.popupOptions;
        const heightOffset = positionOption === 'top' ? offset.y : -offset.y;
        const newHeight = item.dragStartHeight + heightOffset;

        position.height = newHeight;
        item.sizes.height = newHeight;
        item.position = SlidingPanelStrategy.getPosition(
            item,
            this._getRestrictiveContainerCoords(item)
        );
        item.popupOptions.workspaceWidth = this._getWorkspaceWidth(item);
        item.popupOptions.slidingPanelData = this._getPopupTemplatePosition(item);
        item.dragOffset = offset;
        this._fixIosBug(item, container);
    }

    popupDragEnd(item: ISlidingPanelItem): void {
        if (!this._isKeyboardVisible()) {
            const restrictiveContainerCoords = this._getRestrictiveContainerCoords(item);

            // Если драгали по горизонтали возвращаем первоначальную высоту,
            // чтобы не двигали шторку случайно при горизонтальном свайпе(например горизонтальный скролл)
            const finishHeight = this._isVerticalDrag(item.dragOffset, item)
                ? item.position.height
                : (item.dragStartHeight ?? item.sizes?.height);
            item.position.height = finishHeight;

            if (
                finishHeight < SlidingPanelStrategy.getMinHeight(item, restrictiveContainerCoords)
            ) {
                PopupController.remove(item.id);
            } else {
                item.position = SlidingPanelStrategy.getPositionAfterDrag(
                    item,
                    restrictiveContainerCoords
                );
            }
        } else {
            if (item.dragStartHeight) {
                item.position.height = item.dragStartHeight;
            }
        }
        item.dragStartHeight = null;
        item.dragOffset = null;
    }

    orientationChanged(item: ISlidingPanelItem, container: HTMLDivElement): boolean {
        return this.elementUpdated(item, container, true);
    }

    private _getWorkspaceWidth(item: ISlidingPanelItem): number {
        return item.position.width || item.sizes.width;
    }

    private _finishPopupClosing(item: ISlidingPanelItem): void {
        this._removePopupFromList(item);
        if (!this._hasOpenedPopups()) {
            this._toggleCancelBodyDragging(false);
        }
    }

    /**
     * Попап еще не открылся, если не стрельнул elementCreated или не закончилась анимация открытия.
     * @param item
     * @private
     */
    private _isPopupOpened(item: ISlidingPanelItem): boolean {
        return (
            item.animationState !== AnimationState.initializing &&
            item.animationState !== AnimationState.showing
        );
    }

    /**
     * Определяет опцию slidingPanelOptions для шаблона попапа
     * @param {ISlidingPanelItem} item
     * @return {ISlidingPanelData}
     * @private
     */
    private _getPopupTemplatePosition(
        item: ISlidingPanelItem
    ): ISlidingPanelPopupOptions['slidingPanelOptions'] {
        const restrictiveContainerCoords = this._getRestrictiveContainerCoords(item);
        const {
            popupOptions: {slidingPanelOptions, desktopMode},
        } = item;
        return {
            minHeight: SlidingPanelStrategy.getMinHeight(item, restrictiveContainerCoords),
            maxHeight: SlidingPanelStrategy.getMaxHeight(item, restrictiveContainerCoords),
            height: this._getHeight(item),
            position: slidingPanelOptions.position,
            desktopMode,

            // Когда работаем через этот контроллер всегда работаем в режиме мобилки
            isMobileMode: true,
        };
    }

    protected _getRestrictiveContainerCoords(item: ISlidingPanelItem): IPopupPosition | void {
        const restrictiveContainer =
            item.popupOptions.slidingPanelOptions.restrictiveContainer || 'body';
        return BaseController.getCoordsByContainer(restrictiveContainer);
    }

    /**
     * Возвращает признак того, что драг на шторке был вертикальный
     * Только вертикальный драг считаем драгом для движения шторки,
     * горизонтальный драг игнорируем и возвращаем шторку к изначальному значению высоты.
     * @param offset
     * @private
     */
    private _isVerticalDrag(offset: IDragOffset, item: ISlidingPanelItem): boolean {
        if (!offset) {
            return false;
        }
        if (item.popupOptions?.slidingPanelOptions?.autoHeight && item.sizes?.width) {
            const isHorizontalDrag = Math.abs(offset.x) > item.sizes.width / 2;
            return (
                Math.abs(offset.y) > Math.abs(offset.x) ||
                (Math.abs(offset.y) > 0 && !isHorizontalDrag)
            );
        }
        return Math.abs(offset.y) > Math.abs(offset.x);
    }

    private _addPopupToList(item: ISlidingPanelItem): void {
        this._panels.push(item);
    }

    private _removePopupFromList(item: ISlidingPanelItem): void {
        const index = this._panels.indexOf(item);
        if (index > -1) {
            this._panels.splice(index, 1);
        }
    }

    private _hasOpenedPopups(): boolean {
        return !!this._panels.length;
    }

    private _isTopPopup(item: ISlidingPanelItem): boolean {
        return this._panels.indexOf(item) === this._panels.length - 1;
    }

    protected _updatePopupSizes(item: ISlidingPanelItem, container: HTMLDivElement): void {
        item.previousSizes = item.sizes;
        item.sizes = this._getPopupSizes(item, container);
    }

    /**
     * Нужно для:
     * 1. Сафари, чтобы body не тянулся
     * 2. Для Android, чтобы при закрытии шторки не вызывалось обновление страницы(свайп вниз)
     * https://online.sbis.ru/opendoc.html?guid=2e549898-5980-49bc-b4b7-e0a27f02bf55
     * @param state
     * @private
     */
    private _toggleCancelBodyDragging(state: boolean): void {
        if (constants.isBrowserPlatform) {
            document.documentElement.style.overflow = state ? 'hidden' : '';
        }
    }

    /**
     * Получение текущей высоты шторки.
     * Если включена опция autoHeight и пользователь сам не менял высоту шторки,
     * то в позиции её не будет, берём с контейнера.
     * @param item
     * @private
     */
    private _getHeight(item: ISlidingPanelItem): number {
        return item.position.height || item.sizes?.height;
    }
}

export default new Controller();
