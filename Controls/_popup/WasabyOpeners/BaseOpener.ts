/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_popup/WasabyOpeners/BaseOpener';
import GlobalController from 'Controls/_popup/Popup/GlobalController';
import { IBasePopupOptions } from 'Controls/_popup/interface/IBaseOpener';
import { IPreviewerPopupOptions } from 'Controls/_popup/interface/IPreviewerOpener';
import BaseOpenerUtil from './BaseOpenerUtil';
import { showDialog } from 'Controls/_popup/utils/openPopup';
import type { IActiveTheme } from 'UI/Theme';

export interface IBaseOpenerOptions extends IBasePopupOptions, IControlOptions {
    id?: string;
    closePopupBeforeUnmount?: boolean;
}

/**
 * Базовый опенер окон, вставляемых в верстку
 * @implements IBaseOpenerOptions
 * @private
 */
export default class BaseOpener<
    TBaseOpenerOptions extends IBaseOpenerOptions = {},
> extends Control<TBaseOpenerOptions> {
    protected _template: TemplateFunction = template;
    protected _popupOpener: any;

    protected _activeTheme: IActiveTheme;

    protected _beforeMount() {
        this._getContextValue = this._getContextValue.bind(this);
    }

    protected _beforeUnmount(): void {
        if (this._options.closePopupBeforeUnmount) {
            this._popupOpener?.destroy();
        }
    }

    protected _getContextValue(activeTheme: IActiveTheme) {
        this._activeTheme = activeTheme;
    }

    open(popupOptions: TBaseOpenerOptions = {}): Promise<string | undefined> {
        if (this._activeTheme && popupOptions && popupOptions.shouldInheritOpenerTheme !== false) {
            popupOptions.activeTheme = this._activeTheme;
        }

        if (!popupOptions.hasOwnProperty('opener')) {
            popupOptions.opener = this._container;
        }

        this._popupHandler = this._popupHandler.bind(this);

        popupOptions._events = {
            onOpen: this._popupHandler,
            onResult: this._popupHandler,
            onClose: this._popupHandler,
        };
        const options = BaseOpenerUtil.getConfig(this._options, popupOptions);
        return this._popupOpener.open(options);
    }

    close(): void {
        this._popupOpener.close();
    }

    protected _popupHandler(eventName: string, args: any[]): void {
        if (!this._destroyed && this._mounted) {
            const event = eventName.substr(2).toLowerCase();
            this._notify(event, args);
        }
    }

    isOpened(): boolean {
        return this._popupOpener.isOpened();
    }

    isShowing(): boolean {
        return this._popupOpener.isShowing();
    }

    static closePopup(popupId: string): void {
        GlobalController.getController()?.remove(popupId);
    }

    static isOpenedPopup(config: IPreviewerPopupOptions): boolean {
        return config && !!GlobalController.getController()?.find(config.id);
    }

    // compatible
    static showDialog(template, config, controller) {
        return showDialog(template, config, controller);
    }

    // compatible
    static getManager(): Promise<void> {
        return BaseOpenerUtil.getManager();
    }

    static getDefaultOptions(): IBaseOpenerOptions {
        return {
            showIndicator: true,
            closePopupBeforeUnmount: true,
        };
    }
}
