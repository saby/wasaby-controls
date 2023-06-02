/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { SyntheticEvent } from 'Vdom/Vdom';
import type { ManagerWrapper } from 'Controls/compatiblePopup';
import type { Global } from 'Controls/popup';
import type { Control } from 'UI/Base';

export default {
    _managerWrapper: null,
    _globalPopup: null,
    _theme: undefined,
    registerManager(ManagerWrapper: ManagerWrapper): void {
        this._managerWrapper = ManagerWrapper;
    },
    registerGlobalPopup(GlobalPopup: Global): void {
        this._globalPopup = GlobalPopup;
    },
    getManagerWrapper(): ManagerWrapper {
        return this._managerWrapper;
    },
    getGlobalPopup(): Global {
        return this._globalPopup;
    },
    getTheme(): string {
        return this._theme;
    },
    setTheme(theme: string): void {
        this._theme = theme;
        this._managerWrapper?.setTheme(theme);
    },
    registerGlobalPopupOpeners(GlobalPopupOpeners): void {
        this._globalPopupOpeners = GlobalPopupOpeners;
    },
    getGlobalPopupOpeners() {
        return this._globalPopupOpeners;
    },
    scrollHandler(container: HTMLElement) {
        if (this._managerWrapper) {
            this._managerWrapper._scrollHandler(container);
        }
    },
    registerListener(
        event: Event,
        registerType: string,
        component: Control,
        callback: (...args: unknown[]) => void
    ): void {
        if (this._managerWrapper) {
            this._managerWrapper.registerListener(
                event,
                registerType,
                component,
                callback
            );
        }
    },
    unregisterListener(
        event: Event,
        registerType: string,
        component: Control
    ): void {
        if (this._managerWrapper) {
            this._managerWrapper.unregisterListener(
                event,
                registerType,
                component
            );
        }
    },

    getMaxZIndex() {
        if (this._managerWrapper) {
            return this._managerWrapper.getMaxZIndex();
        }
        return 0;
    },

    startResizeEmitter(): void {
        if (this._managerWrapper) {
            const eventCfg = {
                type: 'controlResize',
            };
            this._managerWrapper.startResizeEmitter(
                new SyntheticEvent(null, eventCfg)
            );
        }
    },
};
