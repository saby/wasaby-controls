/**
 * @kaizen_zone 415f8e65-d46f-4ddb-9ea8-ac88f526e8b5
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_compatiblePopup/Global/Global';
import { GlobalController } from 'Controls/popupTemplateStrategy';
import { Bus as EventBus } from 'Env/Event';

/**
 * @private
 */

export default class Global extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    private _globalController: GlobalController = new GlobalController();

    protected _afterMount(): void {
        this._globalController.registerGlobalPopup();
        const channelPopupManager = EventBus.channel('popupManager');
        channelPopupManager.subscribe(
            'managerPopupBeforeDestroyed',
            this._popupBeforeDestroyedHandler,
            this
        );
    }

    protected _beforeUnmount(): void {
        this._globalController.registerGlobalPopupEmpty();
        const channelPopupManager = EventBus.channel('popupManager');
        channelPopupManager.unsubscribe(
            'managerPopupBeforeDestroyed',
            this._popupBeforeDestroyedHandler,
            this
        );
    }

    protected _openInfoBoxHandler(event, config, withDelay?: boolean): void {
        this._globalController.openInfoBoxHandler(event, config, withDelay);
    }

    protected _closeInfoBoxHandler(event, withDelay?: boolean): void {
        this._globalController.closeInfoBoxHandler(event, withDelay);
    }

    protected _forceCloseInfoBoxHandler(): void {
        this._globalController.forceCloseInfoBoxHandler();
    }

    protected _openPreviewerHandler(event, config, type): void {
        return this._globalController.openPreviewerHandler(event, config, type);
    }

    protected _closePreviewerHandler(event, type): void {
        this._globalController.closePreviewerHandler(event, type);
    }

    protected _cancelPreviewerHandler(event, action): void {
        this._globalController.cancelPreviewerHandler(event, action);
    }

    protected _isPreviewerOpenedHandler(event): boolean {
        return this._globalController.isPreviewerOpenedHandler(event);
    }

    protected _openDialogHandler(event, tmpl, templateOptions, opener = null): Promise<unknown> {
        return this._globalController.openDialogHandler(event, tmpl, templateOptions, opener);
    }

    private _popupBeforeDestroyedHandler(event, popupCfg, popupList, popupContainer): void {
        this._globalController.popupBeforeDestroyedHandler(
            event,
            popupCfg,
            popupList,
            popupContainer
        );
    }
}
