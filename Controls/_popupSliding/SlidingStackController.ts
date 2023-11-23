/**
 * @kaizen_zone 5d04426f-0434-472a-b02c-eecab5eb3c36
 */
import { BaseController } from 'Controls/popupTemplateStrategy';
import { Controller as PopupController, ISlidingPanelPopupOptions } from 'Controls/popup';
import * as PopupContent from 'wml!Controls/_popupSliding/SlidingPanelContent';
import SlidingStackStrategy, { AnimationState, ISlidingStackPanelItem, } from './SlidingStackStrategy';

const ANIMATION_CLASS = 'controls-SlidingPanel__animation';
const MAX_DELAY_ANIMATION = 800;

class Controller extends BaseController {
    TYPE: string = 'SlidingStackPanel';
    private _destroyPromiseResolvers: Record<string, Function> = {};
    private _panels: ISlidingStackPanelItem[] = [];

    elementCreated(item: ISlidingStackPanelItem): boolean {
        this._updatePopupSizes(item);
        // После создания запускаем анимацию изменив позицию
        item.position = SlidingStackStrategy.getShowingPosition(item);
        item.popupOptions.workspaceWidth = this._getWorkspaceWidth(item);
        item.animationState = AnimationState.showing;

        this._addPopupToList(item);
        return true;
    }

    private _getWorkspaceWidth(item: ISlidingStackPanelItem): number {
        return item.position.width || item.sizes.width;
    }

    elementUpdated(
        item: ISlidingStackPanelItem,
        container: HTMLDivElement,
        isOrientationChanging?: boolean
    ): boolean {
        this._updatePopupSizes(item);
        return true;
    }

    elementDestroyed(item: ISlidingStackPanelItem): Promise<void> {
        // Если попап еще не замаунчен, то просто закрываем без анимации
        if (!this._isPopupOpened(item)) {
            this._finishPopupClosing(item);
            return Promise.resolve(null);
        }

        // Запускаем анимацию закрытия и откладываем удаление до её окончания
        item.position = SlidingStackStrategy.getHidingPosition(item);
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

    elementAnimated(item: ISlidingStackPanelItem): boolean {
        if (item.animationState === 'showing') {
            item.position = SlidingStackStrategy.getPosition(item);
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

    protected _initItemAnimation(item: ISlidingStackPanelItem): void {
        item.popupOptions.className = `${
            item.popupOptions.className || ''
        } controls-SlidingPanel__popup
            ${ANIMATION_CLASS} controls_popupSliding_theme-${PopupController.getTheme()}`;
        item.animationState = AnimationState.initializing;
        if (item.popupState !== item.controller.POPUP_STATE_INITIALIZING) {
            item.popupOptions.className += ' controls-Popup_shown';
        }
    }

    getDefaultConfig(item: ISlidingStackPanelItem): void | Promise<void> {
        item.position = item.position = SlidingStackStrategy.getStartPosition(item);
        this._initItemAnimation(item);
        item.popupOptions.workspaceWidth = this._getWorkspaceWidth(item);
        item.popupOptions.content = PopupContent;
        item.popupOptions.slidingPanelData = this._getPopupTemplatePosition(item);
    }

    private _getPopupTemplatePosition(
        item: ISlidingStackPanelItem
    ): ISlidingPanelPopupOptions['slidingPanelOptions'] {
        const {
            popupOptions: { slidingPanelOptions, desktopMode },
        } = item;
        return {
            height: this._getHeight(item),
            position: slidingPanelOptions?.position || 'bottom',
            desktopMode,

            // Когда работаем через этот контроллер всегда работаем в режиме мобилки
            isMobileMode: true,
        };
    }

    resizeOuter(item: ISlidingStackPanelItem): boolean {
        if (item.popupState !== item.controller.POPUP_STATE_DESTROYING) {
            this._updatePopupSizes(item);
            item.position = SlidingStackStrategy.getPosition(item);
            return true;
        }
        return false;
    }

    private _finishPopupClosing(item: ISlidingStackPanelItem): void {
        this._removePopupFromList(item);
    }

    private _isPopupOpened(item: ISlidingStackPanelItem): boolean {
        return (
            item.animationState !== AnimationState.initializing &&
            item.animationState !== AnimationState.showing
        );
    }

    private _addPopupToList(item: ISlidingStackPanelItem): void {
        this._panels.push(item);
    }

    private _removePopupFromList(item: ISlidingStackPanelItem): void {
        const index = this._panels.indexOf(item);
        if (index > -1) {
            this._panels.splice(index, 1);
        }
    }

    private _getHeight(item: ISlidingStackPanelItem): number {
        return item.position.height || item.sizes?.height;
    }

    private _hasOpenedPopups(): boolean {
        return !!this._panels.length;
    }

    protected _updatePopupSizes(item: ISlidingStackPanelItem): void {
        item.sizes = SlidingStackStrategy.getSizes();
    }
}

export default new Controller();
